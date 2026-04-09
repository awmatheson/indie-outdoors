import { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import * as d3 from 'd3';
import { useNavigate } from 'react-router-dom';
import { colors, fonts, slugify } from '../theme';
import { MdInline } from './Md';
import { OWNERSHIP_GROUPS, SUMMARY_STATS, type OwnershipGroup, type OwnershipType } from '../data/ownershipData';

// ─── Color + label maps ────────────────────────────────────────

const TYPE_COLOR: Record<OwnershipType, string> = {
  conglomerate: colors.conglomerate,
  pe:           colors.peOwned,
  independent:  colors.independent,
  'co-op':      colors.employeeOwned,
};

const TYPE_LABEL: Record<OwnershipType, string> = {
  conglomerate: 'Conglomerate',
  pe:           'PE-Backed',
  independent:  'Independent',
  'co-op':      'Co-op / Employee-Owned',
};

// ─── D3 hierarchy builder ──────────────────────────────────────

interface HierarchyDatum {
  name: string;
  groupId?: string;
  type?: OwnershipType;
  note?: string;
  brandNote?: string;
  value?: number;
  children?: HierarchyDatum[];
}

function buildHierarchy(): HierarchyDatum {
  return {
    name: 'root',
    children: OWNERSHIP_GROUPS.map((g) => ({
      name: g.name,
      groupId: g.id,
      type: g.type,
      note: g.note,
      children: g.brands.map((b) => ({
        name: b.name,
        groupId: g.id,
        type: g.type,
        brandNote: b.note,
        value: 1,
      })),
    })),
  };
}

// ─── Summary bar ──────────────────────────────────────────────

const LEGEND = [
  { type: 'independent' as OwnershipType, label: 'Independent', count: SUMMARY_STATS.independent },
  { type: 'pe' as OwnershipType,           label: 'PE-Backed',   count: SUMMARY_STATS.peOwned },
  { type: 'conglomerate' as OwnershipType, label: 'Conglomerate',count: SUMMARY_STATS.conglomerate },
  { type: 'co-op' as OwnershipType,        label: 'Co-op',        count: 2 },
];

function SummaryBar() {
  const total = SUMMARY_STATS.total;
  return (
    <Box sx={{ bgcolor: colors.surface, borderBottom: `1px solid ${colors.ridgeline}22`, py: 2.5 }}>
      <Container maxWidth="xl">
        {/* Proportional bar */}
        <Box sx={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', mb: 2.5, bgcolor: colors.bg }}>
          {LEGEND.map(({ type, count }) => (
            <Box
              key={type}
              sx={{
                width: `${(count / total) * 100}%`,
                bgcolor: TYPE_COLOR[type],
                opacity: 0.85,
              }}
            />
          ))}
        </Box>

        {/* Legend + counts */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2.5, md: 4 } }}>
          {LEGEND.map(({ type, label, count }) => (
            <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: TYPE_COLOR[type], flexShrink: 0 }} />
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', color: colors.textSecondary, letterSpacing: '0.04em' }}>
                {label}
              </Typography>
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', color: colors.text, fontWeight: 600, letterSpacing: '0.04em' }}>
                {count}
              </Typography>
            </Box>
          ))}
          <Box sx={{ ml: { xs: 0, md: 'auto' }, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', color: colors.textSecondary, letterSpacing: '0.04em' }}>
              {total} brands tracked
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// ─── Main component ────────────────────────────────────────────

export default function OwnershipMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<{
    x: number; y: number;
    name: string; parent: string; type: OwnershipType; note?: string;
  } | null>(null);
  const [activeType, setActiveType] = useState<OwnershipType | null>(null);

  useEffect(() => {
    draw();
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeType]);

  function draw() {
    if (!svgRef.current || !containerRef.current) return;
    const el = containerRef.current;
    const W = el.clientWidth;
    const H = el.clientHeight;
    if (W === 0 || H === 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${W} ${H}`)
      .attr('width', W)
      .attr('height', H);

    // ── Hierarchy + pack ─────────────────────────────────────

    const root = d3.hierarchy<HierarchyDatum>(buildHierarchy())
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    d3.pack<HierarchyDatum>()
      .size([W, H])
      .padding((d) => {
        if (d.depth === 0) return 28;
        if (d.depth === 1) return 6;
        return 0;
      })(root);

    // After pack(), nodes have x, y, r — cast to the circular type
    type CircNode = d3.HierarchyCircularNode<HierarchyDatum>;
    const nodes = root.descendants() as CircNode[];
    const groupNodes = nodes.filter((d) => d.depth === 1);
    const brandNodes = nodes.filter((d) => d.depth === 2);

    // Dim inactive groups
    const isActive = (type: OwnershipType) =>
      activeType === null || activeType === type;

    // Group background circles
    svg.selectAll<SVGCircleElement, d3.HierarchyCircularNode<HierarchyDatum>>('.group-circle')
      .data(groupNodes)
      .join('circle')
      .attr('class', 'group-circle')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('r', (d) => d.r)
      .attr('fill', (d) => TYPE_COLOR[d.data.type!])
      .attr('fill-opacity', (d) => isActive(d.data.type!) ? 0.08 : 0.03)
      .attr('stroke', (d) => TYPE_COLOR[d.data.type!])
      .attr('stroke-opacity', (d) => isActive(d.data.type!) ? 0.35 : 0.12)
      .attr('stroke-width', 1.5);

    // Group labels (show when circle is large enough)
    svg.selectAll<SVGTextElement, d3.HierarchyCircularNode<HierarchyDatum>>('.group-label')
      .data(groupNodes.filter((d) => d.r > 36))
      .join('text')
      .attr('class', 'group-label')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y - d.r + 18)
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => TYPE_COLOR[d.data.type!])
      .attr('fill-opacity', (d) => isActive(d.data.type!) ? 0.9 : 0.3)
      .attr('font-size', (d) => Math.min(11, Math.max(8, d.r * 0.18)))
      .attr('font-family', fonts.mono)
      .attr('font-weight', '600')
      .attr('letter-spacing', '0.06em')
      .attr('pointer-events', 'none')
      .text((d) => d.data.name.toUpperCase());

    // ── Brand circles (depth 2) ───────────────────────────────

    const brandG = svg.selectAll<SVGGElement, d3.HierarchyCircularNode<HierarchyDatum>>('.brand-node')
      .data(brandNodes)
      .join('g')
      .attr('class', 'brand-node')
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .attr('cursor', 'pointer')
      .attr('opacity', (d) => isActive(d.data.type!) ? 1 : 0.2);

    brandG.append('circle')
      .attr('r', (d) => d.r)
      .attr('fill', (d) => TYPE_COLOR[d.data.type!])
      .attr('fill-opacity', 0.75)
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', (d) => d.r > 12 ? 1.5 : 1);

    // Brand name (only when circle is wide enough)
    brandG.filter((d) => d.r >= 16)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#FFFFFF')
      .attr('font-size', (d) => Math.min(10, Math.max(7, d.r * 0.32)))
      .attr('font-family', fonts.mono)
      .attr('font-weight', '500')
      .attr('pointer-events', 'none')
      .each(function (d) {
        const words = d.data.name.split(/\s+/);
        const el = d3.select(this);
        if (words.length === 1 || d.r < 22) {
          el.text(d.data.name.length > 10 ? d.data.name.slice(0, 9) + '…' : d.data.name);
        } else {
          // Two-line for wider circles
          const mid = Math.ceil(words.length / 2);
          const line1 = words.slice(0, mid).join(' ');
          const line2 = words.slice(mid).join(' ');
          const fs = Math.min(10, Math.max(7, d.r * 0.28));
          el.append('tspan').attr('x', 0).attr('dy', `-${fs * 0.6}px`).text(line1);
          el.append('tspan').attr('x', 0).attr('dy', `${fs * 1.3}px`).text(line2);
        }
      });

    // ── Interactions ──────────────────────────────────────────

    brandG
      .on('mouseenter', function (event, d) {
        d3.select(this).select('circle')
          .attr('fill-opacity', 1)
          .attr('stroke', colors.ridgeline)
          .attr('stroke-width', 2);

        const rect = containerRef.current!.getBoundingClientRect();
        const parentGroup = OWNERSHIP_GROUPS.find((g) => g.id === d.data.groupId);
        setTooltip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          name: d.data.name,
          parent: parentGroup?.name ?? '',
          type: d.data.type!,
          note: d.data.brandNote,
        });
      })
      .on('mousemove', function (event) {
        const rect = containerRef.current!.getBoundingClientRect();
        setTooltip((prev) =>
          prev ? { ...prev, x: event.clientX - rect.left, y: event.clientY - rect.top } : null
        );
      })
      .on('mouseleave', function (_event, d) {
        d3.select(this).select('circle')
          .attr('fill-opacity', 0.75)
          .attr('stroke', '#FFFFFF')
          .attr('stroke-width', d.r > 12 ? 1.5 : 1);
        setTooltip(null);
      })
      .on('click', function (_event, d) {
        navigate(`/directory/${slugify(d.data.name)}`);
      });

    // Touch support for mobile
    brandG.on('touchstart', function (event, d) {
      event.preventDefault();
      const touch = event.touches[0];
      const rect = containerRef.current!.getBoundingClientRect();
      const parentGroup = OWNERSHIP_GROUPS.find((g) => g.id === d.data.groupId);
      setTooltip({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        name: d.data.name,
        parent: parentGroup?.name ?? '',
        type: d.data.type!,
        note: d.data.brandNote,
      });
    }, { passive: false });
  }

  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ bgcolor: colors.forest, pt: { xs: 8, md: 10 }, pb: { xs: 5, md: 6 } }}>
        <Container maxWidth="xl">
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.ridgeline, mb: 2 }}>
            Network Map
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, color: '#FFFFFF', mb: 1 }}>
                Ownership Map
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9375rem', maxWidth: 520 }}>
                Each circle is a brand. Each cluster is its owner. Size reflects the number of brands in a portfolio.
              </Typography>
            </Box>

            {/* Type filter */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {(Object.entries(TYPE_LABEL) as [OwnershipType, string][]).map(([type, label]) => (
                <Box
                  key={type}
                  onClick={() => setActiveType((prev) => prev === type ? null : type)}
                  sx={{
                    px: 1.75,
                    py: 0.625,
                    borderRadius: 20,
                    border: `1px solid ${activeType === type ? TYPE_COLOR[type] : 'rgba(255,255,255,0.2)'}`,
                    bgcolor: activeType === type ? TYPE_COLOR[type] + '28' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    '&:hover': { borderColor: TYPE_COLOR[type] },
                  }}
                >
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: TYPE_COLOR[type], flexShrink: 0 }} />
                  <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.625rem', letterSpacing: '0.07em', color: activeType === type ? '#FFFFFF' : 'rgba(255,255,255,0.6)', fontWeight: activeType === type ? 600 : 400 }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Summary bar */}
      <SummaryBar />

      {/* Chart */}
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '70vh', md: '78vh' },
          bgcolor: colors.bg,
        }}
      >
        <svg
          ref={svgRef}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />

        {/* Tooltip */}
        {tooltip && (
          <Box
            sx={{
              position: 'absolute',
              left: Math.min(tooltip.x + 12, (containerRef.current?.clientWidth ?? 400) - 220),
              top: Math.max(tooltip.y - 90, 8),
              bgcolor: colors.forest,
              px: 2.5,
              py: 2,
              borderRadius: 1,
              pointerEvents: 'none',
              zIndex: 10,
              maxWidth: 210,
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: TYPE_COLOR[tooltip.type], flexShrink: 0 }} />
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.5625rem', color: TYPE_COLOR[tooltip.type], letterSpacing: '0.09em', textTransform: 'uppercase', fontWeight: 600 }}>
                {TYPE_LABEL[tooltip.type]}
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: '0.9375rem', color: '#FFFFFF', lineHeight: 1.25, mb: 0.25 }}>
              {tooltip.name}
            </Typography>
            {tooltip.parent && (
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.625rem', color: colors.ridgeline, letterSpacing: '0.06em', mb: tooltip.note ? 0.75 : 0 }}>
                {tooltip.parent}
              </Typography>
            )}
            {tooltip.note && (
              <Typography sx={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.45, mt: 0.5 }}>
                {tooltip.note}
              </Typography>
            )}
            <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', mt: 1, letterSpacing: '0.08em' }}>
              TAP FOR PROFILE
            </Typography>
          </Box>
        )}

        {/* Key */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            bgcolor: 'rgba(27,42,33,0.82)',
            px: 2,
            py: 1.5,
            borderRadius: 1,
            backdropFilter: 'blur(4px)',
          }}
        >
          {(Object.entries(TYPE_LABEL) as [OwnershipType, string][]).map(([type, label]) => (
            <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, '&:last-child': { mb: 0 } }}>
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: TYPE_COLOR[type], flexShrink: 0 }} />
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.5625rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em' }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Owner detail list below chart */}
      <Box sx={{ bgcolor: colors.surface, borderTop: `1px solid ${colors.ridgeline}22`, py: { xs: 6, md: 8 } }}>
        <Container maxWidth="xl">
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textSecondary, mb: 4 }}>
            Ownership Groups
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 2,
            }}
          >
            {OWNERSHIP_GROUPS.filter((g) => g.id !== 'independent').map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

function GroupCard({ group }: { group: OwnershipGroup }) {
  const typeColor = TYPE_COLOR[group.type];
  const typeLabel = TYPE_LABEL[group.type];

  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        border: `1px solid ${colors.surface}`,
        borderRadius: 1.5,
        p: 2.5,
        borderLeft: `3px solid ${typeColor}`,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <Typography sx={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: '0.9375rem', color: colors.text, lineHeight: 1.25 }}>
          {group.name}
        </Typography>
        <Box sx={{ px: 1, py: 0.25, bgcolor: typeColor + '18', borderRadius: 0.5, flexShrink: 0, ml: 1 }}>
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.5625rem', color: typeColor, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            {typeLabel}
          </Typography>
        </Box>
      </Box>

      {group.note && (
        <Typography sx={{ fontSize: '0.8125rem', color: colors.textSecondary, lineHeight: 1.5, mb: 1.5 }}>
          <MdInline>{group.note}</MdInline>
        </Typography>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.625 }}>
        {group.brands.map((b) => (
          <Box
            key={b.name}
            sx={{
              px: 1,
              py: 0.25,
              bgcolor: colors.surface,
              borderRadius: 0.5,
              fontFamily: fonts.mono,
              fontSize: '0.625rem',
              color: colors.textSecondary,
              letterSpacing: '0.04em',
            }}
          >
            {b.name}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
