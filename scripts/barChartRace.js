import { state } from './state.js';

console.log(state.data)
export function initBarChartRace(selector) {
  const container = d3.select(selector);
  container.select('.chart-placeholder').remove(); // Platzhalter entfernen

  const svg = container
    .append('svg')
    .attr('width', 540)
    .attr('height', 300);

  const g = svg.append('g').attr('transform', 'translate(150,20)');
  const x = d3.scaleLinear().range([0, 370]);
  const y = d3.scaleBand().range([0, 260]).padding(0.15);
  const color = d3.scaleOrdinal(d3.schemeTableau10);

  const xAxis = g.append('g').attr('class', 'x-axis').attr('transform', 'translate(0,0)');
  const yAxis = g.append('g').attr('class', 'y-axis');

  function draw() {
    const yearMap = state.data.byYearGenre;
    const year = +state.year;
    const rows = Array.from(yearMap.get(year) || [])
      .map(([Genre, Sales]) => ({ Genre, Sales }))
      .sort((a, b) => d3.descending(a.Sales, b.Sales))
      .slice(0, 5);

    x.domain([0, d3.max(rows, d => d.Sales) || 1]);
    y.domain(rows.map(d => d.Genre));

    xAxis.transition().duration(400).call(d3.axisTop(x).ticks(5));
    yAxis.transition().duration(400).call(d3.axisLeft(y));

    const bars = g.selectAll('rect').data(rows, d => d.Genre);
    bars.enter()
        .append('rect')
        .attr('y', d => y(d.Genre))
        .attr('height', y.bandwidth())
        .attr('fill', d => color(d.Genre))
        .attr('width', 0)
      .merge(bars)
        .transition().duration(400)
        .attr('width', d => x(d.Sales))
        .attr('y', d => y(d.Genre));
    bars.exit().remove();

    g.selectAll('.label')
      .data(rows, d => d.Genre)
      .join(
        enter => enter.append('text')
                      .attr('class', 'label')
                      .attr('x', -10)
                      .attr('y', d => y(d.Genre) + y.bandwidth()/2)
                      .attr('dy', '0.35em')
                      .attr('text-anchor', 'end')
                      .text(d => d.Genre),
        update => update.transition().duration(400)
                        .attr('y', d => y(d.Genre) + y.bandwidth()/2)
      );

    // Zahlenwerte am Ende der Balken anzeigen
    g.selectAll('.value')
      .data(rows, d => d.Genre)
      .join(
        enter => enter.append('text')
                      .attr('class', 'value')
                      .attr('x', d => x(d.Sales) + 8)
                      .attr('y', d => y(d.Genre) + y.bandwidth()/2)
                      .attr('dy', '0.35em')
                      .attr('fill', '#fff')
                      .attr('font-size', 13)
                      .text(d => d.Sales.toFixed(1) + ' Mio'),
        update => update.transition().duration(400)
                        .attr('x', d => x(d.Sales) + 8)
                        .attr('y', d => y(d.Genre) + y.bandwidth()/2)
                        .text(d => d.Sales.toFixed(1) + ' Mio')
      );
  }

  draw();
  document.addEventListener('statechange', e => {
    if (e.detail.k === 'year') draw();
  });
}