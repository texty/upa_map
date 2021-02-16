
var dict_of_vals = {"січ.1941":"1941-01-01 00:00",
"лют.1941":"1941-02-01 00:00",
"бер.1941":"1941-03-01 00:00",
"квіт.1941":"1941-04-01 00:00",
"трав.1941":"1941-05-01 00:00",
"черв.1941":"1941-06-01 00:00",
"лип.1941":"1941-07-01 00:00",
"серп.1941":"1941-08-01 00:00",
"вер.1941":"1941-09-01 00:00",
"жовт.1941":"1941-10-01 00:00",
"лист.1941":"1941-11-01 00:00",
"груд.1941":"1941-12-01 00:00",
"січ.1942":"1942-01-01 00:00",
"лют.1942":"1942-02-01 00:00",
"бер.1942":"1942-03-01 00:00",
"квіт.1942":"1942-04-01 00:00",
"трав.1942":"1942-05-01 00:00",
"черв.1942":"1942-06-01 00:00",
"лип.1942":"1942-07-01 00:00",
"серп.1942":"1942-08-01 00:00",
"вер.1942":"1942-09-01 00:00",
"жовт.1942":"1942-10-01 00:00",
"лист.1942":"1942-11-01 00:00",
"груд.1942":"1942-12-01 00:00"};



var map = new maptalks.Map('map', {
    center: [32, 48.5],
    zoom: 8,
    attributionControl: {
        'content': '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
    },
    baseLayer: new maptalks.TileLayer('tile', {
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
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
    d3.csv("data/geocode_upa_with_dest.csv"), //1

    // d3.csv("data/top_senders_coal.csv"),
    // d3.csv("data/top_senders_grain.csv"),
    // d3.csv("data/top_senders_ore.csv"),
    // d3.csv("data/top_senders_stone.csv")




]).then(function (data) {


    window.globalData = data[1];    
    // new maptalks.VectorLayer('admin', data[0]).addTo(map);

    const upa_places = new maptalks.VectorLayer('upa').addTo(map);
    var label_point = new maptalks.VectorLayer('label').addTo(map);
    

    const linesLayer = new maptalks.VectorLayer('lines', {
        // 'opacity': 0.2
    }).addTo(map);

    console.log(data[1]);

    data[1].forEach(function (d) {
                d.child_lat = +d.child_lat;
                d.child_lon = +d.child_lon;
                d.parent_lat = +d.parent_lat;
                d.parent_lon = +d.parent_lon;
            });


    data[1].forEach(function (d) {
        var src = new maptalks.Marker(
            [d.child_lon, d.child_lat], {
            symbol: {
                'markerType': 'ellipse',
                'markerFill': "#FF3A44",
                'markerFillOpacity': 0.8,
                'markerLineColor': "white",
                'markerLineWidth': 0.8,
                'markerWidth': 10,
                'markerHeight': 10
            },
            properties : {
                'date' : d.creation_date
            }
        }


        );

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
                            'markerFill': "#FF3100",
                            'markerFillOpacity': 0.8,
                            'markerLineColor': "white",
                            'markerLineWidth': 0.8,
                            'markerWidth': 10,
                            'markerHeight': 10
                        },
                    properties : {
                        'date' : d.creation_date
                    }
                    }
                );
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
                'fillColor': "#00000",
                'fillOpacity': 1,
                'lineColor': "#00000",
                'lineWidth': 0.5,
                //'lineWidth': lineWidth,
                'lineOpacity': 0.1
            },
            properties : {
                'date' : d.creation_date
            }
        });

        
        linesLayer.addGeometry(line);


        }

    });

    function filter(date_val) {
        upa_places._geoList
          .forEach(function (feature) {
            ;

            if (feature.properties.date >  date_val) {
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
            feature._symbol.markerFill = "#FF3100";
            feature._symbol.markerFillOpacity = 0.8
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

            if (feature.properties.date >  date_val) {
            // feature._symbol.markerFill = "#7375d8";
            feature._symbol.lineOpacity = 0
            feature.updateSymbol([
              {
                // 'markerFill': '#7375d8',
                // 'markerWidth': 100,
                // 'markerHeight': 100
              }
            ]);
            }
            else {
            feature._symbol.lineOpacity = 1
            feature.updateSymbol([
              {
                // 'markerFill': '#7375d8',
                // 'markerWidth': 100,
                // 'markerHeight': 100
              }
            ]);
            }
          });
      }


    var mySlider = new rSlider({
        target: '#sampleSlider',
        values: ["лип.1941","серп.1941","вер.1941","жовт.1941","лист.1941", "груд.1941",
        "січ.1942","лют.1942", "бер.1942","квіт.1942","трав.1942","черв.1942","лип.1942","серп.1942","вер.1942","жовт.1942","лист.1942", "груд.1942"],
        range: false,
        tooltip: true,
        scale: true,
        labels: false,
        set: ["серп.1941"],
        onChange: function (vals) {filter(dict_of_vals[vals])}
    });



    d3.select("#filter").on("click", function(){
        d3.select("div#myModal").style("display", "block");

        console.log("gdgdgd")
        debugger;

        d3.html("staline.html").then(function (d) { 
            console.log(d); 
            console.log("gdgd")
            d3.select("div#myModal").html(d.body.innerHTML)
        }); 

    });

    d3.select(".close").on("click", function(){
        d3.select("div#myModal").style("display", "none");
    });


});