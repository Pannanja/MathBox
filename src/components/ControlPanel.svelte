<script lang="ts">
  import type { Snippet } from 'svelte';
  import UiIcon from './UiIcon.svelte';
  let {
    id,
    title,
    symbol,
    open = $bindable(true),
    children,
    heading,
  }: {
    id: string;
    title: string;
    symbol: string;
    open?: boolean;
    children: Snippet;
    heading?: Snippet<[boolean]>;
  } = $props();
</script>

<section class="control-panel" aria-label={`${title} controls`} data-control={id}>
  <div class="panel-heading">
    <button
      class="panel-toggle"
      aria-label={`${open ? 'Collapse' : 'Expand'} ${title} controls`}
      aria-expanded={open}
      aria-controls={`${id}-body`}
      title={`${open ? 'Collapse' : 'Expand'} ${title} controls`}
      onclick={() => (open = !open)}
      ><span class="mechanism-symbol" aria-hidden="true">{symbol}</span><span>{title}</span
      >{#if open}<UiIcon name="collapse" size={12} />{/if}</button
    >{#if heading}{@render heading(open)}{/if}
  </div>
  {#if open}<div class="panel-body" id={`${id}-body`}>{@render children()}</div>{/if}
</section>
