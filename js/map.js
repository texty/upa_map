
    var mySlider = new rSlider({
        target: '#sampleSlider',
        values: [2010, 2011, 2012],
        range: false,
        tooltip: true,
        scale: true,
        labels: true,
        set: [2010, 2013]
    });


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
                'lineOpacity': 1
            }
        });

        
        linesLayer.addGeometry(line);


        }

    });


    d3.select("#filter").on("click", function() {
        console.log("aaas")
        function compare_strings(st, st_2){ 
            console.log(st, st_2)
            console.log("yes")
            
            return True
        }

        function filter() {
            upa_places._geoList
              .forEach(function (feature) {
                var value = d3.select("#input")._groups[0][0].value;

                if (feature.properties.date > value) {
                feature._symbol.markerFill = "#7375d8";
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
          filter()
    })

});