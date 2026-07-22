/**
 * Glyph a11y sözleşmesi (05 §12) — dekoratif glyph erişilebilirlik ağacından
 * gizlenir; veri glyphi image rolü + label taşır; label'sız veri glyphi
 * geliştirmede uyarı üretir (sessiz ihlal yok).
 */

import TestRenderer, { act } from 'react-test-renderer';

import { PlanetGlyph, MoonPhaseDataGlyph } from '@/design-system/glyphs';

type TreeNode = { type: string; props: Record<string, unknown>; children: TreeNode[] | null };

function renderTree(element: React.ReactElement): TreeNode {
  let renderer!: TestRenderer.ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(element);
  });
  return renderer.toJSON() as unknown as TreeNode;
}

describe('glyph a11y sözleşmesi (05 §12)', () => {
  it('dekoratif glyph erişilebilirlik ağacından gizlenir', () => {
    const tree = renderTree(<PlanetGlyph planet="saturn" decorative />);
    expect(tree.props.accessible).toBe(false);
    expect(tree.props.accessibilityElementsHidden).toBe(true);
    expect(tree.props.importantForAccessibility).toBe('no-hide-descendants');
    expect(tree.props.accessibilityLabel).toBeUndefined();
  });

  it('veri glyphi image rolü + label taşır', () => {
    const tree = renderTree(<PlanetGlyph planet="saturn" label="Satürn" />);
    expect(tree.props.accessible).toBe(true);
    expect(tree.props.accessibilityRole).toBe('image');
    expect(tree.props.accessibilityLabel).toBe('Satürn');
  });

  it("dekoratif olmayan glyph label'sız bırakılırsa dev-warn üretir", () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      renderTree(<MoonPhaseDataGlyph phase="full" />);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('label zorunlu'));
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('dekoratif glyph label gerektirmez (uyarı yok)', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      renderTree(<MoonPhaseDataGlyph phase="full" decorative />);
      expect(warnSpy).not.toHaveBeenCalled();
    } finally {
      warnSpy.mockRestore();
    }
  });
});
