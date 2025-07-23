// main.js
import { state, setState } from './state.js';
import { initBarChartRace } from './barChartRace.js';
import { initStackedArea } from './stackedArea.js';

d3.csv('./data/vgsales.csv', d3.autoType).then(raw => {
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
     .map(([Year, R]) => ({ Year, ...R })),

    by2000sGenre: d3.rollup(
      raw.filter(d => d.Year >= 2000 && d.Year <= 2010),
      v => d3.sum(v, d => d.Global_Sales),
      d => d.Year,
      d => d.Genre
    ),

    // NEU für Kapitel 4: Plattformen 2010–2016
    byModernPlatform: d3.rollup(
      raw.filter(d => d.Year >= 2010 && d.Year <= 2016),
      v => d3.sum(v, d => d.Global_Sales),
      d => d.Year,
      d => d.Platform
    )
  };

  // ✅ Kapitel 1: Nur mit Slider steuerbar
  initBarChartRace('#chart-bar-race', {
    dataset: state.data.byYearGenre,
    label: 'Genre'
  });

  // ✅ Kapitel 2: Nur mit Slider steuerbar
  initStackedArea('#chart-stacked-area');

  // Kapitel 3: animiert
  initBarChartRace('#chart-3d-era', {
    dataset: state.data.by2000sGenre,
    yearRange: [2000, 2010]
  });

  // Kapitel 4: animiert
  initBarChartRace('#chart-modern-era', {
    dataset: state.data.byModernPlatform,
    yearRange: [2010, 2016],
    label: 'Plattform'
  });

  // Slider für Kapitel 1 + 2
  const sliderYear = document.getElementById('slider-year');
  const yearLabel = document.getElementById('yearLabel');
  if (sliderYear && yearLabel) {
    sliderYear.addEventListener('input', e => {
      yearLabel.textContent = e.target.value;
      setState('year', +e.target.value);
    });
  }

  // Region-Filter für stacked area chart
  document.querySelectorAll('[data-region]').forEach(cb =>
    cb.addEventListener('change', e => {
      state.regions[e.target.dataset.region] = e.target.checked;
      setState('regions', { ...state.regions });
    })
  );
});
