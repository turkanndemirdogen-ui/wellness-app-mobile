import { shellCopy } from '@/content/shell-copy';
import { EmptyState } from '@/design-system/components';

export default function SohbetScreen() {
  return (
    <EmptyState
      icon="chat"
      title={shellCopy.sohbet.title}
      description={shellCopy.sohbet.subtitle}
      badge={shellCopy.common.soonBadge}
    />
  );
}
