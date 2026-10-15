<script>
  import { dndzone } from 'svelte-dnd-action';
  import { flip } from 'svelte/animate';
  import { SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
  import { decodeState, encodeState, cleanItems, nameOf, MAX_TOP } from './state.js';

  const FLIP_MS = 150;
  const PILES = [
    { key: 'zeer', title: 'Very important' },
    { key: 'belangrijk', title: 'Important' },
    { key: 'niet', title: 'Not so important' },
  ];

  const initial = decodeState(typeof location !== 'undefined' ? location.hash : '');
  let lists = $state.raw(initial.lists);
  let presentIds = $state.raw(initial.present);
  let copied = $state(false);

  const isShadow = (item) => Boolean(item[SHADOW_ITEM_MARKER_PROPERTY_NAME]);

  // Keep the URL in sync with the current layout, including while a card is being dragged.
  $effect(() => {
    const hash = '#' + encodeState(lists, presentIds);
    if (location.hash !== hash) history.replaceState(null, '', hash);
  });

  function onConsider(zone, e) {
    lists = { ...lists, [zone]: e.detail.items };
  }

  function onFinalize(zone, e) {
    const items = cleanItems(e.detail.items);
    const movedIds = new Set(items.map((item) => item.id));
    const next = { ...lists, [zone]: items };
    // A card dropped here must not also remain in another zone.
    for (const other of Object.keys(next)) {
      if (other !== zone) next[other] = next[other].filter((item) => !movedIds.has(item.id));
    }
    lists = next;
  }

  function togglePresent(id) {
    presentIds = presentIds.includes(id)
      ? presentIds.filter((x) => x !== id)
      : [...presentIds, id];
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(location.href);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch {
      // Clipboard can be blocked; the address bar still holds the link.
    }
  }

  function reset() {
    if (!confirm('Start over from scratch?')) return;
    const fresh = decodeState('');
    lists = fresh.lists;
    presentIds = fresh.present;
  }

  let sortedCount = $derived(
    lists.zeer.length + lists.belangrijk.length + lists.niet.length,
  );
</script>

<main>
  <header>
    <h1>Values Sorting Exercise</h1>
    <p class="intro">
      Drag each value into the right pile. Then choose up to {MAX_TOP} values from “Very important”, put them in order, and check which ones are already present enough in your life. The address bar always holds your current layout, so the link you share shows exactly this.
    </p>
    <div class="toolbar">
      <button onclick={copyLink}>{copied ? 'Link copied' : 'Copy link'}</button>
      <button class="secondary" onclick={reset}>Start over</button>
      <span class="counter">{sortedCount} of 125 sorted</span>
    </div>
  </header>

  <section>
    <h2>Steps 1–4: sort the values</h2>

    <div class="pile-label">To sort ({lists.unsorted.length})</div>
    <div
      class="zone unsorted"
      use:dndzone={{ items: lists.unsorted, flipDurationMs: FLIP_MS, dropTargetStyle: {} }}
      onconsider={(e) => onConsider('unsorted', e)}
      onfinalize={(e) => onFinalize('unsorted', e)}
    >
      {#each lists.unsorted as item (item.id)}
        <div class="card" class:shadow={isShadow(item)} animate:flip={{ duration: FLIP_MS }}>
          {isShadow(item) ? '' : nameOf(item.id)}
        </div>
      {/each}
    </div>

    <div class="piles">
      {#each PILES as pile (pile.key)}
        <div class="pile">
          <div class="pile-label">{pile.title} ({lists[pile.key].length})</div>
          <div
            class="zone"
            use:dndzone={{ items: lists[pile.key], flipDurationMs: FLIP_MS, dropTargetStyle: {} }}
            onconsider={(e) => onConsider(pile.key, e)}
            onfinalize={(e) => onFinalize(pile.key, e)}
          >
            {#each lists[pile.key] as item (item.id)}
              <div class="card" class:shadow={isShadow(item)} animate:flip={{ duration: FLIP_MS }}>
                {isShadow(item) ? '' : nameOf(item.id)}
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <section>
    <h2>Steps 5–7: your top {MAX_TOP}</h2>
    <p class="hint">
      Drag values from “Very important” here. Drag them within this list to change their order. Check the values that are already present enough in your life.
    </p>

    <div
      class="zone ranking"
      class:full={lists.top.length >= MAX_TOP}
      use:dndzone={{
        items: lists.top,
        flipDurationMs: FLIP_MS,
        dropTargetStyle: {},
        dropFromOthersDisabled: lists.top.length >= MAX_TOP,
      }}
      onconsider={(e) => onConsider('top', e)}
      onfinalize={(e) => onFinalize('top', e)}
    >
      {#each lists.top as item, index (item.id)}
        <div class="rank-row" class:shadow={isShadow(item)} animate:flip={{ duration: FLIP_MS }}>
          {#if !isShadow(item)}
            <span class="rank">{index + 1}</span>
            <span class="rank-name">{nameOf(item.id)}</span>
            <label class="present">
              <input
                type="checkbox"
                checked={presentIds.includes(item.id)}
                onchange={() => togglePresent(item.id)}
              />
              already present enough
            </label>
          {/if}
        </div>
      {:else}
        <div class="empty">No values chosen yet.</div>
      {/each}
    </div>
  </section>
</main>

<style>
  :root {
    color-scheme: light dark;
    --bg: #fafafa;
    --fg: #1d1d1f;
    --muted: #6b6b70;
    --card: #ffffff;
    --border: #d9d9de;
    --accent: #2f5fd0;
    --zeer: #f3d6da;
    --belangrijk: #f5f2b8;
    --niet: #d6e2f1;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme='light']) {
      --bg: #1b1b1f;
      --fg: #eeeef0;
      --muted: #a0a0a8;
      --card: #2a2a30;
      --border: #44444c;
      --accent: #7aa2ff;
      --zeer: #5a3b40;
      --belangrijk: #5a5630;
      --niet: #35465c;
    }
  }

  :global(body) {
    margin: 0;
    background: var(--bg);
    color: var(--fg);
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  }

  main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 24px 16px 80px;
  }

  h1 { margin: 0 0 8px; font-size: 1.8rem; }
  h2 { margin: 32px 0 8px; font-size: 1.25rem; }
  .intro, .hint { color: var(--muted); line-height: 1.5; margin: 0 0 12px; }

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    margin: 12px 0;
  }
  .counter { color: var(--muted); font-size: 0.9rem; }

  button {
    font: inherit;
    padding: 8px 14px;
    border-radius: 8px;
    border: 1px solid var(--accent);
    background: var(--accent);
    color: #fff;
    cursor: pointer;
  }
  button.secondary {
    background: transparent;
    color: var(--accent);
  }

  .pile-label {
    font-weight: 600;
    margin: 12px 0 6px;
    color: var(--muted);
    font-size: 0.9rem;
  }

  .zone {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    min-height: 80px;
    padding: 8px;
    border: 2px dashed var(--border);
    border-radius: 12px;
    background: var(--card);
    align-content: flex-start;
  }
  .zone.unsorted { min-height: 120px; }

  .piles {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 16px;
  }
  .pile .zone { min-height: 200px; }
  .pile:nth-child(1) .pile-label { color: var(--fg); }

  .card {
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--card);
    font-size: 0.9rem;
    cursor: grab;
    user-select: none;
    touch-action: none;
  }
  .card.shadow { visibility: hidden; }

  .piles .pile:nth-child(1) .zone { background: color-mix(in srgb, var(--zeer) 35%, var(--card)); }
  .piles .pile:nth-child(2) .zone { background: color-mix(in srgb, var(--belangrijk) 35%, var(--card)); }
  .piles .pile:nth-child(3) .zone { background: color-mix(in srgb, var(--niet) 35%, var(--card)); }

  .zone.ranking {
    flex-direction: column;
    flex-wrap: nowrap;
    min-height: 120px;
  }
  .zone.ranking.full { border-color: var(--accent); }

  .rank-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--card);
    cursor: grab;
    touch-action: none;
  }
  .rank-row.shadow { visibility: hidden; height: 40px; }
  .rank { font-weight: 700; color: var(--accent); min-width: 1.5em; }
  .rank-name { flex: 1; }
  .present {
    font-size: 0.85rem;
    color: var(--muted);
    display: flex;
    gap: 6px;
    align-items: center;
    white-space: nowrap;
  }
  .empty { color: var(--muted); padding: 12px; font-style: italic; }

  @media (max-width: 760px) {
    .piles { grid-template-columns: 1fr; }
    .pile .zone { min-height: 120px; }
    .rank-name { font-size: 0.95rem; }
    .present { font-size: 0.8rem; }
  }
</style>
