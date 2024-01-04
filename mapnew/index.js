var modal = document.getElementById("myModal");
var iFrame = document.getElementById("iFrame");
var ptDataNull = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [0, 0]
      }
    }
  ]
};

window.onclick = function(e) {
  if (e.target == modal) {
    modal.style.display = "none";
    document.getElementById("map").style.height = "100%";
    map.getSource("panoPtSource").setData(ptDataNull);
    changeThemeColor(themeColor);
  }
};
mapboxgl.accessToken =
  "pk.eyJ1IjoieWFucG9ndXRzYSIsImEiOiJjajBhMzJydzIwZmtmMndvY3ozejFicTdqIn0.T6DCFk1BSoEkdG-2agIoQQ";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/yanpogutsa/cjzbf944b07bh1dqwjgbdjp8u",
  attributionControl: false,
  center: [37.618, 55.751],
  minZoom: 2,
  zoom: 10,
  bearingSnap: 30,
  antialias: true,
  maxBounds: [
    [36.540169324143605, 55.020305819627616], // Southwest coordinates
    [38.3135420226066969, 56.1505434064830737] // Northeast coordinates
  ]
});
map.addControl(new mapboxgl.AttributionControl({
    customAttribution:
      "<a href=https://www.google.com/ target=`_blank`>© 2020 Google</a>"
  }), "bottom-left");
const themeColor = "#ff5575";
const c0 = "#006ff7";
const c1 = "#484848";
const c2 = "#ffc33c";
const c3 = "#ff5575";
let dataNull = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [36.73828124999999, 50.680797145321655],
            [38.14453125, 48.86471476180277],
            [38.232421875, 50.90303283111257]
          ]
        ]
      }
    }
  ]
};
// Load an image to use as the pattern
map.loadImage("./data/pattern.png", function(err, image) {
  // Throw an error if something went wrong
  if (err) throw err;

  // Declare the image
  map.addImage("pattern", image);
});

map.loadImage("./data/pattern-blue.png", function(err, image) {
  // Throw an error if something went wrong
  if (err) throw err;

  // Declare the image
  map.addImage("pattern-blue", image);
});

map.loadImage("./data/pattern-blue-solid.png", function(err, image) {
  // Throw an error if something went wrong
  if (err) throw err;

  // Declare the image
  map.addImage("pattern-blue-solid", image);
});

function togglePano(e) {
  var visibility = map.getLayoutProperty("SVCoverage", "visibility");
  var currentZoom = map.getZoom();
  if (visibility === "none") {
    map.setLayoutProperty("SVCoverage", "visibility", "visible");
    e.currentTarget.className += " active";
    e.currentTarget.style.color = "hsl(195, 59%, 52%)";
    if (currentZoom < 13) {
      map.zoomTo(13);
    }

    ///////////////////////////
    map.on("click", "SVCoverage", function(e) {
      var panoPtData = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [e.lngLat.lng, e.lngLat.lat]
            }
          }
        ]
      };
      document.getElementById("map").style.height = "65%";
      map.getSource("panoPtSource").setData(panoPtData);

      var urlSV =
        "https://www.google.com/maps/embed/v1/streetview?key=AIzaSyAiBlN_z2kIvx1ZX-3yAclOVxUVCNOkiLs&location=" +
        e.lngLat.lat +
        "," +
        e.lngLat.lng +
        "&heading=360&pitch=10&fov=65";

      ////
      iFrame.src = urlSV;
      modal.style.display = "block";
      map.easeTo({
        center: [e.lngLat.lng, e.lngLat.lat]
      });
      changeThemeColor("#000");
    });
  } else {
    map.setLayoutProperty("SVCoverage", "visibility", "none");
    e.currentTarget.className = "headerButton";
    e.currentTarget.style.color = "#757575";
  }
}

function resetNorth() {
  map.easeTo({ bearing: 0, pitch: 0 });
}
map.on("rotate", function() {
  var northButton = document.getElementById("north");
  var rotation = -map.getBearing();
  var rotationTransform = "rotate(" + rotation + "deg)";
  northButton.style.transform = rotationTransform;
  if (rotation === 0) {
    northButton.style.display = "none";
  } else {
    northButton.style.display = "block";
  }
});

function changeThemeColor(color) {
  var metaThemeColor = document.querySelector("meta[name=theme-color]");
  metaThemeColor.setAttribute("content", color);
}

