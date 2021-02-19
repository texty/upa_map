
var dict_of_vals = {
  "січ.1941": "1941-01-01 00:00",
  "лют.1941": "1941-02-01 00:00",
  "бер.1941": "1941-03-01 00:00",
  "квіт.1941": "1941-04-01 00:00",
  "трав.1941": "1941-05-01 00:00",
  "черв.1941": "1941-06-01 00:00",
  "лип.1941": "1941-07-01 00:00",
  "серп.1941": "1941-08-01 00:00",
  "вер.1941": "1941-09-01 00:00",
  "жовт.1941": "1941-10-01 00:00",
  "лист.1941": "1941-11-01 00:00",
  "груд.1941": "1941-12-01 00:00",
  "січ.1942": "1942-01-01 00:00",
  "лют.1942": "1942-02-01 00:00",
  "бер.1942": "1942-03-01 00:00",
  "квіт.1942": "1942-04-01 00:00",
  "трав.1942": "1942-05-01 00:00",
  "черв.1942": "1942-06-01 00:00",
  "лип.1942": "1942-07-01 00:00",
  "серп.1942": "1942-08-01 00:00",
  "вер.1942": "1942-09-01 00:00",
  "жовт.1942": "1942-10-01 00:00",
  "лист.1942": "1942-11-01 00:00",
  "груд.1942": "1942-12-01 00:00"
};


var names_of_obl = {
  "Сталіно": "staline.html",
  "Житомир": "zhytomyr.html"

};


var map = new maptalks.Map('map', {
  center: [32, 48.5],
  zoom: 8,
  attributionControl: {
    'content': '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  baseLayer: new maptalks.TileLayer('tile', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
  }),
  zoomControl: {
    'position': 'top-left',
    'slider': false,
    'zoomLevel': false
  },
  layers: [
    new maptalks.VectorLayer('v')
  ],
  minZoom: 5,
  maxZoom: 10,
  maxPitch: 0,
  pitch: 0,
  scrollWheelZoom: true
});


