// Modified from https://observablehq.com/@d3/color-legend
class ColorLegend {
  constructor(g) {
    this.g = g;
    this.tickSize = 6;
    this.width = 320;
    this.height = 44 + this.tickSize;
    this.marginTop = 18;
    this.marginRight = 0;
    this.marginBottom = 16 + this.tickSize;
    this.marginLeft = 0;
    this.ticks = this.width / 64;
  }

  render() {
    let tickAdjust = (g) =>
      g
        .selectAll(".tick line")
        .attr("y1", this.marginTop + this.marginBottom - this.height);
    const thresholds = this.color.thresholds();
    const thresholdFormat = d3.format(".2s");
    const x = d3
      .scaleLinear()
      .domain([-1, this.color.range().length - 1])
      .rangeRound([this.marginLeft, this.width - this.marginRight]);
    const tickValues = d3.range(thresholds.length);
    const tickFormat = (i) => thresholdFormat(thresholds[i], i);

    this.g
      .selectAll(".rects")
      .data([0])
      .join("g")
      .attr("class", "rects")
      .selectAll("rect")
      .data(this.color.range())
      .join("rect")
      .attr("x", (d, i) => x(i - 1))
      .attr("y", this.marginTop)
      .attr("width", (d, i) => x(i) - x(i - 1))
      .attr("height", this.height - this.marginTop - this.marginBottom)
      .attr("fill", (d) => d);

    this.g
      .selectAll(".ticks")
      .data([0])
      .join("g")
      .attr("class", "ticks")
      .attr("transform", `translate(0,${this.height - this.marginBottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(this.ticks)
          .tickFormat(tickFormat)
          .tickSize(this.tickSize)
          .tickValues(tickValues)
      )
      .call(tickAdjust)
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".legend-title")
          .data([this.title])
          .join("text")
          .attr("class", "legend-title")
          .attr("x", this.marginLeft)
          .attr("y", this.marginTop + this.marginBottom - this.height - 6)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text((d) => d)
      );
  }

  update(color, title) {
    this.color = color;
    this.title = title;
    this.render();
  }
}