function toggleTab(e, tabName) {
  //var tabName = e.currentTarget.textContent;
  var tabcontent = document.getElementsByClassName("tabcontent");
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  var visibility = map.getLayoutProperty(tabName, "visibility");

  if (visibility === "visible") {
    map.setLayoutProperty(tabName, "visibility", "none");
    e.currentTarget.className = "";
    document.getElementById(tabName).style.display = "none";
  } else {
    map.setLayoutProperty(tabName, "visibility", "visible");
    e.currentTarget.className = " active";
    document.getElementById(tabName).style.display = "block";
  }
}

function toggleLayerLine(e, tabName) {
  //var tabName = e.currentTarget.textContent;
  var tabcontent = document.getElementsByClassName("tabcontent");
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  var tabNameLine = tabName + "_line";
  var visibility = map.getLayoutProperty(tabName, "visibility");
  if (visibility === "visible") {
    map.setLayoutProperty(tabName, "visibility", "none");
    map.setLayoutProperty(tabNameLine, "visibility", "none");
    e.currentTarget.className = "";
    document.getElementById(tabName).style.display = "none";
  } else {
    map.setLayoutProperty(tabName, "visibility", "visible");
    map.setLayoutProperty(tabNameLine, "visibility", "visible");
    e.currentTarget.className = " active";
    document.getElementById(tabName).style.display = "block";
  }
}

function toggleLayer(e, buttonName) {
  var visibility = map.getLayoutProperty(buttonName, "visibility");
  if (visibility === "visible") {
    map.setLayoutProperty(buttonName, "visibility", "none");
    e.currentTarget.className = "";
  } else {
    map.setLayoutProperty(buttonName, "visibility", "visible");
    e.currentTarget.className = " active";
  }
}

var Filter = ["in", "layer"];

function tabFilter(e, clickedFilter) {
  var targetLayer = e.target.parentElement.id;

  if (e.currentTarget.className === "") {
    Filter.push(clickedFilter);
    e.currentTarget.className = " active";
  } else {
    for (var i = 0; i < Filter.length; i++) {
      if (Filter[i] === clickedFilter) {
        Filter.splice(i, 1);
      }
    }
    e.currentTarget.className = "";
  }
  map.setFilter(targetLayer, Filter);
}

function tabFilterLine(e, clickedFilter) {
  var targetLayer = e.target.parentElement.id;
  var targetLayerLine = targetLayer + "_line";

  if (e.currentTarget.className === "") {
    Filter.push(clickedFilter);
    e.currentTarget.className = " active";
  } else {
    for (var i = 0; i < Filter.length; i++) {
      if (Filter[i] === clickedFilter) {
        Filter.splice(i, 1);
      }
    }
    e.currentTarget.className = "";
  }
  map.setFilter(targetLayer, Filter);
  map.setFilter(targetLayerLine, Filter);
}

var dateFilter = ["in", "yearTitle"];

function tabFilterYear(e) {
  var date = e.currentTarget.textContent;
  //var date = parseInt(dateRaw,10);
  var targetLayer = e.target.parentElement.id;
  var targetLayerLine = targetLayer + "_line";

  if (e.currentTarget.className === "") {
    dateFilter.push(date);
    e.currentTarget.className = " active";
  } else {
    for (var i = 0; i < dateFilter.length; i++) {
      if (dateFilter[i] === date) {
        dateFilter.splice(i, 1);
      }
    }
    e.currentTarget.className = "";
  }
  map.setFilter(targetLayer, dateFilter);
  map.setFilter(targetLayerLine, dateFilter);
}

