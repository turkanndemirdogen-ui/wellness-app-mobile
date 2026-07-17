import { shellCopy } from '@/content/shell-copy';
import { EmptyState } from '@/design-system/components';

export default function BahceScreen() {
  return (
    <EmptyState
      icon="herb"
      title={shellCopy.bahce.title}
      description={shellCopy.bahce.subtitle}
      badge={shellCopy.common.soonBadge}
    />
  );
}
