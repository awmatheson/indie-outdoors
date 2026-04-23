import { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Container, Typography } from '@mui/material';
import * as d3 from 'd3';
import { Link } from 'react-router-dom';
import { colors, fonts, slugify } from '../theme';
import { MdInline } from './Md';
import { OWNERSHIP_GROUPS, SUMMARY_STATS, type OwnershipGroup, type OwnershipType } from '../data/ownershipData';

// ─── Types & constants ─────────────────────────────────────────

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

interface HierarchyDatum {
  name: string;
  groupId?: string;
  type?: OwnershipType;
  note?: string;
  brandNote?: string;
  founded?: number;
  value?: number;
  children?: HierarchyDatum[];
}

interface PanelState {
  kind: 'brand' | 'group';
  name: string;
  type: OwnershipType;
  groupId: string;
  note?: string;
  founded?: number;
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
        founded: b.founded,
        value: 1,
      })),
    })),
  };
}

// ─── Summary bar ──────────────────────────────────────────────

const LEGEND = [
  { type: 'independent' as OwnershipType, label: 'Independent', count: SUMMARY_STATS.independent },
  { type: 'pe' as OwnershipType,          label: 'PE-Backed',   count: SUMMARY_STATS.peOwned },
  { type: 'conglomerate' as OwnershipType,label: 'Conglomerate',count: SUMMARY_STATS.conglomerate },
  { type: 'co-op' as OwnershipType,       label: 'Co-op',       count: 2 },
];