///////////////////////LOAD
map.on("load", function() {
  map.addSource("panoPtSource", {
    type: "geojson",
    data: ptDataNull
  });

  map.addLayer({
    id: "panoPt",
    type: "circle",
    source: "panoPtSource",
    paint: {
      "circle-radius": 10,
      "circle-color": "hsl(195, 59%, 52%)"
    }
  });

  map.addLayer(
    {
      id: "SVCoverage",
      type: "fill",
      source: {
        type: "vector",
        url: "mapbox://yanpogutsa.b3exv4dd"
      },
      "source-layer": "sv-8gsjja",
      layout: { visibility: "none" },
      minzoom: 12,
      paint: {
        "fill-color": "hsla(195, 59%, 52%, 0.8)",
        "fill-opacity": 0.4
      }
    },
    "admin-2-boundary"
  );
  map.addSource("routes", {
    type: "vector",
    url: "mapbox://yanpogutsa.dna92ft5"
  });
  map.addLayer(
    {
      id: "3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 15,
      paint: {
        "fill-extrusion-color": "#cac7d1",

        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-base": ["get", "min_height"],
        "fill-extrusion-opacity": 0.6
      },
      layout: {
        visibility: "none"
      }
    },
    "housenum-label"
  );

  map.addSource("DKR_poly", {
    type: "vector",
    url: "mapbox://yanpogutsa.2wygw0t6"
  });
  map.addLayer(
    {
      id: "ДКР",
      type: "fill",
      source: "DKR_poly",
      "source-layer": "DKR-draft-8xh91k",
      layout: {
        visibility: "none"
      },
      paint: {
        "fill-color": [
          "case",
          ["==", ["get", "yearTitle"], "2011-2018"],
          "hsl(324, 16%, 34%)",
          "#3cbe66"
        ],
        "fill-opacity": 0.4
      }
    },
    "admin-2-boundary"
  );

  map.addLayer(
    {
      id: "ДКР_line",
      type: "line",
      source: "DKR_poly",
      "source-layer": "DKR-draft-8xh91k",
      layout: {
        visibility: "none"
      },
      paint: {
        "line-color": [
          "case",
          ["==", ["get", "yearTitle"], "2011-2018"],
          "hsl(324, 16%, 34%)",
          "#3cbe66"
        ],
        "line-width": 1.5,
        "line-offset": -0.75,
        "line-opacity": ["interpolate", ["linear"], ["zoom"], 11, 0.5, 14, 0]
      }
    },
    "admin-2-boundary"
  );

  map.addSource("⚙ ППТ_source", {
    type: "vector",
    url: "mapbox://yanpogutsa.67zh48hu"
  });
  map.addSource("ППТ_source", {
    type: "vector",
    url: "mapbox://yanpogutsa.56ogmwov"
  });

  map.addLayer(
    {
      id: "⚙ ППТ",
      type: "fill",
      source: "⚙ ППТ_source",
      "source-layer": "PPT-WIP-1movuq",
      layout: {
        visibility: "none"
      },
      paint: {
        //"fill-color": "hsla(224, 32%, 51%, 0.2)",
        //"fill-outline-color": "hsla(224, 32%, 51%, 0.5)"
        "fill-pattern": [
          "match",
          ["get", "STATUS"],
          ["Планируемые, в работе"],
          "pattern-blue",
          "pattern-blue-solid"
        ],
        "fill-opacity": 0.2
      }
    },
    "admin-2-boundary"
  ); // Place polygon under these labels.
  map.addLayer(
    {
      id: "⚙ ППТ_line",
      type: "line",
      source: "⚙ ППТ_source",
      "source-layer": "PPT-WIP-1movuq",
      layout: {
        visibility: "none"
      },
      paint: {
        "line-color": "hsla(224, 32%, 51%, 0.2)",
        //"fill-outline-color": "hsla(224, 32%, 51%, 0.5)"
        "line-opacity": 0.9,
        "line-width": 1
      }
    },
    "admin-2-boundary"
  ); // Place polygon under these labels.
  map.addLayer(
    {
      id: "ППТ",
      type: "fill",
      source: "ППТ_source",
      "source-layer": "PPT-122uv6",
      layout: {
        visibility: "none"
      },
      paint: {
        "fill-color": "hsla(0, 100%, 33%, 0.2)",
        "fill-outline-color": "hsla(0, 100%, 33%, 0.5)"
      }
    },
    "admin-2-boundary"
  ); // Place polygon under these labels.
  ///////////////////////////////////////////////
  map.addLayer(
    {
      id: "🗺",
      source: {
        type: "raster",
        tiles: ["https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"],
        tileSize: 128,
        scheme: "xyz"
      },
      type: "raster",
      layout: { visibility: "none" }
    },
    "moscow-boundary-aghg2c"
  );
  //////////////////ISO
  map.addSource("isoSource", {
    type: "geojson",
    data: dataNull
  });
  map.addLayer(
    {
      id: "iso",
      type: "fill",
      source: "isoSource",
      paint: {
        "fill-pattern": "pattern",
        "fill-opacity": 0.4
      },
      layout: { visibility: "none" }
    },
    "buildings-13ut9s"
  );

  map.addLayer({
    id: "isoText",
    type: "symbol",
    source: "isoSource",
    paint: {
      "text-color": "#ef4c89",
      "text-halo-color": "hsla(0, 0%, 100%, 0.5)",
      "text-halo-width": 1.5
    },
    layout: {
      "text-field": ["concat", ["get", "population_rs"], " чел."],
      "text-font": ["Ubuntu Mono Regular"],
      "text-size": 8
    }
  });

  map.addLayer({
    id: "isoLine",
    type: "line",
    source: "isoSource",
    paint: {
      "line-color": "#ef4c89",
      "line-opacity": 0.7,
      "line-width": 1,
      "line-dasharray": [2, 1]
    }
  });

  ///////////////////////////////////////ROUTE

  map.addLayer(
    {
      id: "ngpt-pass-text",
      type: "symbol",
      source: {
        type: "vector",
        url: "mapbox://yanpogutsa.1ltace6u"
      },
      "source-layer": "NGPT-stops-spt-beta-81ib3b",
      layout: {
        visibility: "none",
        "text-field": ["to-string", ["get", "Пассажиропоток по входу за день"]],
        "text-size": 8,
        "symbol-placement": "point",
        "text-offset": [
          "interpolate",
          ["cubic-bezier", 0.3, 1, 1, 1],
          ["get", "Пассажиропоток по входу за день"],
          1,
          ["literal", [0, 2]],
          11832,
          ["literal", [0, 8]]
        ],
        "text-font": ["Ubuntu Mono Regular"],
        "icon-allow-overlap": true,
        "icon-ignore-placement": true
      },
      paint: {
        "text-color": "#006ef5",
        "text-halo-color": "hsla(0, 0%, 100%, 0.5)",
        "text-halo-width": 1.5
      },
      minzoom: 13
    },
    "places-5y0blc"
  );

  map.addLayer(
    {
      id: "ngpt-pass",
      type: "circle",
      source: {
        type: "vector",
        url: "mapbox://yanpogutsa.1ltace6u"
      },
      "source-layer": "NGPT-stops-spt-beta-81ib3b",
      layout: {
        visibility: "none"
      },
      paint: {
        "circle-color": "hsla(213, 100%, 48%, 0.2)",
        "circle-opacity": 0.2,
        "circle-radius": [
          "interpolate",
          ["cubic-bezier", 0.3, 1, 1, 1],
          ["get", "Пассажиропоток по входу за день"],
          0,
          20,
          11832,
          100
        ]
      },
      minzoom: 13
    },
    "places-5y0blc"
  );

  map.addLayer({
    id: "metro-pass",
    type: "circle",
    source: {
      type: "geojson",
      data: "./data/Metro-load-lite.json"
    },
    layout: {
      visibility: "none"
    },
    paint: {
      "circle-color": "hsla(4, 86%, 53%, 0.2)",
      "circle-radius": [
        "interpolate",
        ["cubic-bezier", 0.3, 1, 1, 1],
        ["get", "Average"],
        0,
        15,
        90000,
        80
      ]
    },
    minzoom: 13
  });

  map.addLayer({
    id: "metro-pass-text",
    type: "symbol",
    source: {
      type: "geojson",
      data: "./data/Metro-load-lite.json"
    },
    layout: {
      visibility: "none",
      "text-field": ["to-string", ["get", "Average"]],
      "text-size": 8,
      "symbol-placement": "point",
      "text-offset": [
        "interpolate",
        ["cubic-bezier", 0.3, 1, 1, 1],
        ["get", "Average"],
        1,
        ["literal", [0, 1]],
        90000,
        ["literal", [2, 8]]
      ],
      "text-font": ["Ubuntu Mono Regular"],
      "icon-allow-overlap": true,
      "icon-ignore-placement": true
    },
    paint: {
      "text-color": "hsla(4, 86%, 53%, 1)",
      "text-halo-color": "hsla(0, 0%, 100%, 0.5)",
      "text-halo-width": 1
    },
    minzoom: 13
  });

  map.addSource("isoPtSource", {
    type: "geojson",
    data: ptDataNull
  });
  map.addLayer({
    id: "isoPt",
    type: "circle",
    source: "isoPtSource",
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 3, 15, 10],
      "circle-color": "rgba(255, 85, 117, 0.7)",
      "circle-stroke-color": "#fff",
      "circle-stroke-width": ["interpolate", ["linear"], ["zoom"], 13, 1, 16, 3]
    }
  });
});

