import { state, setState } from './state.js';
import { initBarChartRace } from './barChartRace.js';
import { initStackedArea } from './stackedArea.js';

d3.csv('./data/vgsales.csv', d3.autoType).then(raw => {
  // 1. Daten transformieren
  state.data = {
    byYearGenre: d3.rollup(
      raw,
      v => d3.sum(v, d => d.Global_Sales),
      d => d.Year,
      d => d.Genre
    ),
    byYearRegion: d3.rollups(
      raw,
      v => ({
        NA: d3.sum(v, d => d.NA_Sales),
        EU: d3.sum(v, d => d.EU_Sales),
        JP: d3.sum(v, d => d.JP_Sales)
      }),
      d => d.Year
    ).sort((a, b) => d3.ascending(a[0], b[0]))
     .map(([Year, R]) => ({ Year, ...R }))
  };

  // 2. Charts initialisieren
  initBarChartRace('#chart-bar-race');
  initStackedArea('#chart-stacked-area');

  // 3. Controls verdrahten
  const sliderYear = document.getElementById('slider-year');
  const yearLabel = document.getElementById('yearLabel');
  if (sliderYear && yearLabel) {
    sliderYear.addEventListener('input', e => {
      yearLabel.textContent = e.target.value;
      setState('year', +e.target.value);
    });
  }

  document.querySelectorAll('[data-region]').forEach(cb =>
    cb.addEventListener('change', e => {
      state.regions[e.target.dataset.region] = e.target.checked;
      setState('regions', { ...state.regions });
    })
  );

  const firstYearRegionEntry = state.data.byYearRegion.forEach(d=>{
    console.log(d)
  });
  console.log(firstYearRegionEntry);
});