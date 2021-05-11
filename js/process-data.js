function processData(quantityCSV, valueCSV) {
  const quantity = processCSV(quantityCSV);
  const value = processCSV(valueCSV);
  return new Map([
    ["Quantity (t)", quantity],
    ["Value (USD '000)", value],
  ]);
}

function processCSV(csv) {
  const years = d3.range(2000, 2016);
  return d3.rollup(
    csv,
    (v) => new Map(years.map((year) => [year, +v[0][year]])),
    (d) => d["Land Area"],
    (d) => d["Trade flow"],
    (d) => d["Commodity"]
  );
}

function valueAccessor(data, { metric, landArea, tradeFlow, commodity, year }) {
  let d = data.get(metric);
  d = d.get(landArea);
  if (!d) return undefined;
  d = d.get(tradeFlow);
  if (!d) return undefined;
  d = d.get(commodity);
  if (!d) return undefined;
  d = d.get(year);
  if (!d) return undefined;
  return d;
}

function valueExtent(data, { metric }) {
  const metricData = data.get(metric);
  const values = d3
    .hierarchy(metricData)
    .leaves()
    .map((d) => d.data[1])
    .sort(d3.ascending);
  // Remove some extreme values so the extent won't be affected by outliers
  const min = d3.quantile(values, 0.02);
  const max = d3.quantile(values, 0.98);
  return [min, max];
}