map.on("click", "metro-stations-close", function(e) {
  popup
    .setLngLat(e.lngLat)
    .setHTML(
      "<h3>" +
        e.features[0].properties.NameOfStation +
        " Вход №" +
        e.features[0].properties.ref +
        "</h3>" +
        "<p>" +
        e.features[0].properties.line +
        "</p>"
    )
    .addTo(map);
  map.setLayoutProperty("metro-pass", "visibility", "visible");
  map.setLayoutProperty("metro-pass-text", "visibility", "visible");
});

// Change the cursor to a pointer when the mouse is over the places layer.
map.on("mouseenter", "metro-stations-close", function() {
  map.getCanvas().style.cursor = "pointer";
});

// Change it back to a pointer when it leaves.
map.on("mouseleave", "metro-stations-close", function() {
  map.getCanvas().style.cursor = "";
});

function toggleIso(i) {
  var visibility = map.getLayoutProperty("iso", "visibility");
  if (visibility === "none") {
    map.setLayoutProperty("iso", "visibility", "visible");
    i.currentTarget.className += " active";
    i.currentTarget.style.color = "#ef4c89";
    function isoTrack(e) {
      let data =
        "https://gis01.rumap.ru/4898/serviceAreaStatistics?guid=DDC7AEA3-1BDA-1019-A30D-1CD15F74BEED&type=pedestrianZone&x=" +
        e.lngLat.lng +
        "&y=" +
        e.lngLat.lat +
        "&maxdist=400&geometry=1";
      map.getSource("isoSource").setData(data);
    }

    map.once("click", function(e) {
      isoTrack(e);
      let coords = e.lngLat;
      let geojson = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [coords.lng, coords.lat]
            }
          }
        ]
      };
      map.getSource("isoPtSource").setData(geojson);
      /*if (map.isSourceLoaded("isoSource")) {
        console.log("done");
      }*/
    });
    //////
    map.on("mouseenter", "isoPt", function() {
      //map.setPaintProperty("isoPt", "circle-color", "#3bb2d0");
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "isoPt", function() {
      map.setPaintProperty("isoPt", "circle-color", "rgba(255, 85, 117, 0.7)");
      map.getCanvas().style.cursor = "";
    });
    function onMove(e) {
      var coords = e.lngLat;
      var geojson = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [0, 0]
            }
          }
        ]
      };

      // Set a UI indicator for dragging.
      map.getCanvas().style.cursor = "grabbing";

      // Update the Point feature in `geojson` coordinates
      // and call setData to the source layer `point` on it.
      geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
      map.getSource("isoPtSource").setData(geojson);
    }

    function onUp(e) {
      isoTrack(e);
      map.getCanvas().style.cursor = "";

      // Unbind mouse/touch events
      map.off("mousemove", onMove);
      map.off("touchmove", onMove);
    }

    map.on("mousedown", "isoPt", function(e) {
      map.setPaintProperty("isoPt", "circle-color", "#be2e4b");

      // Prevent the default map drag behavior.
      e.preventDefault();

      map.getCanvas().style.cursor = "grab";

      map.on("mousemove", onMove);
      map.once("mouseup", onUp);
    });

    map.on("touchstart", "isoPt", function(e) {
      if (e.points.length !== 1) return;

      // Prevent the default map drag behavior.
      e.preventDefault();

      map.on("touchmove", onMove);
      map.once("touchend", onUp);
    });
  } else {
    map.setLayoutProperty("iso", "visibility", "none");
    map.getSource("isoSource").setData(dataNull);
    map.getSource("isoPtSource").setData(ptDataNull);
    i.currentTarget.className = "headerButton";
    i.currentTarget.style.color = "#757575";
  }
}

