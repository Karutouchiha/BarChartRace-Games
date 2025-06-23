export const state = {
  year: 1985,
  regions: { NA: true, EU: true, JP: true },
  data: null,
  get activeRegions() {
    return Object.keys(this.regions).filter(r => this.regions[r]);
  },
};

export const setState = (k, v) => {
  state[k] = v;
  document.dispatchEvent(new CustomEvent('statechange', { detail: { k, v } }));
};