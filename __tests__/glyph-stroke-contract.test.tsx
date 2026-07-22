/**
 * Stroke sözleşmesi (05 §2/§4) — her glyph: viewBox "0 0 24 24", kökte
 * fill="none", G katmanında stroke="currentColor" + round cap/join +
 * strokeWidth [1.4, 1.8] aralığında. Çocuk şekiller ham renk taşıyamaz
 * (yalnız currentColor / none) — renk daima token'dan, kök Svg üzerinden akar.
 */

import TestRenderer, { act } from 'react-test-renderer';

import {
  GLYPH_STROKE_MAX,
  GLYPH_STROKE_MIN,
  MOON_PHASE_GLYPH_NAMES,
  MoonPhaseDataGlyph,
  PLANET_GLYPH_NAMES,
  PlanetGlyph,
  ZODIAC_GLYPH_NAMES,
  ZodiacGlyph,
} from '@/design-system/glyphs';

type TreeNode = {
  type: string;
  props: Record<string, unknown>;
  children: TreeNode[] | null;
};

function renderTree(element: React.ReactElement): TreeNode {
  let renderer!: TestRenderer.ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(element);
  });
  return renderer.toJSON() as unknown as TreeNode;
}

function collect(node: TreeNode, type: string, out: TreeNode[] = []): TreeNode[] {
  if (node.type === type) out.push(node);
  for (const child of node.children ?? []) collect(child, type, out);
  return out;
}

const ALL_CASES: [string, React.ReactElement][] = [
  ...PLANET_GLYPH_NAMES.map(
    (p): [string, React.ReactElement] => [`planet:${p}`, <PlanetGlyph planet={p} decorative />],
  ),
  ...ZODIAC_GLYPH_NAMES.map(
    (s): [string, React.ReactElement] => [`zodiac:${s}`, <ZodiacGlyph sign={s} decorative />],
  ),
  ...MOON_PHASE_GLYPH_NAMES.map(
    (m): [string, React.ReactElement] => [
      `moon:${m}`,
      <MoonPhaseDataGlyph phase={m} decorative />,
    ],
  ),
];

describe('glyph stroke sözleşmesi (05 §2/§4)', () => {
  test.each(ALL_CASES)('%s', (_name, element) => {
    const tree = renderTree(element);

    const svgs = collect(tree, 'Svg');
    expect(svgs).toHaveLength(1);
    expect(svgs[0].props.viewBox).toBe('0 0 24 24');
    expect(svgs[0].props.fill).toBe('none');
    expect(typeof svgs[0].props.color).toBe('string');

    const gs = collect(tree, 'G');
    expect(gs).toHaveLength(1);
    const g = gs[0].props;
    expect(g.stroke).toBe('currentColor');
    expect(g.strokeLinecap).toBe('round');
    expect(g.strokeLinejoin).toBe('round');
    expect(g.fill).toBe('none');
    const width = g.strokeWidth as number;
    expect(width).toBeGreaterThanOrEqual(GLYPH_STROKE_MIN);
    expect(width).toBeLessThanOrEqual(GLYPH_STROKE_MAX);

    // Çocuk şekillerde ham renk yasak: yalnız currentColor / none / undefined.
    for (const shapeType of ['Path', 'Circle', 'Line', 'Rect', 'Ellipse']) {
      for (const shape of collect(tree, shapeType)) {
        for (const key of ['stroke', 'fill'] as const) {
          const value = shape.props[key];
          if (value !== undefined) expect(['currentColor', 'none']).toContain(value);
        }
      }
    }
  });
});