map.on("click", "MCD_stations", function(e) {
  popup
    .setLngLat(e.lngLat)
    .setHTML(
      "<h3>" +
        e.features[0].properties.name +
        "</h3>" +
        "<p>Пасспоток 2018: " +
        e.features[0].properties.Pass2018 +
        "</p>Пасспоток 2020: " +
        e.features[0].properties.Pass2020 +
        "</p>" +
        "</p>Пасспоток 2025: " +
        e.features[0].properties.Pass2025 +
        "</p>"
    )
    .addTo(map);
});
// Change the cursor to a pointer when the mouse is over the places layer.
map.on("mouseenter", "MCD_stations", function() {
  map.getCanvas().style.cursor = "pointer";
});

// Change it back to a pointer when it leaves.
map.on("mouseleave", "MCD_stations", function() {
  map.getCanvas().style.cursor = "";
});

var popup = new mapboxgl.Popup();

map.on("click", "places-5y0blc", function(e) {
  /////////////////////////ROUTES
  let features = map.queryRenderedFeatures(e.point, {
    layers: ["places-5y0blc"]
  });

  let routes = features[0].properties.route;
  let routeFix = routes.split(", ");

  let filter = routeFix.slice();
  filter.unshift("in", "route");

  map.setPaintProperty("metro-lines", "line-color", "#888");
  map.setPaintProperty("metro-lines-constructing", "line-color", "#888");
  map.setPaintProperty("MCC", "line-color", "#888");
  map.setPaintProperty("MCD-lines", "line-color", "#888");
  //map.setLayoutProperty("ngpt-pass", "visibility", "visible");
  //map.setLayoutProperty("ngpt-pass-text", "visibility", "visible");

  window.routesList = routeFix;
  for (var i = 0; i < window.routesList.length; i++) {
    let routeColors = [
      c0,
      c1,
      c2,
      c3,
      c0,
      c1,
      c2,
      c3,
      c0,
      c1,
      c2,
      c3,
      c0,
      c1,
      c2,
      c3,
      c0,
      c1,
      c2,
      c3
    ];

    map.addLayer(
      {
        id: routeFix[i],
        type: "line",
        source: "routes",
        "source-layer": "NGPT-routes-spt-dhbz68",
        filter: ["in", "route", routeFix[i]],
        paint: {
          "line-color": routeColors[i],
          "line-opacity": 0.85,
          "line-width": 1.5,
          //"line-dasharray": [2, 1],
          "line-offset": 2 * i
        }
      },
      "places-5y0blc"
    );
    map.addLayer(
      {
        id: routeFix[i] + "-text",
        type: "symbol",
        source: "routes",
        "source-layer": "NGPT-routes-spt-dhbz68",
        filter: ["in", "route", routeFix[i]],
        layout: {
          "text-field": ["to-string", ["get", "route"]],
          "text-size": 8,
          "symbol-placement": "line",
          "text-allow-overlap": true,
          "text-offset": [0, i / 2],
          "text-font": ["Ubuntu Mono Bold"]
        },
        paint: {
          "text-color": routeColors[i],
          "text-halo-width": 2,
          "text-halo-color": "#fff"
        }
      },
      "places-5y0blc"
    );
  }

  var popupRoutes = [];
  for (var i = 0; i < routeFix.length; i++) {
    let route =
      "<button class='route' style='border-color:" +
      map.getPaintProperty(routeFix[i], "line-color") +
      "'>" +
      routeFix[i] +
      "</button>";
    popupRoutes.push(route);
  }
  var popupRoutes = popupRoutes.join("");

  popup
    .setLngLat(e.lngLat)
    .setHTML(
      "<h3>" +
        e.features[0].properties.Name +
        "</h3>" +
        "<h>Маршруты: </h>" +
        popupRoutes
    )
    .addTo(map);

  var routesHTML = document.getElementsByClassName("route");

  for (var i = 0; i < routesHTML.length; i++) {
    routesHTML[i].addEventListener("click", function() {
      var routesHTMLactive = document.getElementsByClassName("route-active");

      function terminator(i) {
        routesHTMLactive[i].style.backgroundColor = "white";
        var routeIdBefore = routesHTMLactive[i].textContent;
        map.setPaintProperty(routeIdBefore, "line-width", 1.5);
        map.setFilter("ngpt-pass", null);
        map.setFilter("ngpt-pass-text", null);
        map.setLayoutProperty("ngpt-pass", "visibility", "none");
        map.setLayoutProperty("ngpt-pass-text", "visibility", "none");
        routesHTMLactive[i].className = "route";
      }

      for (var i = 0; i < routesHTMLactive.length; i++) terminator(i);

      var routeId = this.textContent;

      var routeColor = map.getPaintProperty(routeId, "line-color");

      var lineWidth = map.getPaintProperty(routeId, "line-width");
      if (lineWidth === 1.5) {
        /////////////////
        map.setPaintProperty(routeId, "line-width", 6);
        //map.setPaintProperty(routeId, "line-dasharray", null);
        this.className = "route-active";
        this.style.backgroundColor = routeColor;
        this.style.borderColor = routeColor;

        let currentRouteGeometry = map.queryRenderedFeatures({
          layers: [routeId]
        });
        let currentRouteFilter = currentRouteGeometry[0].properties.stopsFids;
        let routeStops = [
          "all",
          [
            "match",
            ["get", "fid"],
            JSON.parse("[" + currentRouteFilter + "]"),
            true,
            false
          ]
        ];
        
        map.setFilter("ngpt-pass", routeStops);
        map.setFilter("ngpt-pass-text", routeStops);
        map.setPaintProperty("ngpt-pass", "circle-color", routeColor);
        map.setLayoutProperty("ngpt-pass", "visibility", "visible");
        map.setPaintProperty("ngpt-pass", "circle-color", routeColor);
        map.setLayoutProperty("ngpt-pass-text", "visibility", "visible");
      }
    });
  }
});
// Change the cursor to a pointer when the mouse is over the places layer.
map.on("mouseenter", "places-5y0blc", function() {
  map.getCanvas().style.cursor = "pointer";
});
// Change it back to a pointer when it leaves.
map.on("mouseleave", "places-5y0blc", function() {
  map.getCanvas().style.cursor = "";
});

