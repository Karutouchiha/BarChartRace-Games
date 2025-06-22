export const state = {
  year: 1985,
  regions: { NA: true, EU: true, JP: true },
  data: null,
};

export const setState = (k, v) => {
  state[k] = v;
  document.dispatchEvent(new CustomEvent('statechange', { detail: { k, v } }));
};