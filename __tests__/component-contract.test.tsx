/**
 * Çekirdek component sözleşmesi (07 §14): her component variant/size/state/
 * testID + a11y props taşır; durum yalnız renkle bildirilmez (15 §10). Bu süit
 * Phase 3'te eklenen/hardened component'lerin temsili kesitini doğrular.
 */

import TestRenderer, { act } from 'react-test-renderer';

import {
  AppHeader,
  Button,
  FilterChip,
  InlineNotice,
  LoadingState,
  PlantCard,
  SectionHeader,
  TabItem,
  TextField,
} from '@/design-system/components';

type Node = { type: string; props: Record<string, unknown>; children: (Node | string)[] | null } | string | null;

function render(element: React.ReactElement): Exclude<Node, string | null> {
  let r!: TestRenderer.ReactTestRenderer;
  act(() => {
    r = TestRenderer.create(element);
  });
  return r.toJSON() as unknown as Exclude<Node, string | null>;
}

function flatten(node: Node): Extract<Node, { type: string }>[] {
  if (node == null || typeof node === 'string') return [];
  const self = node as Extract<Node, { type: string }>;
  const out = [self];
  if (self.children) for (const c of self.children) out.push(...flatten(c));
  return out;
}

function visibleText(node: Node): string {
  if (node == null || typeof node === 'string') return typeof node === 'string' ? node : '';
  if (!node.children) return '';
  return node.children.map(visibleText).join(' ');
}

function byLabel(node: Node, label: string) {
  return flatten(node).find((n) => n.props.accessibilityLabel === label);
}

describe('FilterChip (07 §14 · 15 §10)', () => {
  it('button rolü + selected state ikinci kanal (renk-tek-kanal değil)', () => {
    const sel = render(<FilterChip label="Sakinleştirici" selected onPress={() => {}} testID="fc" />);
    expect(sel.props.accessibilityRole).toBe('button');
    expect((sel.props.accessibilityState as { selected?: boolean }).selected).toBe(true);
    expect(sel.props.testID).toBe('fc');
  });

  it('disabled state a11y ile bildirilir', () => {
    const dis = render(<FilterChip label="X" disabled />);
    expect((dis.props.accessibilityState as { disabled?: boolean }).disabled).toBe(true);
  });

  it('count label metnine yansır', () => {
    const c = render(<FilterChip label="Uyku" count={3} />);
    expect(visibleText(c)).toContain('Uyku (3)');
  });
});

describe('Button (hardened)', () => {
  it('disabled state a11y + variant render', () => {
    const b = render(<Button label="Kaydet" variant="secondary" disabled testID="btn" />);
    expect(b.props.accessibilityRole).toBe('button');
    expect((b.props.accessibilityState as { disabled?: boolean }).disabled).toBe(true);
    expect(visibleText(b)).toContain('Kaydet');
  });
});

describe('TextField (07 §10)', () => {
  it('label her zaman görünür; TextInput a11y label taşır', () => {
    const f = render(<TextField label="E-posta" value="" onChangeText={() => {}} testID="tf" />);
    expect(visibleText(f)).toContain('E-posta');
    expect(byLabel(f, 'E-posta')).toBeTruthy();
  });

  it('error = ikon + mesaj (renk-tek-kanal değil)', () => {
    const f = render(
      <TextField label="E-posta" value="x" onChangeText={() => {}} error="Geçersiz e-posta" />,
    );
    expect(visibleText(f)).toContain('Geçersiz e-posta');
    // canlı bölge ile duyurulur
    expect(flatten(f).some((n) => n.props.accessibilityLiveRegion === 'polite')).toBe(true);
  });
});

describe('AppHeader / SectionHeader (07 §3)', () => {
  it('AppHeader başlık + geri düğmesi (TR label) + eylem', () => {
    const h = render(
      <AppHeader
        title="Bitkiler"
        onBack={() => {}}
        backLabel="Geri"
        actions={[{ label: 'Ara', icon: 'search', onPress: () => {} }]}
      />,
    );
    expect(visibleText(h)).toContain('Bitkiler');
    expect(byLabel(h, 'Geri')).toBeTruthy();
    expect(byLabel(h, 'Ara')).toBeTruthy();
  });

  it('SectionHeader başlık + sağ eylem', () => {
    const s = render(
      <SectionHeader title="Bugün" action={{ label: 'Tümü', text: 'Tümü', onPress: () => {} }} />,
    );
    expect(visibleText(s)).toContain('Bugün');
    expect(byLabel(s, 'Tümü')).toBeTruthy();
  });
});

describe('TabItem (07 §3 · 15 §2)', () => {
  it('tab rolü + selected + label görünür', () => {
    const t = render(<TabItem icon="herb" label="Bahçe" focused onPress={() => {}} testID="tab" />);
    expect(t.props.accessibilityRole).toBe('tab');
    expect((t.props.accessibilityState as { selected?: boolean }).selected).toBe(true);
    expect(visibleText(t)).toContain('Bahçe');
  });
});

describe('InlineNotice / LoadingState', () => {
  it('InlineNotice error tonu assertive canlı bölge + mesaj', () => {
    const n = render(<InlineNotice tone="error" message="Bağlantı yok" testID="note" />);
    expect(n.props.accessibilityLiveRegion).toBe('assertive');
    expect(visibleText(n)).toContain('Bağlantı yok');
  });

  it('LoadingState görünür yükleme metni', () => {
    const l = render(<LoadingState label="Yükleniyor" testID="load" />);
    expect(visibleText(l)).toContain('Yükleniyor');
  });
});

describe('PlantCard (07 §6 varyant + kaydet)', () => {
  it('kaydet eylemi a11y label taşır; toksisite rozeti a11y label’a girer', () => {
    const p = render(
      <PlantCard
        commonName="Yüksük Otu"
        scientificName="Digitalis purpurea"
        toxicityBadge="Toksik"
        onSave={() => {}}
        saveLabel="Kaydet"
        variant="grid"
      />,
    );
    expect(byLabel(p, 'Kaydet')).toBeTruthy();
    expect(String(p.props.accessibilityLabel)).toContain('Toksik');
  });
});