//map.on('click', 'ngpt-highlighted', function(e) {
// set bbox as 5px reactangle area around clicked point
popup.on("close", function(e) {
  if (window.routesList !== undefined) {
    for (var i = 0; i < window.routesList.length; i++) {
      map.removeLayer(window.routesList[i]);
      map.removeLayer(window.routesList[i] + "-text");
    }
  }
  map.setPaintProperty("metro-lines", "line-color", ["get", "colour"]);
  map.setPaintProperty("metro-lines-constructing", "line-color", [
    "get",
    "colour"
  ]);
  map.setPaintProperty("MCC", "line-color", "#ef1f26");
  map.setPaintProperty("MCD-lines", "line-color", [
    "interpolate",
    ["linear"],
    ["get", "MCD"],
    1,
    "hsl(37, 97%, 55%)",
    2,
    "hsl(338, 84%, 62%)",
    3,
    "hsl(19, 88%, 54%)",
    4,
    "hsl(158, 53%, 48%)",
    5,
    "hsl(98, 49%, 51%)"
  ]);
  map.setLayoutProperty("ngpt-pass", "visibility", "none");
  map.setLayoutProperty("ngpt-pass-text", "visibility", "none");
  map.setLayoutProperty("metro-pass", "visibility", "none");
  map.setLayoutProperty("metro-pass-text", "visibility", "none");
  //map.setPaintProperty("⚙ ППТ", "fill-color", "hsla(224, 32%, 51%, 0.2)");
  //map.setPaintProperty("ППТ", "fill-color", "hsla(0, 100%, 33%, 0.2)");
  //map.setFilter("⚙ ППТ", undefined); //["in", "REG_NUM", ""]);
  //map.setFilter("ППТ", undefined); //["in", "REG_NUM", ""]);
  map.removeLayer("temp-PPT");
});
///////////////////////////
map.on("click", "⚙ ППТ", function(e) {
  popup
    .setLngLat(e.lngLat)
    .setHTML(
      "<h3>" +
        e.features[0].properties.NAME +
        "</h3>" +
        "<p>Статус: " +
        e.features[0].properties.STATUS +
        "</p>" +
        "<p>Вид ППТ: " +
        e.features[0].properties.VID_PPT +
        "</p>" +
        "<p>Дата начала разработки: " +
        e.features[0].properties.DATA_DOC_RAZR +
        "</p>" +
        "<p>Исполнитель: " +
        e.features[0].properties.ISPOLNITEL +
        "</p>"
    )
    .addTo(map);
  var featureId = e.features[0].properties.OBJECTID;
  map.addLayer({
    id: "temp-PPT",
    type: "fill",
    source: "⚙ ППТ_source",
    "source-layer": "PPT-WIP-1movuq",
    filter: ["in", "OBJECTID", featureId],
    paint: {
      "fill-color": "hsla(224, 32%, 51%, 0.6)"
      //"fill-outline-color": "hsla(224, 32%, 51%, 0.5)
    }
  });
});
// Change the cursor to a pointer when the mouse is over the places layer.
map.on("mouseenter", "⚙ ППТ", function() {
  map.getCanvas().style.cursor = "pointer";
});
// Change it back to a pointer when it leaves.
map.on("mouseleave", "⚙ ППТ", function() {
  map.getCanvas().style.cursor = "";
});
map.on("click", "ППТ", function(e) {
  popup
    .setLngLat(e.lngLat)
    .setHTML(
      "<h3>" +
        e.features[0].properties.NAME +
        "</h3>" +
        "<p>Статус: " +
        e.features[0].properties.STATUS +
        "</p>" +
        "<p>Вид ППТ: " +
        e.features[0].properties.VID_PPT +
        "</p>" +
        "<p>Дата утверждения: " +
        e.features[0].properties.DATA_DOC_UTV +
        "</p>" +
        "<p>Исполнитель: " +
        e.features[0].properties.ISPOLNITEL +
        "</p>"
    )
    .addTo(map);
  var featureId = e.features[0].properties.OBJECTID;
  map.addLayer({
    id: "temp-PPT",
    type: "fill",
    source: "ППТ_source",
    "source-layer": "PPT-122uv6",
    filter: ["in", "OBJECTID", featureId],
    paint: {
      "fill-color": "hsla(0, 100%, 33%, 0.6)"
      //"fill-outline-color": "hsla(224, 32%, 51%, 0.5)
    }
  });
  //var feature = e.features[0];
  //map.setFilter("ППТ", ["in", "REG_NUM", feature.properties.REG_NUM]);
  //map.setPaintProperty("ППТ", "fill-color", "hsla(0, 100%, 33%, 0.7)");
});
// Change the cursor to a pointer when the mouse is over the places layer.
map.on("mouseenter", "ППТ", function() {
  map.getCanvas().style.cursor = "pointer";
});
// Change it back to a pointer when it leaves.
map.on("mouseleave", "ППТ", function() {
  map.getCanvas().style.cursor = "";
});

