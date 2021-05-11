function processGeo(countriesTopoJson) {
  const americasGeo = topojson.feature(
    countriesTopoJson,
    countriesTopoJson.objects.countries
  );
  americasGeo.features = americasGeo.features.filter(
    (f) => f.properties.REGION_UN === "Americas"
  );
  americasGeo.features.forEach(
    (f) => (f.properties.name = f.properties.NAME_EN)
  );

  const continents = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
  const globalGeo = {
    type: "FeatureCollection",
    features: continents.map((continent) => ({
      type: "Feature",
      properties: {
        name: continent,
      },
      geometry: topojson.merge(
        countriesTopoJson,
        countriesTopoJson.objects.countries.geometries.filter((g) => {
          return g.properties.REGION_UN === continent;
        })
      ),
    })),
  };

  return [americasGeo, globalGeo];
}
