import './style.css'
var transformRequest = (url, resourceType) => {
    var isMapboxRequest =
        url.slice(8, 22) === "api.mapbox.com" ||
        url.slice(10, 26) === "tiles.mapbox.com";
    return {
        url: isMapboxRequest ?
            url.replace("?", "?pluginName=sheetMapper&") : url
    };
};
mapboxgl.accessToken = 'pk.eyJ1IjoiaGlnaGVzdHJvYWQiLCJhIjoiY2w0amttaWRpMDZqMDNtcGJnZng3Ym03bCJ9.ZuuRTjw9GRgHcWTzi0-CoA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    projection: 'globe',
    style: 'mapbox://styles/highestroad/cl4jkkgti001o15qu2iwuc3bn', // style URL
    center: [-117.2283574, 32.7648203], // starting position [lng, lat]
    zoom: 2, // starting zoom
    transformRequest: transformRequest
});

document.querySelector('#menu').innerHTML = `
  <h1 style="color:#FFD65B; font-size: 60px; line-height: .09;">Satellite Safari</h1>
  <p style="color:white; font-size:16px; font-family: 'Joan'"; color:white"> Click the buttons below to find that animal in Satellite imagery. </p>
`

function clickedit() {
    console.log("it was clicked")
}

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: 'https://docs.google.com/spreadsheets/d/1Y9mA-fJ8DQ60hpeGSaMp8tyVp0WngY9QxEZ_aYgsPUs/gviz/tq?tqx=out:csv&sheet=Approved',
        dataType: "text",
        success: function(csvData) {
            makeGeoJSON(csvData);
        }
    });



    function makeGeoJSON(csvData) {
        csv2geojson.csv2geojson(csvData, {
            latfield: 'Latitude',
            lonfield: 'Longitude',
            delimiter: ','
        }, function(err, data) {
            console.log(data)

            let animalList = [];
            console.log("hello is this working")
            console.log(data.features[1].properties.AnimalName)
            for (let a of data.features) {
                animalList.push([a.properties.Emoji, a.properties.Timestamp]);
            }
            console.log(animalList)
            console.log("<button id=" + data.features[0].properties.Timestamp + "class='button button2'>" + data.features[0].properties.Emoji + "</button>")

            for (var i = 0; i < data.features.length; i++) {
                // console.log(data.features[i].properties.Timestamp);
                document.getElementById("menu").innerHTML += "<button id=" + i + " class='button button2'>" + data.features[i].properties.Emoji + "</button>";
            }
            // for (var c = 0; c < data.features.length; c++) {
            //     document.getElementById(data.features[c].properties.Timestamp).onclick = function() {
            //         // this isn't registering as the line item it should
            //         console.log(c)
            //         console.log(data.features[c])

            //         // map.flyTo({ center: [data.features[c].properties.Longitude, data.features[c].properties.Latitude], zoom: 19.3 })
            //     };
            // };
            $("button").click(function() {
                map.flyTo({ center: [data.features[this.id].geometry.coordinates[0], data.features[this.id].geometry.coordinates[1]], zoom: 19 })

            });
            map.on('load', function() {

                //Add the the layer to the map
                map.addLayer({
                    'id': 'csvData',
                    "maxzoom": 18.8,
                    'type': 'symbol',
                    'source': {
                        'type': 'geojson',
                        'data': data
                    },
                    "layout": {
                        "icon-image": "animalmarker",
                        "icon-size": [
                            "interpolate", ["exponential", 1.16],
                            ["zoom"],
                            6,
                            0.1,
                            22,
                            0.6
                        ],
                        "text-anchor": "top",
                        "text-offset": [0, 1],
                        "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
                        "text-allow-overlap": true,
                        "icon-allow-overlap": true,
                        "text-field": ""
                    },
                    "paint": {
                        "text-color": "hsl(0, 0%, 99%)",
                        "text-halo-color": "hsla(35, 78%, 56%, 0.82)",
                        "text-halo-width": 1,
                        "text-halo-blur": 3
                    }
                });


                // When a click event occurs on a feature in the csvData layer, open a popup at the
                // location of the feature, with description HTML from its properties.
                map.on('click', 'csvData', function(e) {
                    var coordinates = e.features[0].geometry.coordinates.slice();

                    //set popup text
                    //You can adjust the values of the popup to match the headers of your CSV.
                    // For example: e.features[0].properties.Name is retrieving information from the field Name in the original CSV.

                    var description = `<h3>` + e.features[0].properties.AnimalName + `</h3>` + `<h4>` + `<b>` + `Finder: ` + `</b>` + e.features[0].properties.FinderName;

                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    //add Popup to map

                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(description)
                        .addTo(map);
                });

                // Change the cursor to a pointer when the mouse is over the places layer.
                map.on('mouseenter', 'csvData', function() {
                    map.getCanvas().style.cursor = 'pointer';
                });

                // Change it back to a pointer when it leaves.
                map.on('mouseleave', 'csvData', function() {
                    map.getCanvas().style.cursor = '';
                });
                // Zooms Map to see all points
                // var bbox = turf.bbox(data);
                // map.fitBounds(bbox, {
                //     padding: 50
                // });

            });

        });
    };
});