map.on("click", "ДКР", function(e) {
  popup
    .setLngLat(e.lngLat)
    .setHTML(
      "<h3>" +
        e.features[0].properties.Year +
        " | " +
        e.features[0].properties.NAM_STR +
        " | " +
        e.features[0].properties.Type +
        "</h3>"
    )
    .addTo(map);
});

map.on("click", "bridges-1aqn6e", function(e) {
  popup
    .setLngLat(e.lngLat)
    .setHTML("<h3>" + e.features[0].properties.status + "</h3>")
    .addTo(map);
});

// Change the cursor to a pointer when the mouse is over the places layer.
map.on("mouseenter", "ДКР", function() {
  map.getCanvas().style.cursor = "pointer";
});
// Change it back to a pointer when it leaves.
map.on("mouseleave", "ДКР", function() {
  map.getCanvas().style.cursor = "";
});

var coordinatesGeocoder = function(query) {
  // match anything which looks like a decimal degrees coordinate pair
  var matches = query.match(
    /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
  );
  if (!matches) {
    return null;
  }

  function coordinateFeature(lng, lat) {
    return {
      center: [lng, lat],
      geometry: {
        type: "Point",
        coordinates: [lng, lat]
      },
      place_name: "Lat: " + lat + " Lng: " + lng,
      place_type: ["coordinate"],
      properties: {},
      type: "Feature"
    };
  }

  var coord1 = Number(matches[1]);
  var coord2 = Number(matches[2]);
  var geocodes = [];

  if (coord1 < -90 || coord1 > 90) {
    // must be lng, lat
    geocodes.push(coordinateFeature(coord1, coord2));
  }

  if (coord2 < -90 || coord2 > 90) {
    // must be lat, lng
    geocodes.push(coordinateFeature(coord2, coord1));
  }

  if (geocodes.length === 0) {
    // else could be either lng, lat or lat, lng
    geocodes.push(coordinateFeature(coord1, coord2));
    geocodes.push(coordinateFeature(coord2, coord1));
  }

  return geocodes;
};

