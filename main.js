import './style.css'

mapboxgl.accessToken = 'pk.eyJ1IjoiaGlnaGVzdHJvYWQiLCJhIjoiY2w0amttaWRpMDZqMDNtcGJnZng3Ym03bCJ9.ZuuRTjw9GRgHcWTzi0-CoA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    projection: 'globe',
    style: 'mapbox://styles/highestroad/cl4jkkgti001o15qu2iwuc3bn', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
});

document.querySelector('#menu').innerHTML = `
  <h1>Satellite Safari</h1>
  <p style="font-size:12px;"> Click a button below to fly to see that animal in satellite imagery somewhere on the globe</p>
`
var animalList = ["🐆", "🐘", "🐉", "🐋", "🦩"];

buttons();
document.getElementById("qrf-button").onclick = function() { clickedit() };

function buttons() {
    for (var i = 0; i < animalList.length; i++) {
        document.getElementById("menu").innerHTML += "<button id='qrf-button' class='button button2'>" + animalList[i] + "</button>";
    }
}

function clickedit() {
    console.log("it was clicked")
}