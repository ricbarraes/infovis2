Promise.all([
  d3.csv("data/Americas_Quantity.csv"),
  d3.csv("data/Americas_Value.csv"),
  d3.csv("data/Global_Quantity.csv"),
  d3.csv("data/Global_Value.csv"),
  d3.json("data/WB_countries_Admin0_10m.json"),
]).then(
  ([
    americasQuantity,
    americasValue,
    globalQuantity,
    globalValue,
    countries,
  ]) => {
    // Process data and geo
    const americasData = processData(americasQuantity, americasValue);
    const globalData = processData(globalQuantity, globalValue);
    const [americasGeo, globalGeo] = processGeo(countries);

    // Set up controls
    const dispatch = d3.dispatch(
      "metricchange",
      "tradeflowchange",
      "commoditychange",
      "yearchange"
    );
    const selected = {
      metric: "Quantity (t)",
      tradeFlow: "Export",
      commodity: "Fish",
      year: 2015,
    };

    setupMetricControl(dispatch, selected.metric);
    setupTradeFlowControl(dispatch, selected.tradeFlow);
    setupCommodityControl(dispatch, selected.commodity);
    setupYearControl(dispatch, selected.year);

    dispatch
      .on("metricchange", (metric) => {
        selected.metric = metric;
        updateCharts(selected);
      })
      .on("tradeflowchange", (tradeFlow) => {
        selected.tradeFlow = tradeFlow;
        updateCharts(selected);
      })
      .on("commoditychange", (commodity) => {
        selected.commodity = commodity;
        updateCharts(selected);
      })
      .on("yearchange", (year) => {
        selected.year = year;
        updateCharts(selected);
      });

    // Render charts
    const americasChoropleth = new ChoroplethMap(
      document.querySelector("#choropleth-americas"),
      americasData,
      americasGeo,
      "Countries in Americas",
      8
    );
    const globalChoropleth = new ChoroplethMap(
      document.querySelector("#choropleth-global"),
      globalData,
      globalGeo,
      "Continents",
      -10
    );
    function updateCharts(selected) {
      americasChoropleth.update(Object.assign({}, selected));
      globalChoropleth.update(Object.assign({}, selected));
    }
    updateCharts(selected);
  }
);
