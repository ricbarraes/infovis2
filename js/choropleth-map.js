class ChoroplethMap {
  constructor(el, data, geo, title, rotate) {
    this.el = el;
    this.data = data;
    this.geo = geo;
    this.title = title;
    this.rotate = rotate;
    this.resize = this.resize.bind(this);
    this.init();
  }

  init() {
    this.margin = {
      top: 24,
      right: 8,
      bottom: 60,
      left: 8,
    };

    this.projection = d3.geoNaturalEarth1().rotate([this.rotate, 0]);
    this.geoPath = d3.geoPath(this.projection);

    this.color = d3.scaleQuantize().range(d3.schemeBlues[9]);

    this.container = d3.select(this.el).classed("chart-container", true);
    this.svg = this.container.append("svg");

    this.svg
      .append("text")
      .attr("class", "chart-title")
      .attr("y", this.margin.top - 8)
      .text(this.title);

    this.gLegend = this.svg.append("g");
    this.legend = new ColorLegend(this.gLegend);
    this.tooltip = new ChartTooltip(this.container);

    window.addEventListener("resize", this.resize);
    this.resize();
  }

  resize() {
    this.width = this.el.clientWidth;
    this.height = this.el.clientHeight;

    this.projection.fitExtent(
      [
        [this.margin.left, this.margin.top],
        [this.width - this.margin.right, this.height - this.margin.bottom],
      ],
      this.geo
    );

    this.svg.attr("viewBox", [0, 0, this.width, this.height]);
    this.gLegend.attr(
      "transform",
      `translate(0, ${this.height - this.margin.bottom + 8})`
    );

    if (this.selected) this.render();
  }

  render() {
    this.svg
      .selectAll(".area-path")
      .data(this.geo.features)
      .join((enter) =>
        enter
          .append("path")
          .attr("class", "area-path")
          .attr("fill", "#fff")
          .on("mouseenter", (event, d) => {
            const value = valueAccessor(
              this.data,
              Object.assign(
                {
                  landArea: d.properties.name,
                },
                this.selected
              )
            );
            if (value) {
              this.tooltip.show(`
                <div>${d.properties.name}</div>
                <div>${d3.format(",d")(value)}</div>
              `);
            } else {
              this.tooltip.show(`
                <div>${d.properties.name}</div>
              `);
            }
          })
          .on("mouseleave", this.tooltip.hide)
          .on("mousemove", this.tooltip.move)
      )
      .attr("d", this.geoPath)
      .transition()
      .attr("fill", (d) => {
        const value = valueAccessor(
          this.data,
          Object.assign(
            {
              landArea: d.properties.name,
            },
            this.selected
          )
        );
        if (value) return this.color(value);
        return "#fff";
      });
  }

  update(selected) {
    if (!this.selected || selected.metric !== this.selected.metric) {
      // Only update the color scale for metric change
      this.color
        .domain(valueExtent(this.data, { metric: selected.metric }))
        .nice();
      this.legend.update(this.color, selected.metric);
    }
    this.selected = selected;
    this.render();
  }
}