Promise.all([
  d3.json("data/UKR_adm1.json"), //0
  d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vTk93XrFEPta5M6gEMbnVKuzw4n31pYctHqMyfk9KkW0PS5TGWVjShbYpA9LUZRwuGfoYi1wuFYIwmm/pub?output=csv"), //1

  // d3.csv("data/top_senders_coal.csv"),
  // d3.csv("data/top_senders_grain.csv"),
  // d3.csv("data/top_senders_ore.csv"),
  // d3.csv("data/top_senders_stone.csv")




]).then(function (data) {


  window.globalData = data[1];
  // new maptalks.VectorLayer('admin', data[0]).addTo(map);

  const upa_places = new maptalks.VectorLayer('upa').addTo(map);
  const obl_markers = new maptalks.VectorLayer('upa_main').addTo(map);
  var label_point = new maptalks.VectorLayer('label').addTo(map);


  const linesLayer = new maptalks.VectorLayer('lines', {
  }).addTo(map);

  console.log(data[1]);

  // тут ми додаємо окремі маркери для великих міст, щоб можна буде по кліку на них показувати довідку
  let main_places = data[1].filter(d => (d.type.split(", ")[0] == 'oblast' | d.type.split(", ")[0] == 'kray'))


  var type_size = {
    // "oblast":40,
    // "kray":40,
    "okruga":25,
    "nadraion":10,
    "raion":10
  }

  main_places.forEach(function (d) {
    d.child_lat = +d.child_lat;
    d.child_lon = +d.child_lon;
    d.parent_lat = +d.parent_lat;
    d.parent_lon = +d.parent_lon;

    var main_markers = new maptalks.Marker(
      [d.child_lon, d.child_lat], {
      symbol: {
        'markerType': 'ellipse',
        'markerFill': "#ff3d4f",
        'markerFillOpacity': 1,
        'markerLineColor': "#b4b4b4",
        'markerLineWidth': 4,
        'markerWidth': 40,
        'markerHeight': 40
      },
      properties: {
        'date': d.creation_date,
        "place": d.place,
        "parent_node": d.parent_node,
        "type": "child"


      }
    }


    );

    obl_markers.addGeometry(main_markers);

    var tip = new maptalks.ui.ToolTip(d["place"]);

    tip.addTo(main_markers);

  });

  data[1].forEach(function (d) {
    d.child_lat = +d.child_lat;
    d.child_lon = +d.child_lon;
    d.parent_lat = +d.parent_lat;
    d.parent_lon = +d.parent_lon;

    d.type_major =  d.type.split(", ")[0]

  });


  data[1].forEach(function (d) {
    var src = new maptalks.Marker(
      [d.child_lon, d.child_lat], {
      symbol: {
        'markerType': 'ellipse',
        'markerFill': "#ff3d4f",
        'markerFillOpacity': 1,
        'markerLineColor': "#b4b4b4",
        'markerLineWidth': 0,
        'markerWidth': type_size[d.type_major],
        'markerHeight': type_size[d.type_major]
      },
      properties: {
        'date': d.creation_date,
        "place": d.place,
        "parent_node": d.parent_node,
        "type": "child"


      }
    }


    );

    var tip = new maptalks.ui.ToolTip(d["place"]);

    tip.addTo(src);



    upa_places.addGeometry(src);

    if (
      d.is_single == "FALSE"
      // &&  !(d.type.includes("oblast")) 
    ) {

      try {
        var dst = new maptalks.Marker(
          [d.parent_lon, d.parent_lat], {
          symbol: {
            'markerType': 'ellipse',
            'markerFill': "#ff3d4f",
            'markerFillOpacity': 1,
            'markerLineColor': "#b4b4b4",
            'markerLineWidth': 0,
            'markerWidth': type_size[d.type_major],
            'markerHeight': type_size[d.type_major]
          },
          properties: {
            'date': d.creation_date,
            "place": d.place,
            "parent_node": d.parent_node,
            "type": "parent"

          }
        }
        );

        var tip = new maptalks.ui.ToolTip(d["parent_node"]);

        tip.addTo(dst);
      } catch (error) {
        console.error(error);
        console.log(d)
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
      }



      upa_places.addGeometry(dst);

      var line = new maptalks.ArcConnectorLine(src, dst, {
        arcDegree: 90,
        showOn: 'always',
        // arrowStyle: 'classic',
        // arrowPlacemet: 'vertex-last', //vertex-first, vertex-last, vertex-firstlast, point
        symbol: {
          // 'fillColor': "#blue",
          // 'fillOpacity': type_opacity[d.type_major],
          'lineColor': "#b4b4b4", 
          'lineWidth': 0.5,
          // 'lineColor': type_color[d.type_major],
          // 'lineWidth': type_width[d.type_major],
          //'lineWidth': lineWidth,
          // 'lineOpacity': 1
          // type_opacity[d.type_major]
        },
        properties: {
          'date': d.creation_date,
        }
      });


      linesLayer.addGeometry(line);


    }

  });

  function filter(date_val) {
    upa_places._geoList
      .forEach(function (feature) {
        ;

        if (feature.properties.date > date_val) {
          // feature._symbol.markerFill = "#7375d8";
          feature._symbol.markerFillOpacity = 0

          feature.updateSymbol([
            {
              // 'markerFill': '#7375d8',
              // 'markerWidth': 100,
              // 'markerHeight': 100
            }
          ]);
        }
        else {
          feature._symbol.markerFill = "#ff3d4f";
          feature._symbol.markerFillOpacity = 1
          feature.updateSymbol([
            {
              // 'markerFill': '#7375d8',
              // 'markerWidth': 100,
              // 'markerHeight': 100
            }
          ]);
        }
      });


    obl_markers._geoList
      .forEach(function (feature) {
        ;

        if (feature.properties.date > date_val) {
          // feature._symbol.markerFill = "#7375d8";
          feature._symbol.markerFillOpacity = 0
          feature._symbol.markerLineWidth = 0
          feature.updateSymbol([
            {
              // 'markerFill': '#7375d8',
              // 'markerWidth': 100,
              // 'markerHeight': 100
            }
          ]);
        }
        else {
          feature._symbol.markerFill = "#ff3d4f";
          feature._symbol.markerFillOpacity = 1
          feature._symbol.markerLineWidth = 4
          feature.updateSymbol([
            {
              // 'markerFill': '#7375d8',
              // 'markerWidth': 100,
              // 'markerHeight': 100
            }
          ]);
        }
      });



    linesLayer._geoList
      .forEach(function (feature) {

        if (feature.properties.date > date_val) {
          // feature._symbol.markerFill = "#7375d8";
          feature._symbol.lineOpacity = 0
          feature.updateSymbol([
            {
            }
          ]);
        }
        else {
          feature._symbol.lineOpacity = 1
          feature.updateSymbol([
            {
            }
          ]);
        }
      });
  }


  var mySlider = new rSlider({
    target: '#sampleSlider',
    values: ["лип.1941", "серп.1941", "вер.1941", "жовт.1941", "лист.1941", "груд.1941",
      "січ.1942", "лют.1942", "бер.1942", "квіт.1942", "трав.1942", "черв.1942", "лип.1942",
      "серп.1942", "вер.1942", "жовт.1942", "лист.1942", "груд.1942"],
    range: false,
    tooltip: true,
    scale: true,
    labels: false,
    set: ["серп.1941"],
    onChange: function (vals) { filter(dict_of_vals[vals]) }
  });

  // linesLayer.on('click', function (e) {
  //     debugger;
  //     alert(e)

  //     });

  map.on('click', function (e) {
    //reset colors
    // upa_places.forEach(function (g) {
    //   g.updateSymbol({
    //     'markerFill' : '#0e595e'
    //   });
    // });
    //identify
    map.identify(
      {
        'coordinate': e.coordinate,
        'layers': [obl_markers],
        // "count": 1
      },
      function (geos) {
        // debugger;
        // console.log(geos.map(d => d.properties.place)),
        // // console.log(geos[0].properties.parent_node)
        // console.log(geos.map(d => d._coordinates))
        // console.log(geos.map(d => d.properties.type))



        geos.forEach(function (g) {

          var html_name = names_of_obl[g.properties.place];
          // debugger;


          if (html_name) {
            d3.select("div#myModal").style("display", "block");

            d3.html(`https://raw.githubusercontent.com/texty/upa_map/main/htmls/${html_name}`).then(function (d) {
              d3.select("div#myModal div#modal-text").html(d.body.innerHTML)
            });

          }

          // if (g.properties.type == "child") {
          //   console.log(g.properties.place)

          //   d3.select("div#myModal").style("display", "block");

          //   d3.html("htmls/staline.html").then(function (d) {
          //     d3.select("div#myModal div#modal-text").html(d.body.innerHTML)
          //   });
          // }
          // g.updateSymbol({
          //   'markerFill' : '#f00'
          // });
        });
        // if (geos.length === 0) {
        //   return;
        // }
        // geos.forEach(function (g) {
        //   g.updateSymbol({
        //     'markerFill' : '#f00'
        //   });
        // });
      }
    );
  });



  // d3.select("#filter").on("click", function(){
  //     d3.select("div#myModal").style("display", "block");

  //     d3.html("htmls/staline.html").then(function (d) { 
  //         d3.select("div#myModal div#modal-text").html(d.body.innerHTML)
  //     }); 

  // });

  d3.select("span#close").on("click", function () {
    d3.select("div#myModal").style("display", "none");
  });


});