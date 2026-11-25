<script lang="ts" module>
  import Bell from '@lucide/svelte/icons/bell';
  import Pyramid from '@lucide/svelte/icons/pyramid';
  import Play from '@lucide/svelte/icons/play';
  import Pause from '@lucide/svelte/icons/pause';
  import Link from '@lucide/svelte/icons/link';
  import Unlink from '@lucide/svelte/icons/unlink';
  import Settings from '@lucide/svelte/icons/settings-2';
  import X from '@lucide/svelte/icons/x';
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import Plus from '@lucide/svelte/icons/plus';
  import Minus from '@lucide/svelte/icons/minus';

  import Help from '@lucide/svelte/icons/circle-question-mark';
  import Fit from '@lucide/svelte/icons/scan';
  import Share from '@lucide/svelte/icons/share-2';
  import Reset from '@lucide/svelte/icons/rotate-ccw';
  import Lens from '@lucide/svelte/icons/search';
  import PreviousPrime from '@lucide/svelte/icons/skip-back';
  import NextPrime from '@lucide/svelte/icons/skip-forward';
  const icons = {
    help: Help,
    fit: Fit,
    share: Share,
    reset: Reset,
    lens: Lens,
    previousPrime: PreviousPrime,
    nextPrime: NextPrime,
    sound: Bell,
    visual: Pyramid,
    play: Play,
    pause: Pause,
    link: Link,
    unlink: Unlink,
    adjust: Settings,
    close: X,
    previous: ChevronLeft,
    next: ChevronRight,
    expand: Plus,
    collapse: Minus,
  } as const;
  export type UiIconName = keyof typeof icons;
</script>

<script lang="ts">
  let { name, size = 18 }: { name: UiIconName; size?: number } = $props();
  const Glyph = $derived(icons[name]);
</script>

<!-- The owning button supplies the accessible name and interaction target. -->
<Glyph {size} strokeWidth={1.75} aria-hidden="true" focusable="false" />