function SummaryBar() {
  const total = SUMMARY_STATS.total;
  return (
    <Box sx={{ bgcolor: colors.surface, borderBottom: `1px solid ${colors.ridgeline}22`, py: 2.5 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', mb: 2.5, bgcolor: colors.bg }}>
          {LEGEND.map(({ type, count }) => (
            <Box key={type} sx={{ width: `${(count / total) * 100}%`, bgcolor: TYPE_COLOR[type], opacity: 0.85 }} />
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2.5, md: 4 } }}>
          {LEGEND.map(({ type, label, count }) => (
            <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: TYPE_COLOR[type], flexShrink: 0 }} />
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', color: colors.textSecondary, letterSpacing: '0.04em' }}>{label}</Typography>
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', color: colors.text, fontWeight: 600, letterSpacing: '0.04em' }}>{count}</Typography>
            </Box>
          ))}
          <Box sx={{ ml: { xs: 0, md: 'auto' }, display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', color: colors.textSecondary, letterSpacing: '0.04em' }}>
              {total} brands tracked
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// ─── Detail panel ──────────────────────────────────────────────

function DetailPanel({ panel, onClose }: { panel: PanelState; onClose: () => void }) {
  const group = OWNERSHIP_GROUPS.find(g => g.id === panel.groupId)!;
  const typeColor = TYPE_COLOR[panel.type];
  const typeLabel = TYPE_LABEL[panel.type];
  const isBrand = panel.kind === 'brand';

  return (
    <Box sx={{
      width: { xs: '100%', md: 320 },
      bgcolor: colors.forest,
      borderLeft: { xs: 'none', md: `1px solid rgba(196,168,130,0.15)` },
      borderTop: { xs: `1px solid rgba(196,168,130,0.15)`, md: 'none' },
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
      flexShrink: 0,
    }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(196,168,130,0.12)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: typeColor, flexShrink: 0 }} />
            <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.5625rem', color: typeColor, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
              {typeLabel}
            </Typography>
          </Box>
          <Box
            onClick={onClose}
            sx={{ cursor: 'pointer', color: 'rgba(255,255,255,0.35)', fontFamily: fonts.mono, fontSize: '0.75rem', letterSpacing: '0.06em', '&:hover': { color: 'rgba(255,255,255,0.7)' }, transition: 'color 0.15s', flexShrink: 0 }}
          >
            ✕ close
          </Box>
        </Box>

        <Typography sx={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: { xs: '1.5rem', md: '1.75rem' }, color: '#FFFFFF', lineHeight: 1.15, mb: 0.5 }}>
          {panel.name}
        </Typography>

        {isBrand && panel.founded && (
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
            Est. {panel.founded}
          </Typography>
        )}
      </Box>

      {/* Brand note */}
      {panel.note && (
        <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
          <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }}>
            <MdInline>{panel.note}</MdInline>
          </Typography>
        </Box>
      )}

      {/* Owned by (for brands) */}
      {isBrand && (
        <Box sx={{ px: 3, pt: 2, pb: 1 }}>
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.5625rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 1 }}>
            Owned by
          </Typography>
          <Typography sx={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: '0.9375rem', color: colors.ridgeline }}>
            {group.name}
          </Typography>
          {group.note && (
            <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55, mt: 0.5 }}>
              <MdInline>{group.note}</MdInline>
            </Typography>
          )}
        </Box>
      )}

      {/* Portfolio brands */}
      <Box sx={{ px: 3, pt: 2.5, pb: 2 }}>
        <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.5625rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 1.5 }}>
          {isBrand ? `Also in ${group.name === 'Independent' ? 'the independent category' : `the ${group.name} portfolio`}` : 'All brands'}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {group.brands
            .filter(b => isBrand ? b.name !== panel.name : true)
            .map(b => (
              <Box
                key={b.name}
                sx={{
                  px: 1.25, py: 0.375,
                  bgcolor: b.name === panel.name ? typeColor + '33' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${b.name === panel.name ? typeColor + '55' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 0.5,
                  fontFamily: fonts.mono, fontSize: '0.625rem',
                  color: b.name === panel.name ? typeColor : 'rgba(255,255,255,0.55)',
                  letterSpacing: '0.04em',
                  transition: 'all 0.15s',
                }}
              >
                {b.name}
              </Box>
            ))}
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ px: 3, pb: 3, mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {isBrand && (
          <Box
            component={Link}
            to={`/directory/${slugify(panel.name)}`}
            sx={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              px: 2, py: 1.25, bgcolor: colors.trail, color: '#FFFFFF',
              fontFamily: fonts.sans, fontWeight: 600, fontSize: '0.875rem',
              textDecoration: 'none', borderRadius: 1,
              transition: 'background-color 0.2s', '&:hover': { bgcolor: '#B5501F' },
            }}
          >
            View company profile →
          </Box>
        )}
        <Box
          component={Link}
          to="/directory"
          sx={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            px: 2, py: 1.25, bgcolor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)',
            fontFamily: fonts.sans, fontWeight: 600, fontSize: '0.875rem',
            textDecoration: 'none', borderRadius: 1, border: '1px solid rgba(255,255,255,0.12)',
            transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(255,255,255,0.12)', color: '#FFFFFF' },
          }}
        >
          Browse full directory
        </Box>
      </Box>
    </Box>
  );
}

// ─── Main component ─────────────────────────────────────────────

