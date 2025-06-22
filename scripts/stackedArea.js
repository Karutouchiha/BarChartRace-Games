import { state } from './state.js';

export function initStackedArea(selector) {
  const svg = d3.select(selector)
    .append('svg')
    .attr('width', 580)
    .attr('height', 300);

  const m = { t: 20, r: 60, b: 40, l: 60 };
  const w = +svg.attr('width') - m.l - m.r;
  const h = +svg.attr('height') - m.t - m.b;
  const g = svg.append('g').attr('transform', `translate(${m.l},${m.t})`);

  const x = d3.scaleLinear().range([0, w]);
  const y = d3.scaleLinear().range([h, 0]);
  const color = d3.scaleOrdinal()
                  .domain(['NA','EU','JP'])
                  .range(['#34c759','#0a84ff','#ff375f']);
  const stack = d3.stack().keys(['NA','EU','JP']);

  function draw() {
    const rows = state.data.byYearRegion
      .filter(d => d.Year >= 1985 && d.Year <= 2016);

    x.domain(d3.extent(rows, d => d.Year));
    y.domain([0, d3.max(rows, d => d.NA + d.EU + d.JP)]);

    const series = stack(rows);

    const area = d3.area()
      .x(d => x(d.data.Year))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]));

    g.selectAll('path.area')
      .data(series, d => d.key)
      .join(
        enter => enter.append('path')
                      .attr('class', 'area')
                      .attr('fill', d => color(d.key))
                      .attr('opacity', d => state.regions[d.key] ? .85 : 0),
        update => update
                    .transition().duration(400)
                    .attr('opacity', d => state.regions[d.key] ? .85 : 0)
      )
      .attr('d', area);

    g.selectAll('.x-axis')
      .data([null])
      .join( enter => enter.append('g').attr('class','x-axis')
                       .attr('transform',`translate(0,${h})`) )
      .call(d3.axisBottom(x).ticks(7).tickFormat(d3.format('d')));

    g.selectAll('.y-axis')
      .data([null])
      .join( enter => enter.append('g').attr('class','y-axis') )
      .call(d3.axisLeft(y).ticks(4));
  }

  draw();
  document.addEventListener('statechange', e => {
    if (e.detail.k === 'regions') draw();
  });
}
