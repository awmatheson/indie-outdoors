import { useEffect, useState, useRef } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import * as d3 from 'd3';
import { colors, fonts, getOwnershipColor, getOwnershipLabel, slugify } from '../theme';
import { useNavigate } from 'react-router-dom';

interface CompanyData {
  Company: string;
  'Business Category': string;
  'Main Sport Focus': string;
  'Year Founded': string;
  'Ownership Status': string;
  'Ownership Details': string;
  'Parent Company': string;
  Headquarters: string;
  'Environmental & Sustainability Policies': string;
  'Acquisition History': string;
  Financials: string;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  group: string;
  ownershipStatus: string;
  isParent: boolean;
  company: CompanyData | null;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: GraphNode;
  target: GraphNode;
}

type ViewMode = 'network' | 'treemap';

const LEGEND_ITEMS = [
  { color: colors.independent, label: 'Independent' },
  { color: colors.employeeOwned, label: 'Employee-Owned' },
  { color: colors.peOwned, label: 'PE / Holding Co.' },
  { color: colors.conglomerate, label: 'Conglomerate / Public' },
];

export default function OwnershipMap() {
  const [data, setData] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('network');
  const [tooltip, setTooltip] = useState<{ x: number; y: number; company: CompanyData } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = import.meta.env.BASE_URL;
        const csvPath = baseUrl === '/' ? '/companies.csv' : `${baseUrl}companies.csv`;
        const response = await axios.get(csvPath);
        const parsed = d3.csvParse(response.data) as CompanyData[];
        setData(parsed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length === 0 || !svgRef.current || !containerRef.current || viewMode !== 'network') return;
    drawNetworkGraph();
  }, [data, searchTerm, viewMode]);

  useEffect(() => {
    if (data.length === 0 || !svgRef.current || !containerRef.current || viewMode !== 'treemap') return;
    drawTreemap();
  }, [data, viewMode]);

  const drawNetworkGraph = () => {
    if (!svgRef.current || !containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('background-color', colors.bg);

    // Defs
    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', `${colors.ridgeline}55`);

    const g = svg.append('g');

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.15, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setTooltip(null);
      });
    svg.call(zoom);

    // Build graph
    const filteredData = searchTerm
      ? data.filter(c =>
          c.Company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c['Parent Company']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c['Ownership Status']?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : data;

    // Collect parent company nodes
    const parentNames = new Set<string>();
    filteredData.forEach(c => {
      if (c['Parent Company'] && c['Parent Company'].toLowerCase() !== 'independent' && c['Parent Company'].trim() !== '') {
        parentNames.add(c['Parent Company'].trim());
      }
    });

    const nodes: GraphNode[] = [];
    const nodeMap = new Map<string, GraphNode>();

    // Add parent nodes first
    parentNames.forEach(name => {
      const node: GraphNode = { id: name, group: 'parent', ownershipStatus: 'Public', isParent: true, company: null };
      nodes.push(node);
      nodeMap.set(name, node);
    });

    // Add company nodes
    filteredData.forEach(c => {
      if (!nodeMap.has(c.Company)) {
        const node: GraphNode = {
          id: c.Company,
          group: (c['Business Category'] || c['Main Sport Focus'] || '').split(',')[0].trim(),
          ownershipStatus: c['Ownership Status'],
          isParent: false,
          company: c,
        };
        nodes.push(node);
        nodeMap.set(c.Company, node);
      }
    });

    // Build links
    const links: GraphLink[] = [];
    filteredData.forEach(c => {
      if (c['Parent Company'] && c['Parent Company'].toLowerCase() !== 'independent' && c['Parent Company'].trim() !== '') {
        const parentNode = nodeMap.get(c['Parent Company'].trim());
        const childNode = nodeMap.get(c.Company);
        if (parentNode && childNode && parentNode !== childNode) {
          links.push({ source: parentNode, target: childNode });
        }
      }
    });

    // Simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(120).strength(0.8))
      .force('charge', d3.forceManyBody().strength(d => (d as GraphNode).isParent ? -600 : -200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(d => (d as GraphNode).isParent ? 40 : 18))
      .alphaDecay(0.028);

    // Links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', `${colors.ridgeline}44`)
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#arrow)');

    // Nodes
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', d => d.company ? 'pointer' : 'default');

    // Circles
    node.append('circle')
      .attr('r', d => d.isParent ? 28 : 10)
      .attr('fill', d => {
        if (d.isParent) return colors.conglomerate + 'CC';
        return getOwnershipColor(d.ownershipStatus) + 'CC';
      })
      .attr('stroke', d => {
        const isHighlighted = searchTerm && d.id.toLowerCase().includes(searchTerm.toLowerCase());
        return isHighlighted ? colors.trail : (d.isParent ? colors.ridgeline : getOwnershipColor(d.ownershipStatus));
      })
      .attr('stroke-width', d => {
        const isHighlighted = searchTerm && d.id.toLowerCase().includes(searchTerm.toLowerCase());
        return isHighlighted ? 2.5 : (d.isParent ? 1.5 : 1);
      });

    // Labels
    node.append('text')
      .text(d => d.isParent ? d.id : (d.id.length > 14 ? d.id.substring(0, 13) + '…' : d.id))
      .attr('dy', d => d.isParent ? '0.35em' : -14)
      .attr('text-anchor', 'middle')
      .attr('fill', d => d.isParent ? '#FFFFFF' : colors.text)
      .attr('font-size', d => d.isParent ? '9px' : '8px')
      .attr('font-family', fonts.mono)
      .attr('pointer-events', 'none');

    // Interactions
    node
      .on('mouseover', (event, d) => {
        if (d.company) {
          const rect = containerRef.current!.getBoundingClientRect();
          setTooltip({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            company: d.company,
          });
        }
      })
      .on('mousemove', (event, d) => {
        if (d.company) {
          const rect = containerRef.current!.getBoundingClientRect();
          setTooltip(prev => prev ? { ...prev, x: event.clientX - rect.left, y: event.clientY - rect.top } : null);
        }
      })
      .on('mouseout', () => setTooltip(null))
      .on('click', (_event, d) => {
        if (d.company) {
          navigate(`/directory/${slugify(d.company.Company)}`);
        }
      });

    // Drag — cast to concrete SVGGElement selection to satisfy D3 types
    (node as unknown as d3.Selection<SVGGElement, GraphNode, SVGGElement, unknown>).call(
      d3.drag<SVGGElement, GraphNode>()
        .on('start', (event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
    );

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x ?? 0)
        .attr('y1', d => (d.source as GraphNode).y ?? 0)
        .attr('x2', d => (d.target as GraphNode).x ?? 0)
        .attr('y2', d => (d.target as GraphNode).y ?? 0);

      node.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    // Zoom to highlighted nodes
    if (searchTerm) {
      setTimeout(() => {
        const highlighted = nodes.filter(n => n.id.toLowerCase().includes(searchTerm.toLowerCase()));
        if (highlighted.length > 0) {
          const cx = highlighted.reduce((s, n) => s + (n.x ?? 0), 0) / highlighted.length;
          const cy = highlighted.reduce((s, n) => s + (n.y ?? 0), 0) / highlighted.length;
          svg.transition().duration(600).call(
            zoom.transform,
            d3.zoomIdentity.translate(width / 2 - cx * 1.5, height / 2 - cy * 1.5).scale(1.5)
          );
        }
      }, 1200);
    }

    return () => simulation.stop();
  };

  const drawTreemap = () => {
    if (!svgRef.current || !containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Group by ownership type
    const groups: Record<string, CompanyData[]> = {
      Independent: [],
      'PE-Owned': [],
      'Public / Subsidiary': [],
      'Employee-Owned': [],
    };

    data.forEach(c => {
      const s = c['Ownership Status']?.toLowerCase() ?? '';
      if (s.includes('employee') || s.includes('esop')) groups['Employee-Owned'].push(c);
      else if (s.includes('family') || s.includes('independent') || (s.includes('private') && !s.includes('equity') && !s.includes('pe'))) groups['Independent'].push(c);
      else if (s.includes('pe') || s.includes('equity') || s.includes('altamont') || s.includes('capital partners')) groups['PE-Owned'].push(c);
      else groups['Public / Subsidiary'].push(c);
    });

    const hierarchyData = {
      name: 'root',
      children: Object.entries(groups).map(([name, companies]) => ({
        name,
        value: companies.length,
        children: companies.map(c => ({ name: c.Company, value: 1, company: c })),
      })),
    };

    const root = d3.hierarchy(hierarchyData)
      .sum(d => (d as any).value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    d3.treemap<typeof hierarchyData>()
      .size([width, height])
      .paddingOuter(8)
      .paddingTop(28)
      .paddingInner(2)(root as any);

    const groupColors: Record<string, string> = {
      'Independent': colors.independent,
      'PE-Owned': colors.peOwned,
      'Public / Subsidiary': colors.conglomerate,
      'Employee-Owned': colors.employeeOwned,
    };

    const cell = svg.selectAll('g')
      .data((root as any).descendants().filter((d: any) => d.depth > 0))
      .join('g')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`);

    cell.append('rect')
      .attr('width', (d: any) => Math.max(0, d.x1 - d.x0))
      .attr('height', (d: any) => Math.max(0, d.y1 - d.y0))
      .attr('fill', (d: any) => {
        if (d.depth === 1) return groupColors[d.data.name] ?? colors.textSecondary;
        const parentName = (d.parent as any)?.data?.name ?? '';
        return (groupColors[parentName] ?? colors.textSecondary) + '44';
      })
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 1)
      .attr('rx', 2)
      .attr('cursor', (d: any) => d.depth === 2 ? 'pointer' : 'default')
      .on('click', (_event: any, d: any) => {
        if (d.depth === 2 && d.data.company) {
          navigate(`/directory/${slugify(d.data.company.Company)}`);
        }
      });

    cell.filter((d: any) => d.depth === 1)
      .append('text')
      .attr('x', 6)
      .attr('y', 18)
      .attr('fill', '#FFFFFF')
      .attr('font-size', '11px')
      .attr('font-family', fonts.mono)
      .attr('font-weight', '600')
      .attr('letter-spacing', '0.06em')
      .text((d: any) => `${d.data.name.toUpperCase()} (${d.value})`);

    cell.filter((d: any) => {
      const w = d.x1 - d.x0;
      const h = d.y1 - d.y0;
      return d.depth === 2 && w > 40 && h > 16;
    })
      .append('text')
      .attr('x', 4)
      .attr('y', 12)
      .attr('fill', (d: any) => {
        const parentName = (d.parent as any)?.data?.name ?? '';
        return groupColors[parentName] ?? colors.text;
      })
      .attr('font-size', '8px')
      .attr('font-family', fonts.mono)
      .text((d: any) => {
        const w = d.x1 - d.x0;
        const name = d.data.name as string;
        const charsToShow = Math.floor(w / 5.5);
        return name.length > charsToShow ? name.substring(0, charsToShow - 1) + '…' : name;
      });
  };

  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ bgcolor: colors.forest, pt: { xs: 8, md: 10 }, pb: { xs: 5, md: 6 } }}>
        <Container maxWidth="xl">
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.ridgeline, mb: 2 }}>
            Interactive Visualization
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, color: '#FFFFFF', mb: 1.5 }}>
                Ownership Map
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: 500 }}>
                Explore the web of parent companies, subsidiaries, and independents across the outdoor industry.
              </Typography>
            </Box>

            {/* View toggle */}
            <Box sx={{ display: 'flex', gap: 0.5, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 1, p: 0.5 }}>
              {(['network', 'treemap'] as ViewMode[]).map(mode => (
                <Box
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  sx={{
                    px: 2.5,
                    py: 0.875,
                    borderRadius: 0.75,
                    fontFamily: fonts.mono,
                    fontSize: '0.6875rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    color: viewMode === mode ? colors.forest : 'rgba(255,255,255,0.6)',
                    bgcolor: viewMode === mode ? colors.ridgeline : 'transparent',
                    transition: 'all 0.15s',
                    fontWeight: viewMode === mode ? 600 : 400,
                  }}
                >
                  {mode === 'network' ? 'Network' : 'Treemap'}
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Controls */}
      <Box sx={{ bgcolor: colors.surface, borderBottom: `1px solid ${colors.ridgeline}22`, py: 2 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Box
              component="input"
              type="search"
              placeholder="Search by company or parent…"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              sx={{
                px: 2,
                py: 1,
                border: `1px solid ${colors.ridgeline}66`,
                borderRadius: 1,
                fontFamily: fonts.sans,
                fontSize: '0.875rem',
                bgcolor: '#FFFFFF',
                color: colors.text,
                outline: 'none',
                width: { xs: '100%', sm: 260 },
                '&:focus': { borderColor: colors.trail },
                '&::placeholder': { color: colors.textSecondary },
              }}
            />

            {/* Legend */}
            <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', ml: { xs: 0, sm: 'auto' } }}>
              {LEGEND_ITEMS.map(({ color, label }) => (
                <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
                  <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.625rem', color: colors.textSecondary, letterSpacing: '0.06em' }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Graph Canvas */}
      <Box sx={{ position: 'relative', height: { xs: '65vh', md: '75vh' } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress sx={{ color: colors.trail }} />
          </Box>
        ) : (
          <>
            <Box ref={containerRef} sx={{ width: '100%', height: '100%', position: 'relative' }}>
              <svg ref={svgRef} style={{ width: '100%', height: '100%', display: 'block' }} />

              {/* Tooltip */}
              {tooltip && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: Math.min(tooltip.x + 12, (containerRef.current?.clientWidth ?? 400) - 240),
                    top: Math.max(tooltip.y - 80, 8),
                    bgcolor: colors.forest,
                    color: '#FFFFFF',
                    p: 2,
                    borderRadius: 1,
                    pointerEvents: 'none',
                    zIndex: 10,
                    maxWidth: 220,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  }}
                >
                  <Typography sx={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: '0.875rem', mb: 0.5 }}>
                    {tooltip.company.Company}
                  </Typography>
                  <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.625rem', color: colors.ridgeline, letterSpacing: '0.06em', mb: 1 }}>
                    {getOwnershipLabel(tooltip.company['Ownership Status'])}
                    {tooltip.company['Year Founded'] ? ` · Est. ${tooltip.company['Year Founded']}` : ''}
                  </Typography>
                  {tooltip.company['Parent Company'] && tooltip.company['Parent Company'].toLowerCase() !== 'independent' && (
                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                      Parent: {tooltip.company['Parent Company']}
                    </Typography>
                  )}
                  <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.5625rem', color: colors.ridgeline, mt: 1 }}>
                    Click to view profile →
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Instructions */}
            {viewMode === 'network' && (
              <Box sx={{ position: 'absolute', bottom: 16, right: 16, bgcolor: 'rgba(27,42,33,0.85)', color: 'rgba(255,255,255,0.6)', px: 2, py: 1.25, borderRadius: 1 }}>
                <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.5625rem', letterSpacing: '0.08em', lineHeight: 1.8 }}>
                  SCROLL TO ZOOM · DRAG TO PAN · CLICK NODE FOR PROFILE
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
