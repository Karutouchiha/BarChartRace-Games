import {state} from './state.js';

export function initStackedArea(selector) {

    const svgWidth = 700;
    const svgHeight = 400;

    const svg = d3.select(selector)
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    const margins = {t: 60, r: 100, b: 60, l: 100};
    const graphWidth = +svgWidth - margins.l - margins.r;
    const graphHeight = +svgHeight - margins.t - margins.b;
    const g = svg.append('g').attr('transform', `translate(${margins.l},${margins.t})`);

    const x = d3.scaleLinear().range([0, graphWidth]);
    const y = d3.scaleLinear().range([graphHeight, 0]);
    const color = d3.scaleOrdinal()
        .domain(['NA', 'EU', 'JP'])
        .range(['#34c759', '#0a84ff', '#ff375f']);
    const stack = d3.stack().keys(['NA', 'EU', 'JP']);

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
            .join(enter => enter.append('g').attr('class', 'x-axis')
                .attr('transform', `translate(0,${graphHeight})`))
            .call(d3.axisBottom(x).ticks(7).tickFormat(d3.format('d')));

        g.selectAll('.y-axis')
            .data([null])
            .join(enter => enter.append('g').attr('class', 'y-axis'))
            .call(d3.axisLeft(y).ticks(4));

        drawGraphInfo()
    }

    function drawGraphInfo() {
        //title
        svg.append("text")
            .attr("x", svgWidth / 2)
            .attr("y", margins.t / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("fill", "white")
            .text("Meist verkaufte Videospiel des Genres");

        //axis titles
        svg.append("text")
            .attr("text-anchor", "left")
            .attr("x", 0)
            .attr("y", margins.t - 10)
            .style("font-size", "18px")
            .style("fill", "white")
            .text("Verkaufszahlen in Mio")

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", svgWidth / 2)
            .attr("y", svgHeight - 18)
            .style("font-size", "18px")
            .style("fill", "white")
            .text("Jahr")


        //Metadata
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", svgWidth)
            .attr("y", svgHeight - 18)
            .style("font-size", "10px")
            .style("fill", "grey")
            .text("Datenquelle: Kaggle")

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", svgWidth)
            .attr("y", svgHeight - 30)
            .style("font-size", "10px")
            .style("fill", "grey")
            .text("Grafik: Haböck Sarah")
    }

    draw();
    document.addEventListener('statechange', e => {
        if (e.detail.k === 'regions') draw();
    });
}
