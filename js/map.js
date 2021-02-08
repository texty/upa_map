
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
            arrowStyle: 'classic',
            arrowPlacemet: 'vertex-last', //vertex-first, vertex-last, vertex-firstlast, point
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

        // data[1].forEach(function (d) {
        //     d.child_lat = +d.child_lat;
        //     d.child_lon = +d.child_lon;

        //     new maptalks.Marker(
        //         [d.child_lon, d.child_lat], {
        //             'properties': {
        //                 'name': ''
        //             },
        //             'symbol': {
        //                 'textFaceName': 'sans-serif',
        //                 'textName': d.place, //value from name in geometry's properties
        //                 'textWeight': 'normal', //'bold', 'bolder'
        //                 'textStyle': 'normal', //'italic', 'oblique'
        //                 'textSize': 12,
        //                 'textFont': null, //same as CanvasRenderingContext2D.font, override textName, textWeight and textStyle
        //                 'textFill': '#34495e',
        //                 'textOpacity': 1,
        //                 'textHaloFill': '#E6EBE6',
        //                 'textHaloRadius': 5,
        //                 'textWrapWidth': null,
        //                 'textWrapCharacter': '\n',
        //                 'textLineSpacing': 0,

        //                 'textDx': 0,
        //                 'textDy': 0,

        //                 'textHorizontalAlignment': 'middle', //left | middle | right | auto
        //                 'textVerticalAlignment': 'middle', // top | middle | bottom | auto
        //                 'textAlign': 'center' //left | right | center | auto
        //             }
        //         }
        //     ).addTo(label_point);
        // });



    });

    // function drawLayer(df, target_layer) {

    //     df.forEach(function (d) {
    //         d.child_lat = +d.child_lat;
    //         d.child_lon = +d.child_lon;
    //         d.parent_lat = +d.parent_lat;
    //         d.parent_lon = +d.parent_lon;
    //     });


    //     // var nested = d3.nest()
    //     //     .key(function (d) { return d.parent_node })
    //     //     .entries(df);




    //     console.log(nested);

    //     // var color = d3.scaleOrdinal()
    //     //     .domain(["coal", "grain", "ore", "stone"])
    //     //     .range(["#000000", "#15CF74", "#FF3A44", "#FFD600"]);


    //     // максимальна к-ть вагонів для line width domain
    //     // var maxWag = d3.max(df, function (d) { return +d.no_wagons });

    //     // var scaleRadius = d3.scaleLinear()
    //     //     .domain([0, maxWag])
    //     //     .range([5, 25]);

    //     // var scaleLineWidth = d3.scaleLinear()
    //     //     .domain([0, maxWag])
    //     //     .range([1, 4]);



    //     nested.forEach(function (d) {

    //         // let radius = scaleRadius(d.values[0].no_wagons);
    //         // let lineWidth = scaleLineWidth(d.values[0].no_wagons);
    //         // blue circle
    //         var src = new maptalks.Marker(
    //             [d.values[0].longitude, d.values[0].latitude], {
    //             symbol: {
    //                 'markerType': 'ellipse',
    //                 'markerFill': "#FF3A44",
    //                 'markerFillOpacity': 0.8,
    //                 'markerLineColor': "white",
    //                 'markerLineWidth': 0.8,
    //                 'markerWidth': 20,
    //                 'markerHeight': 20
    //             }
    //         }
    //         );


    //         addListen();

    //         function addListen() {
    //             //mousemove and touchmove is annoying, so not listening to it.
    //             src.on('click', function () {
    //                 linesLayer.forEach(function (l) {
    //                     l.remove();
    //                 });

    //                 d.values.forEach(function (t) {
    //                     var dst = new maptalks.Marker(
    //                         [t.lon_receiver, t.lat_receiver], {
    //                         'symbol': {
    //                             'markerType': 'ellipse',
    //                             'markerFill': '#E78B8A',
    //                             'markerFillOpacity': 0.9,
    //                             'markerLineColor': color(type),
    //                             'markerLineWidth': 3,
    //                             'markerWidth': 0,
    //                             'markerHeight': 0
    //                         }
    //                     }
    //                     );



    //                     var line = new maptalks.ArcConnectorLine(src, dst, {
    //                         arcDegree: 90,
    //                         showOn: 'always',
    //                         arrowStyle: 'classic',
    //                         arrowPlacement: 'vertex-last', //vertex-first, vertex-last, vertex-firstlast, point
    //                         symbol: {
    //                             'fillColor': color(type),
    //                             'fillOpacity': 1,
    //                             'lineColor': color(type),
    //                             'lineWidth': 1,
    //                             //'lineWidth': lineWidth,
    //                             'lineOpacity': 1
    //                         }
    //                     });

    //                     linesLayer.addGeometry(line);
    //                 });





    //             });
    //         }


    //         target_layer.addGeometry(src);


    //     });
    // }


    // drawLayer(data[1], upa_places);


});