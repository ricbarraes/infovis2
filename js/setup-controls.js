function setupMetricControl(dispatch, initialSelected) {
  d3.selectAll("input[name='metric']")
    .property("checked", function () {
      return this.value === initialSelected;
    })
    .on("change", function () {
      dispatch.call("metricchange", this, this.value);
    });
}

function setupTradeFlowControl(dispatch, initialSelected) {
  d3.selectAll("input[name='trade-flow']")
    .property("checked", function () {
      return this.value === initialSelected;
    })
    .on("change", function () {
      dispatch.call("tradeflowchange", this, this.value);
    });
}

function setupCommodityControl(dispatch, initialSelected) {
  d3.selectAll("input[name='commodity']")
    .property("checked", function () {
      return this.value === initialSelected;
    })
    .on("change", function () {
      dispatch.call("commoditychange", this, this.value);
    });
}

function setupYearControl(dispatch, initialSelected) {
  d3.select("#year")
    .on("change", function () {
      dispatch.call("yearchange", this, +this.value);
    })
    .selectAll("option")
    .data(d3.range(2000, 2016))
    .join("option")
    .property("selected", (d) => d === initialSelected)
    .attr("value", (d) => d)
    .text((d) => d);
}
