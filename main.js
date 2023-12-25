// Copyright (c) 2023 SobaZino | Mehran Nosrati

var OPTIMALVALUE = document.getElementById("OPTIMALVALUE");
var OPTIMALPOLICY = document.getElementById("OPTIMALPOLICY");
var INPUT = document.getElementById("INPUT");
var OUTPUT = document.getElementById("OUTPUT");
var SETV = document.getElementById("SETV");
var VBUTTON = document.getElementById("VBUTTON");

var ColorBool = false;
var NumberNode = 0;
var view;

function UPDATE(D) {
  OPTIMALVALUE.innerHTML = "OPTIMAL VALUE : <span>" + D[0] + "</span>";
  OPTIMALPOLICY.innerHTML = "OPTIMAL POLICY : <span>" + D[1] + "</span>";
  VBUTTON.style.display = "block";
}

function STARTM() {
  if (view) {
    view.STOP();
  }
  LEVEL = [];
  P = [];

  SETV.style.display = "none";

  var lines = INPUT.value.split("\n");
  var Dist = lines.map((line) => {
    return line.split(",").map(Number);
  });
  var tsp = new TSP(Dist);
  var res = tsp.MAIN();
  NumberNode = res[0];
  UPDATE(res[1]);
}

function STARTV() {
  OUTPUT.innerHTML = "-";
  view = new VIEW();
  view.MAIN(NumberNode);
}

function BUTTON(N) {
  switch (N) {
    case 0:
      view.NEXT();
      break;
    case 1:
      view.BACK();
      break;
    case 2:
      view.SHOW();
      break;
    case 3:
      view.STOP();
      break;
  }
}

function CHANGECOLOR() {
  if (ColorBool) {
    document.documentElement.style.setProperty("--w", "#ffffff");
    document.documentElement.style.setProperty("--a", "#000000");
    document.documentElement.style.setProperty("--b", "#f9f9f9");
    document.documentElement.style.setProperty("--f", "#0b30e0");
    document.documentElement.style.setProperty("--c", "#e9e9e9");
    document.documentElement.style.setProperty("--r", "#ff0000");
    ColorBool = false;
  } else {
    document.documentElement.style.setProperty("--w", "#121212");
    document.documentElement.style.setProperty("--a", "#ffffff");
    document.documentElement.style.setProperty("--b", "#000000");
    document.documentElement.style.setProperty("--f", "#f9a71b");
    document.documentElement.style.setProperty("--c", "#252525");
    document.documentElement.style.setProperty("--r", "#ff0000");
    ColorBool = true;
  }
}

var TESTDATA = [
  [
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0],
  ],
  [
    [0, 10, 15, 20, 25],
    [10, 0, 35, 25, 30],
    [15, 35, 0, 30, 20],
    [20, 25, 30, 0, 15],
    [25, 30, 20, 15, 0],
  ],
];

function SETTEST(NUM) {
  var str = TESTDATA[NUM].map(function (row) {
    return row.join(",");
  }).join("\n");
  INPUT.value = str;
}

SETTEST(1);
Graph([0, 1], [[[0, 1], 0]]);
