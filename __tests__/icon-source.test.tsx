/**
 * Icon kaynak sözleşmesi (Phase 3 geçişi) — emoji → lucide-react-native (svg).
 *
 * Kilitli davranış: ICON_SOURCE='svg'; her ad hata vermeden SVG olarak render
 * olur (emoji RNText yok); dekoratif/işlevsel a11y dallanması ve token kaynaklı
 * boyut/renk KORUNUR. lucide kök Svg'ye: size→width/height, color→stroke,
 * a11y props ...rest ile aktarılır (dist/cjs createLucideIcon doğrulandı).
 */

import TestRenderer, { act } from 'react-test-renderer';

import { Icon, ICON_SOURCE, ICON_NAMES } from '@/design-system/primitives';
import { primitive } from '@/design-system/tokens/primitive.generated';

type TreeNode = { type: string; props: Record<string, unknown>; children: TreeNode[] | null };

function renderTree(element: React.ReactElement): TreeNode {
  let renderer!: TestRenderer.ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(element);
  });
  return renderer.toJSON() as unknown as TreeNode;
}

describe('Icon — Lucide (svg) kaynağı', () => {
  it('ICON_SOURCE svg olarak aktif', () => {
    expect(ICON_SOURCE).toBe('svg');
  });

  it('tüm UI ikon adları hata vermeden render olur (emoji fallback yok)', () => {
    expect(ICON_NAMES.length).toBeGreaterThanOrEqual(6);
    for (const name of ICON_NAMES) {
      const tree = renderTree(<Icon name={name} decorative />);
      expect(tree).toBeTruthy();
      // react-native-svg kökü host string tipidir; RNText emoji düğümü değil.
      expect(typeof tree.type).toBe('string');
    }
  });

  it('tab kimlik eşlemesi korunur (moon/crystalBall/herb/chat mevcut)', () => {
    for (const name of ['moon', 'crystalBall', 'herb', 'chat'] as const) {
      expect(ICON_NAMES).toContain(name);
    }
  });

  it('dekoratif ikon a11y ağacından gizlenir (korunan sözleşme)', () => {
    const tree = renderTree(<Icon name="moon" decorative />);
    expect(tree.props.accessible).toBe(false);
    expect(tree.props.accessibilityElementsHidden).toBe(true);
    expect(tree.props.importantForAccessibility).toBe('no-hide-descendants');
    expect(tree.props.accessibilityLabel).toBeUndefined();
  });

  it('işlevsel ikon Türkçe accessibilityLabel taşır', () => {
    const tree = renderTree(<Icon name="chat" label="Sohbet" />);
    expect(tree.props.accessible).toBe(true);
    expect(tree.props.accessibilityLabel).toBe('Sohbet');
    expect(tree.props.importantForAccessibility).toBe('auto');
  });

  it('renk prop stroke rengine akar (token varsayılanı geçersiz kılınabilir)', () => {
    const tree = renderTree(<Icon name="herb" color="#123456" decorative />);
    expect(tree.props.stroke).toBe('#123456');
  });

  it('boyut token kaynaklıdır (size.icon)', () => {
    const tree = renderTree(<Icon name="moon" size="lg" decorative />);
    expect(tree.props.width).toBe(primitive.size.icon.lg);
    expect(tree.props.height).toBe(primitive.size.icon.lg);
  });
});
