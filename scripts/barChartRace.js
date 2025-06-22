import {state} from './state.js';

export function initBarChartRace(selector) {
    const container = d3.select(selector);
    container.select('.chart-placeholder').remove(); // Platzhalter entfernen

    const svgWidth = 600;
    const svgHeight = 400;

    const graphWidth = 370;
    const graphHeight = 260;

    const svg = container
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    const translateX = (svgWidth - graphWidth) / 2;
    const translateY = (svgHeight - graphHeight - 20);

    const g = svg.append('g').attr('transform', 'translate(' + translateX + ',' + translateY + ')');
    const x = d3.scaleLinear().range([0, graphWidth]);
    const y = d3.scaleBand().range([0, graphHeight]).padding(0.15);
    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const xAxis = g.append('g').attr('class', 'x-axis').attr('transform', 'translate(0,0)');
    const yAxis = g.append('g').attr('class', 'y-axis');

    function draw() {
        const yearMap = state.data.byYearGenre;
        const year = +state.year;
        const rows = Array.from(yearMap.get(year) || [])
            .map(([Genre, Sales]) => ({Genre, Sales}))
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

        // Zahlenwerte am Ende der Balken anzeigen
        g.selectAll('.value')
            .data(rows, d => d.Genre)
            .join(
                enter => enter.append('text')
                    .attr('class', 'value')
                    .attr('x', d => x(d.Sales) + 8)
                    .attr('y', d => y(d.Genre) + y.bandwidth() / 2)
                    .attr('dy', '0.35em')
                    .attr('fill', '#fff')
                    .attr('font-size', 13)
                    .text(d => d.Sales.toFixed(1) + ' Mio'),
                update => update.transition().duration(400)
                    .attr('x', d => x(d.Sales) + 8)
                    .attr('y', d => y(d.Genre) + y.bandwidth() / 2)
                    .text(d => d.Sales.toFixed(1) + ' Mio')
            );

        drawGraphInfo()
    }

    draw();
    document.addEventListener('statechange', e => {
        if (e.detail.k === 'year') draw();
    });

    function drawGraphInfo() {
        //title
        svg.append("text")
            .attr("x", svgWidth / 2)
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("fill", "white")
            .text("Beliebteste Video Genre");

        //axis titles
        svg.append("text")
            .attr("text-anchor", "left")
            .attr("x", 0)
            .attr("y", svgHeight - graphWidth/2)
            .style("font-size", "18px")
            .style("fill", "white")
            .text("Genre")

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", svgWidth / 2)
            .attr("y", translateY / 1.5)
            .style("font-size", "18px")
            .style("fill", "white")
            .text("Verkaufszahlen")


        //Metadata
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", svgWidth)
            .attr("y", svgHeight - 35)
            .style("font-size", "10px")
            .style("fill", "grey")
            .text("Datenquelle: Statistik Austria")

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", svgWidth)
            .attr("y", svgHeight - 50)
            .style("font-size", "10px")
            .style("fill", "grey")
            .text("Grafik: Haböck Sarah")
    }
}

