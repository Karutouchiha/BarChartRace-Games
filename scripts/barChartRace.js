import { state, subscribe } from './state.js';

export function initBarChartRace(selector, options = {}) {
  let yearLabelText;
  let replayButton;
  let animationInterval;

  const container = d3.select(selector);
  container.select('.chart-placeholder').remove();

  const {
    dataset = state.data.byYearGenre,
    yearRange = null,
    label = 'Genre'
  } = options;

  const svgWidth = 600;
  const svgHeight = 400;
  const graphWidth = 370;
  const graphHeight = 260;

  const svg = container
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .style('background', 'transparent');

  const translateX = (svgWidth - graphWidth) / 2;
  const translateY = (svgHeight - graphHeight - 20);

  const g = svg.append('g')
    .attr('transform', `translate(${translateX},${translateY})`);

  const x = d3.scaleLinear().range([0, graphWidth]);
  const y = d3.scaleBand().range([0, graphHeight]).padding(0.15);
  const color = d3.scaleOrdinal(d3.schemeTableau10);

  const xAxis = g.append('g').attr('class', 'x-axis').attr('transform', 'translate(0,0)');
  const yAxis = g.append('g').attr('class', 'y-axis');

  function draw(year) {
    const yearMap = dataset;
    const rows = Array.from(yearMap.get(year) || [])
      .map(([key, Sales]) => ({ key, Sales }))
      .sort((a, b) => d3.descending(a.Sales, b.Sales))
      .slice(0, 5);

    x.domain([0, d3.max(rows, d => d.Sales) || 1]);
    y.domain(rows.map(d => d.key));

    xAxis.transition().duration(400).call(d3.axisTop(x).ticks(5));
    yAxis.transition().duration(400).call(d3.axisLeft(y));

    const bars = g.selectAll('rect').data(rows, d => d.key);
    bars.enter()
      .append('rect')
      .attr('y', d => y(d.key))
      .attr('height', y.bandwidth())
      .attr('fill', d => color(d.key))
      .attr('width', 0)
      .merge(bars)
      .transition().duration(400)
      .attr('width', d => x(d.Sales))
      .attr('y', d => y(d.key));
    bars.exit().remove();

    g.selectAll('.value')
      .data(rows, d => d.key)
      .join(
        enter => enter.append('text')
          .attr('class', 'value')
          .attr('x', d => x(d.Sales) + 8)
          .attr('y', d => y(d.key) + y.bandwidth() / 2)
          .attr('dy', '0.35em')
          .attr('fill', '#fff')
          .attr('font-size', 13)
          .text(d => d.Sales.toFixed(1) + ' Mio'),
        update => update.transition().duration(400)
          .attr('x', d => x(d.Sales) + 8)
          .attr('y', d => y(d.key) + y.bandwidth() / 2)
          .text(d => d.Sales.toFixed(1) + ' Mio')
      );

    if (yearLabelText) yearLabelText.text(year);
  }

  if (yearRange) {
    let [start, end] = yearRange;
    let current = start;

    yearLabelText = svg.append("text")
      .attr("x", svgWidth / 2)
      .attr("y", 70)
      .attr("text-anchor", "middle")
      .attr("font-size", 40)
      .attr("fill", "#ffffff");

    function startAnimation() {
      if (replayButton) replayButton.remove();

      current = start;
      animationInterval = d3.interval(() => {
        draw(current);
        current++;
        if (current > end) {
          animationInterval.stop();
          showReplayButton();
        }
      }, 1500);
    }

    function showReplayButton() {
      replayButton = container.append("button")
        .text("↻ Replay")
        .attr("class", "replay-button")
        .style("position", "absolute")
        .style("top", "10px")
        .style("right", "20px")
        .style("padding", "8px 14px")
        .style("font-size", "16px")
        .style("cursor", "pointer")
        .style("background", "#444")
        .style("color", "white")
        .style("border", "1px solid #888")
        .style("border-radius", "5px")
        .on("click", () => {
          startAnimation();
        });
    }

    startAnimation();
  } else {
   
    subscribe('year', draw);
    draw(state.year);
  }

  drawGraphInfo();

  function drawGraphInfo() {
  // Titel
    svg.append("text")
      .attr("x", svgWidth / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "22px")
      .style("fill", "white")
      .style("font-weight", "bold")
      .text(label === 'Plattform' ? "Beliebteste Plattformen" : "Beliebteste Video Genre");

    // Y-Achsenlabel (links)
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90)`)
      .attr("x", -svgHeight / 2)
      .attr("y", 20)
      .style("font-size", "16px")
      .style("fill", "white")
      .text(label);

    // X-Achsenbeschreibung unter Balken
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", svgWidth / 2)
      .attr("y", svgHeight - 100)
      .style("font-size", "16px")
      .style("fill", "white")
      .text("Verkaufszahlen (in Mio)");

    // Quellen
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", svgWidth - 10)
      .attr("y", svgHeight - 30)
      .style("font-size", "10px")
      .style("fill", "grey")
      .text("Datenquelle: Kaggle");

    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", svgWidth - 10)
      .attr("y", svgHeight - 45)
      .style("font-size", "10px")
      .style("fill", "grey")
      .text("Grafik: Haböck Sarah");
  }

}
