import { SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
import { VALUES } from './values.js';

export const MAX_TOP = 10;
export const ALL_IDS = VALUES.map((_, i) => i + 1);

const isShadow = (item) => Boolean(item[SHADOW_ITEM_MARKER_PROPERTY_NAME]);
export const cleanItems = (items) => items.filter((item) => !isShadow(item));

// URL hash format: #u=..&z=..&b=..&n=..&t=..&p=..
// u = unsorted, z = very important, b = important, n = not so important,
// t = top 10 in ranking order, p = top-10 values marked as "already present enough".
// Each value is a comma-separated list of value ids.
export function decodeState(hash) {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const parse = (key) =>
    (params.get(key) ?? '')
      .split(',')
      .map(Number)
      .filter((id) => Number.isInteger(id) && id >= 1 && id <= VALUES.length);

  const used = new Set();
  const pick = (ids, limit = Infinity) => {
    const out = [];
    for (const id of ids) {
      if (out.length >= limit) break;
      if (!used.has(id)) {
        used.add(id);
        out.push(id);
      }
    }
    return out;
  };

  const top = pick(parse('t'), MAX_TOP);
  const zeer = pick(parse('z'));
  const belangrijk = pick(parse('b'));
  const niet = pick(parse('n'));
  const unsorted = pick(parse('u'));
  // Any value missing from the URL starts out unsorted.
  unsorted.push(...ALL_IDS.filter((id) => !used.has(id)));

  const present = [...new Set(parse('p'))].filter((id) => top.includes(id));

  return {
    lists: {
      unsorted: toItems(unsorted),
      zeer: toItems(zeer),
      belangrijk: toItems(belangrijk),
      niet: toItems(niet),
      top: toItems(top),
    },
    present,
  };
}

export function encodeState(lists, present) {
  const ids = (zone) => cleanItems(lists[zone]).map((item) => item.id);
  const topIds = ids('top');
  const parts = {
    u: ids('unsorted'),
    z: ids('zeer'),
    b: ids('belangrijk'),
    n: ids('niet'),
    t: topIds,
    p: present.filter((id) => topIds.includes(id)),
  };
  return Object.entries(parts)
    .map(([key, value]) => `${key}=${value.join(',')}`)
    .join('&');
}

export const toItems = (ids) => ids.map((id) => ({ id }));
export const nameOf = (id) => VALUES[id - 1] ?? '';