var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  placeholder: "Поиск",
  localGeocoder: coordinatesGeocoder,
  bbox: [
    36.540169324143605,
    55.020305819627616,
    38.3135420226066969,
    56.1505434064830737
  ]
});

let p = document.createElement("button");
p.innerHTML = `<i class="fa fa-street-view"></i>`;
p.setAttribute("class", "headerButton");
p.setAttribute("onclick", "togglePano(event)");

let b = document.createElement("button");
b.innerHTML = `<i class="fa fa-dot-circle-o"></i>`;
b.setAttribute("class", "headerButton");
b.setAttribute("onclick", "togglePano(event)");

let geocoderDOM = document.getElementById("geocoder");
let headerDOM = document.getElementById("header");
geocoderDOM.insertBefore(geocoder.onAdd(map), headerDOM);

map.on("pitch", function(e) {
  if (map.getPitch() > 0) {
    map.setLayoutProperty("3d-buildings", "visibility", "visible");
    map.setLayoutProperty("buildings-13ut9s", "visibility", "none");
  } else {
    map.setLayoutProperty("3d-buildings", "visibility", "none");
    map.setLayoutProperty("buildings-13ut9s", "visibility", "visible");
  }
});

map.on("touchstart", function(data) {
  if (data.points.length === 2) {
    var diff = Math.abs(data.points[0].y - data.points[1].y);
    if (diff <= 50) {
      data.originalEvent.preventDefault(); //prevent browser refresh on pull down
      self.map.touchZoomRotate.disable(); //disable native touch controls
      self.map.dragPan.disable();
      self.dpPoint = data.point;
      self.dpPitch = self.map.getPitch();
    }
  }
});

map.on("touchmove", function(e) {
  if (map.getPitch() > 0) {
    map.setLayoutProperty("3d-buildings", "visibility", "visible");
    map.setLayoutProperty("buildings-13ut9s", "visibility", "none");
  } else {
    map.setLayoutProperty("3d-buildings", "visibility", "none");
    map.setLayoutProperty("buildings-13ut9s", "visibility", "visible");
  }
});

map.on("touchmove", function(data) {
  if (self.dpPoint) {
    data.preventDefault();
    data.originalEvent.preventDefault();
    var diff = (self.dpPoint.y - data.point.y) * 0.5;
    self.map.setPitch(self.dpPitch + diff);
  }
});

map.on("touchend", function(data) {
  if (self.dpPoint) {
    self.map.touchZoomRotate.enable();
    self.map.dragPan.enable();
  }
  self.dpPoint = null;
});

map.on("touchcancel", function(data) {
  if (self.dpPoint) {
    self.map.touchZoomRotate.enable();
    self.map.dragPan.enable();
  }
  self.dpPoint = null;
});
