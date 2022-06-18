import './style.css'

document.querySelector('#menu').innerHTML = `
  <h1>Satellite Safari</h1>
  <p style="font-size:12px;"> Click a button below to fly to see that animal in satellite imagery somewhere on the globe</p>
`
var animalList = ["🐆", 2, "🐆", 4, 7];

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