export default function OwnershipMap() {
  const svgRef    = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeType, setActiveType] = useState<OwnershipType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [panel, setPanel] = useState<PanelState | null>(null);

  const openBrand = useCallback((d: d3.HierarchyCircularNode<HierarchyDatum>) => {
    setPanel({
      kind: 'brand',
      name: d.data.name,
      type: d.data.type!,
      groupId: d.data.groupId!,
      note: d.data.brandNote,
      founded: d.data.founded,
    });
  }, []);

  const openGroup = useCallback((d: d3.HierarchyCircularNode<HierarchyDatum>) => {
    const group = OWNERSHIP_GROUPS.find(g => g.id === d.data.groupId);
    if (!group) return;
    setPanel({
      kind: 'group',
      name: group.name,
      type: group.type,
      groupId: group.id,
      note: group.note,
    });
  }, []);

  useEffect(() => {
    draw();
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeType, searchQuery, panel]);

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

    const root = d3.hierarchy<HierarchyDatum>(buildHierarchy())
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    d3.pack<HierarchyDatum>()
      .size([W, H])
      .padding((d) => (d.depth === 0 ? 28 : d.depth === 1 ? 6 : 0))(root);

    type CircNode = d3.HierarchyCircularNode<HierarchyDatum>;
    const nodes = root.descendants() as CircNode[];
    const groupNodes = nodes.filter((d) => d.depth === 1);
    const brandNodes = nodes.filter((d) => d.depth === 2);

    const q = searchQuery.trim().toLowerCase();
    const hasSearch = q.length > 0;
    const selectedGroupId = panel?.groupId ?? null;

    const brandActive = (d: CircNode): boolean => {
      if (hasSearch) return d.data.name.toLowerCase().includes(q);
      if (activeType !== null) return d.data.type === activeType;
      if (selectedGroupId) return d.data.groupId === selectedGroupId;
      return true;
    };

    const groupActive = (d: CircNode): boolean => {
      if (hasSearch) return (d.children ?? []).some(c => (c as CircNode).data.name.toLowerCase().includes(q));
      if (activeType !== null) return d.data.type === activeType;
      if (selectedGroupId) return d.data.groupId === selectedGroupId;
      return true;
    };

    // Group background circles
    svg.selectAll<SVGCircleElement, CircNode>('.group-circle')
      .data(groupNodes)
      .join('circle')
      .attr('class', 'group-circle')
      .attr('cx', d => d.x).attr('cy', d => d.y).attr('r', d => d.r)
      .attr('fill', d => TYPE_COLOR[d.data.type!])
      .attr('fill-opacity', d => groupActive(d) ? 0.09 : 0.025)
      .attr('stroke', d => TYPE_COLOR[d.data.type!])
      .attr('stroke-opacity', d => groupActive(d) ? 0.4 : 0.1)
      .attr('stroke-width', 1.5)
      .attr('cursor', 'pointer')
      .on('click', (_event, d) => openGroup(d));

    // Group labels
    svg.selectAll<SVGTextElement, CircNode>('.group-label')
      .data(groupNodes.filter(d => d.r > 36))
      .join('text')
      .attr('class', 'group-label')
      .attr('x', d => d.x).attr('y', d => d.y - d.r + 18)
      .attr('text-anchor', 'middle')
      .attr('fill', d => TYPE_COLOR[d.data.type!])
      .attr('fill-opacity', d => groupActive(d) ? 0.9 : 0.25)
      .attr('font-size', d => Math.min(11, Math.max(8, d.r * 0.18)))
      .attr('font-family', fonts.mono)
      .attr('font-weight', '600')
      .attr('letter-spacing', '0.06em')
      .attr('pointer-events', 'none')
      .text(d => d.data.name.toUpperCase());

    // Brand circles
    const brandG = svg.selectAll<SVGGElement, CircNode>('.brand-node')
      .data(brandNodes)
      .join('g')
      .attr('class', 'brand-node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .attr('cursor', 'pointer')
      .attr('opacity', d => brandActive(d) ? 1 : (hasSearch || selectedGroupId ? 0.12 : 0.25));

    brandG.append('circle')
      .attr('r', d => d.r)
      .attr('fill', d => TYPE_COLOR[d.data.type!])
      .attr('fill-opacity', d => {
        if (panel?.kind === 'brand' && panel.name === d.data.name) return 1;
        return brandActive(d) ? 0.78 : 0.4;
      })
      .attr('stroke', d => {
        if (panel?.kind === 'brand' && panel.name === d.data.name) return colors.ridgeline;
        return '#FFFFFF';
      })
      .attr('stroke-width', d => {
        if (panel?.kind === 'brand' && panel.name === d.data.name) return 2.5;
        return d.r > 12 ? 1.5 : 1;
      });

    // Brand labels
    brandG.filter(d => d.r >= 16)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#FFFFFF')
      .attr('font-size', d => Math.min(10, Math.max(7, d.r * 0.32)))
      .attr('font-family', fonts.mono)
      .attr('font-weight', '500')
      .attr('pointer-events', 'none')
      .each(function(d) {
        const words = d.data.name.split(/\s+/);
        const el = d3.select(this);
        if (words.length === 1 || d.r < 22) {
          el.text(d.data.name.length > 10 ? d.data.name.slice(0, 9) + '…' : d.data.name);
        } else {
          const mid = Math.ceil(words.length / 2);
          const fs = Math.min(10, Math.max(7, d.r * 0.28));
          el.append('tspan').attr('x', 0).attr('dy', `-${fs * 0.6}px`).text(words.slice(0, mid).join(' '));
          el.append('tspan').attr('x', 0).attr('dy', `${fs * 1.3}px`).text(words.slice(mid).join(' '));
        }
      });

    // Search match ring
    if (hasSearch) {
      brandG.filter(d => brandActive(d))
        .append('circle')
        .attr('r', d => d.r + 4)
        .attr('fill', 'none')
        .attr('stroke', d => TYPE_COLOR[d.data.type!])
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.7)
        .attr('pointer-events', 'none');
    }

    // Interactions
    brandG
      .on('mouseenter', function(_e, d) {
        if (panel?.kind === 'brand' && panel.name === d.data.name) return;
        d3.select(this).select('circle')
          .attr('fill-opacity', 1)
          .attr('stroke', colors.ridgeline)
          .attr('stroke-width', 2);
      })
      .on('mouseleave', function(_e, d) {
        if (panel?.kind === 'brand' && panel.name === d.data.name) return;
        d3.select(this).select('circle')
          .attr('fill-opacity', brandActive(d) ? 0.78 : 0.4)
          .attr('stroke', '#FFFFFF')
          .attr('stroke-width', d.r > 12 ? 1.5 : 1);
      })
      .on('click', (_e, d) => openBrand(d));

    // Touch
    brandG.on('touchstart', function(event, d) {
      event.preventDefault();
      openBrand(d);
    }, { passive: false });
  }

  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: '100vh' }}>

      {/* Header */}
      <Box sx={{ bgcolor: colors.forest, pt: { xs: 8, md: 10 }, pb: { xs: 5, md: 6 } }}>
        <Container maxWidth="xl">
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.ridgeline, mb: 2 }}>
            Ownership Map
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, color: '#FFFFFF', mb: 1 }}>
                Who owns what
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9375rem', maxWidth: 520 }}>
                Each circle is a brand. Each cluster is its owner. Click any brand or group to explore.
              </Typography>
            </Box>

            {/* Type filter pills */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {(Object.entries(TYPE_LABEL) as [OwnershipType, string][]).map(([type, label]) => (
                <Box
                  key={type}
                  onClick={() => { setActiveType(prev => prev === type ? null : type); setPanel(null); }}
                  sx={{
                    px: 1.75, py: 0.625, borderRadius: 20, cursor: 'pointer', transition: 'all 0.15s',
                    border: `1px solid ${activeType === type ? TYPE_COLOR[type] : 'rgba(255,255,255,0.2)'}`,
                    bgcolor: activeType === type ? TYPE_COLOR[type] + '28' : 'transparent',
                    display: 'flex', alignItems: 'center', gap: 0.75,
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

          {/* Search bar */}
          <Box sx={{ mt: 3 }}>
            <Box
              component="input"
              type="search"
              placeholder="Search a brand — e.g. Salomon, Merrell, Osprey…"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearchQuery(e.target.value); setPanel(null); }}
              sx={{
                width: { xs: '100%', md: 420 }, px: 2, py: 1.25,
                bgcolor: 'rgba(255,255,255,0.08)', border: `1px solid rgba(255,255,255,0.2)`,
                borderRadius: 1, fontFamily: fonts.sans, fontSize: '0.9375rem',
                color: '#FFFFFF', outline: 'none',
                '&:focus': { borderColor: colors.ridgeline, bgcolor: 'rgba(255,255,255,0.12)' },
                '&::placeholder': { color: 'rgba(255,255,255,0.35)' },
              }}
            />
            {searchQuery && (
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.625rem', color: colors.ridgeline, letterSpacing: '0.06em', mt: 1 }}>
                {OWNERSHIP_GROUPS.flatMap(g => g.brands).filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase())).length} match
                {OWNERSHIP_GROUPS.flatMap(g => g.brands).filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase())).length !== 1 ? 'es' : ''}
              </Typography>
            )}
          </Box>
        </Container>
      </Box>

      {/* Summary bar */}
      <SummaryBar />

      {/* Chart + Panel */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, position: 'relative' }}>
        {/* SVG container */}
        <Box
          ref={containerRef}
          sx={{
            position: 'relative', flexGrow: 1,
            height: { xs: panel ? '55vh' : '72vh', md: '76vh' },
            bgcolor: colors.bg,
            transition: 'height 0.3s',
          }}
          onClick={(e) => { if ((e.target as SVGElement).tagName === 'svg') setPanel(null); }}
        >
          <svg ref={svgRef} style={{ width: '100%', height: '100%', display: 'block' }} />

          {/* Hint when nothing selected */}
          {!panel && !searchQuery && (
            <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', bgcolor: 'rgba(27,42,33,0.75)', px: 2, py: 1, borderRadius: 1, backdropFilter: 'blur(4px)', pointerEvents: 'none' }}>
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.5625rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Click any brand or cluster to explore
              </Typography>
            </Box>
          )}

          {/* Colour key */}
          <Box sx={{ position: 'absolute', bottom: 16, right: 16, bgcolor: 'rgba(27,42,33,0.82)', px: 2, py: 1.5, borderRadius: 1, backdropFilter: 'blur(4px)' }}>
            {(Object.entries(TYPE_LABEL) as [OwnershipType, string][]).map(([type, label]) => (
              <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, '&:last-child': { mb: 0 } }}>
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: TYPE_COLOR[type], flexShrink: 0 }} />
                <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.5625rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em' }}>{label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Detail panel */}
        {panel && <DetailPanel panel={panel} onClose={() => setPanel(null)} />}
      </Box>

      {/* Ownership group cards */}
      <Box sx={{ bgcolor: colors.surface, borderTop: `1px solid ${colors.ridgeline}22`, py: { xs: 6, md: 8 } }}>
        <Container maxWidth="xl">
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textSecondary, mb: 4 }}>
            Ownership Groups
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
            {OWNERSHIP_GROUPS.filter(g => g.id !== 'independent').map(group => (
              <GroupCard
                key={group.id}
                group={group}
                active={panel?.groupId === group.id}
                onClick={() => setPanel({ kind: 'group', name: group.name, type: group.type, groupId: group.id, note: group.note })}
              />
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

// ─── Group card ─────────────────────────────────────────────────

function GroupCard({ group, active, onClick }: { group: OwnershipGroup; active: boolean; onClick: () => void }) {
  const typeColor = TYPE_COLOR[group.type];
  return (
    <Box
      onClick={onClick}
      sx={{
        bgcolor: active ? `${typeColor}08` : '#FFFFFF',
        border: `1px solid ${active ? typeColor + '55' : colors.surface}`,
        borderLeft: `3px solid ${typeColor}`,
        borderRadius: 1.5, p: 2.5, cursor: 'pointer',
        transition: 'all 0.15s',
        '&:hover': { borderColor: typeColor + '55', bgcolor: `${typeColor}05`, boxShadow: `0 2px 12px rgba(27,42,33,0.06)` },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <Typography sx={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: '0.9375rem', color: colors.text, lineHeight: 1.25 }}>
          {group.name}
        </Typography>
        <Box sx={{ px: 1, py: 0.25, bgcolor: typeColor + '18', borderRadius: 0.5, flexShrink: 0, ml: 1 }}>
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.5625rem', color: typeColor, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            {TYPE_LABEL[group.type]}
          </Typography>
        </Box>
      </Box>
      {group.note && (
        <Typography sx={{ fontSize: '0.8125rem', color: colors.textSecondary, lineHeight: 1.5, mb: 1.5 }}>
          <MdInline>{group.note}</MdInline>
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.625 }}>
        {group.brands.map(b => (
          <Box key={b.name} sx={{ px: 1, py: 0.25, bgcolor: colors.surface, borderRadius: 0.5, fontFamily: fonts.mono, fontSize: '0.625rem', color: colors.textSecondary, letterSpacing: '0.04em' }}>
            {b.name}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
