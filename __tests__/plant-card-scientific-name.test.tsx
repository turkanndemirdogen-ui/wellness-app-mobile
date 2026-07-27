/**
 * PlantCard bilimsel ad sözleşmesi (07 §6): bilimsel ad HİÇBİR varyantta tamamen
 * gizlenmez. grid/list/feature'da GÖRÜNÜR metinde; compact'ta görünmez ama
 * kartın accessibilityLabel'ında TAM görünür (ekran okuyucu daima erişir).
 */

import TestRenderer, { act } from 'react-test-renderer';

import { PlantCard, type PlantCardVariant } from '@/design-system/components';

type Node = { type: string; props: Record<string, unknown>; children: (Node | string)[] | null } | string | null;

function render(element: React.ReactElement): Exclude<Node, string | null> {
  let r!: TestRenderer.ReactTestRenderer;
  act(() => {
    r = TestRenderer.create(element);
  });
  return r.toJSON() as unknown as Exclude<Node, string | null>;
}

function visibleText(node: Node): string {
  if (node == null || typeof node === 'string') return typeof node === 'string' ? node : '';
  if (!node.children) return '';
  return node.children.map(visibleText).join(' ');
}

const COMMON = 'Papatya';
const SCI = 'Matricaria chamomilla';

describe('PlantCard — bilimsel ad sözleşmesi (07 §6)', () => {
  it.each<PlantCardVariant>(['grid', 'list', 'feature'])(
    '%s varyantında bilimsel ad GÖRÜNÜR metinde',
    (variant) => {
      const tree = render(<PlantCard variant={variant} commonName={COMMON} scientificName={SCI} />);
      expect(visibleText(tree)).toContain(SCI);
    },
  );

  it('compact varyantında bilimsel ad GÖRÜNMEZ ama accessibilityLabel içinde TAM görünür', () => {
    const tree = render(<PlantCard variant="compact" commonName={COMMON} scientificName={SCI} />);
    expect(visibleText(tree)).not.toContain(SCI);
    expect(String(tree.props.accessibilityLabel)).toContain(SCI);
    // yaygın ad compact'ta görünür kalır
    expect(visibleText(tree)).toContain(COMMON);
  });

  it('accessibilityLabel yaygın + bilimsel adı birlikte taşır (varsayılan)', () => {
    const tree = render(<PlantCard commonName={COMMON} scientificName={SCI} family="Asteraceae" />);
    const label = String(tree.props.accessibilityLabel);
    expect(label).toContain(COMMON);
    expect(label).toContain(SCI);
    expect(label).toContain('Asteraceae');
  });
});
