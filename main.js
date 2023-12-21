var OV = document.getElementById("OV");
var OP = document.getElementById("OP");
var INPUT = document.getElementById("INPUT");
var OUTPUT = document.getElementById("OUTPUT");
var SETV = document.getElementById("SETV");
var VBUTTON = document.getElementById("VBUTTON");

var Dist;
var COST = 0;
var TOUR = [1];
var n;
var g = {};
var PL = [];
var p = [];
var LIST = [];
var LEVEL = [];
var CCB = false;

function TSP(k, a) {
  if ([k, a] in g) {
    return g[[k, a]];
  }
  var values = [];
  var SG = [];
  for (var U of a) {
    var LA = [...a];
    LA.splice(LA.indexOf(U), 1);
    SG.push([U, LA]);
    var R = TSP(U, LA);
    var C = Dist[k - 1][U - 1];
    var result = C + R;
    values.push(result);
    p.push([[k, a], [k, U], [[U, LA]], C, R, result]);
  }
  g[[k, a]] = Math.min(...values);
  PL.push([[k, a], SG[values.indexOf(g[[k, a]])]]);
  p.push([0, SG[values.indexOf(g[[k, a]])]]);
  return g[[k, a]];
}
function FCN(matrix) {
  var connectedNodes = [];
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] > 0) {
        connectedNodes.push([[i, j], matrix[i][j]]);
      }
    }
  }
  return connectedNodes;
}
function UPDATE(D) {
  OV.innerHTML = "OPTIMAL VALUE : <span>" + D[0] + "</span>";
  OP.innerHTML = "OPTIMAL POLICY : <span>" + D[1] + "</span>";
}
function main(D) {
  Dist = D;
  n = Dist[0].length;
  Graph(
    Array.from({ length: n }, (v, i) => i + 1),
    FCN(Dist)
  );
  for (var x = 1; x < n; x++) {
    LEVEL.push([[x + 1, 1, Dist[x][0]]]);
    g[[x + 1, []]] = Dist[x][0];
  }
  var Arr = Array.from({ length: n - 1 }, (_, i) => i + 2);
  TSP(1, Arr);

  var S = PL.pop();
  TOUR.push(S[1][0]);
  for (var i = 0; i < n - 2; i++) {
    for (var NS of PL) {
      if (JSON.stringify(S[1]) === JSON.stringify(NS[0])) {
        S = NS;
        TOUR.push(S[1][0]);
        break;
      }
    }
  }
  TOUR.push(1);

  COST = [g["1," + Arr.toString()]];
  UPDATE([COST, TOUR]);
  VBUTTON.style.display = "block";
  return;
}
function startM() {
  stop();
  COST = 0;
  TOUR = [1];
  g = {};
  p = [];
  LIST = [];
  LEVEL = [];
  SETV.style.display = "none";

  var lines = INPUT.value.split("\n");
  var array = lines.map((line) => {
    return line.split(",").map(Number);
  });
  main(array);
}

function U03(Arr) {
  var Bool = true;
  var Temp = [];
  var TArr = "";
  Temp.push(Arr[1][1]);
  while (Bool) {
    TArr += "[2]";
    if (eval("Arr[1]" + TArr + "[1]")) {
      Temp.push(eval("Arr[1]" + TArr + "[1]"));
    } else {
      Bool = false;
    }
  }
  Temp.push([Temp[Temp.length - 1][1], 1]);
  return Temp.reverse();
}
function U02() {
  for (var LE of LIST) {
    LEVEL.push(U03(LE));
  }
  SETV.style.display = "block";
}
function U01(Arr, i) {
  var OPT;
  for (var PI of p) {
    var index = p.indexOf(PI);
    if (PI[0] == 0 && index <= i) {
      OPT = PI;
    }
  }
  for (var o of p) {
    if (o[0] != 0 && JSON.stringify(o[0]) == JSON.stringify(Arr[2][0]) && i != -1) {
      if (OPT && JSON.stringify(OPT[1]) == JSON.stringify(o[2][0])) {
        Arr[2] = o;
        U01(Arr[2], i);
        break;
      } else if (Arr[2][0][1].length == 1) {
        Arr[2] = o;
        U01(Arr[2], i);
        break;
      }
    }
  }
  return Arr;
}
function U00() {
  var Temp = [];
  for (var Arr of p) {
    var index = p.indexOf(Arr);
    if (Arr[0] != 0) {
      p[index] = U01(Arr, index);
      Temp.push(p[index]);
    } else {
      Temp.push(Arr);
    }
  }
  for (var Arr of Temp) {
    if (Arr[0] != 0) {
      LIST.push([0, Arr]);
    } else {
      for (var ArrT of Temp) {
        if (ArrT[0] != 0) {
          if (JSON.stringify(ArrT[2][0]) == JSON.stringify(Arr[1])) {
            LIST.push([1, ArrT]);
            break;
          }
        }
      }
    }
  }
}
var IP = 0;
function startV() {
  OUTPUT.innerHTML = "-";
  if (TOUR.length >= 2) {
    U00();
    U02();
    IP = 0;
    next();
  }
}
function ATT(Arr) {
  var O = "<b>G(" + Arr[0][0] + ",{" + Arr[0][1] + "})=</b> C" + Arr[1][0] + "" + Arr[1][1] + " + ";
  var B = ["= (" + Arr[3] + "+<b>" + Arr[4] + "</b>)= <span>" + Arr[5] + "</span>"];
  var TArr = "";
  var Bool = true;
  while (Bool) {
    TArr += "[2]";
    if (eval("Arr" + TArr)) {
      var A = eval("Arr" + TArr);
      if (A[3]) {
        B.push("= (" + A[3] + "+<b>" + A[4] + "</b>)=" + A[5]);
      }
      if (A[1]) {
        O += "<b>G(" + A[0][0] + ",{" + A[0][1] + "})=</b> C" + A[1][0] + "" + A[1][1] + " + ";
      } else {
        O += "<b>G(" + A[0][0] + ",∅)</b>";
      }
    } else {
      Bool = false;
    }
  }
  return O + B.reverse().join("");
}
function setc(i) {
  Reset();
  var OUT;

  if (LEVEL[i].length <= 1) {
    OUT = "<b>G(" + LEVEL[i][0][0] + ",∅) =</b> C" + LEVEL[i][0][0] + "" + LEVEL[i][0][1] + " = <span>" + LEVEL[i][0][2] + "</span>";
    document.documentElement.style.setProperty("--r", "#ff0000");
  } else {
    if (LIST[i - n + 1][0] == 1) {
      OUT = "<b>OPT MIN => </b> " + ATT(LIST[i - n + 1][1]);
      if (CCB) {
        document.documentElement.style.setProperty("--r", "#16d500");
      } else {
        document.documentElement.style.setProperty("--r", "#0b6d00");
      }
    } else {
      OUT = ATT(LIST[i - n + 1][1]);
      document.documentElement.style.setProperty("--r", "#ff0000");
    }
  }
  for (let j = 0; j < LEVEL[i].length; j++) {
    if (i == LEVEL.length - 1) {
      Marker(LEVEL[i][j]);
    }
    Color(LEVEL[i][j], "var(--r)");
  }
  OUTPUT.innerHTML = "<span>" + i + "</span> : " + OUT;
}
var TimeOUT = [];
function GraphCM(array, t) {
  var IT = 0;
  for (let i = IP; i < array.length; i++) {
    var timerId = setTimeout(function () {
      IP++;
      setc(i);
      if (i === array.length - 1) {
        stop();
        IP--;
      }
    }, IT * t);
    IT++;
    TimeOUT.push(timerId);
  }
}
function stop() {
  if (SB) {
    for (var i = 0; i < TimeOUT.length; i++) {
      clearTimeout(TimeOUT[i]);
    }
    TimeOUT = [];
    SB = false;
  }
}
var SB = false;
function show() {
  if (TOUR <= 1 || SB) {
    return;
  }
  SB = true;

  GraphCM(LEVEL, 100);
}
var BIP = false;
function next() {
  var LL = LEVEL.length - 1;
  if (BIP && IP < LL) {
    IP++;
  }
  setc(IP);
  if (IP < LL) {
    IP++;
  }
  BIP = false;
}
function back() {
  if (IP > 0) {
    IP--;
  }
  if (!BIP && IP > 0 && IP != LEVEL.length - 2) {
    IP--;
  }
  setc(IP);
  BIP = true;
}

var TEST_DATA = [
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
  var str = TEST_DATA[NUM].map(function (row) {
    return row.join(",");
  }).join("\n");
  INPUT.value = str;
}
SETTEST(1);

function CC() {
  if (CCB) {
    document.documentElement.style.setProperty("--w", "#ffffff");
    document.documentElement.style.setProperty("--a", "#000000");
    document.documentElement.style.setProperty("--b", "#f9f9f9");
    document.documentElement.style.setProperty("--f", "#0b30e0");
    document.documentElement.style.setProperty("--c", "#e9e9e9");
    document.documentElement.style.setProperty("--r", "#ff0000");
    CCB = false;
  } else {
    document.documentElement.style.setProperty("--w", "#121212");
    document.documentElement.style.setProperty("--a", "#ffffff");
    document.documentElement.style.setProperty("--b", "#000000");
    document.documentElement.style.setProperty("--f", "#f9a71b");
    document.documentElement.style.setProperty("--c", "#252525");
    document.documentElement.style.setProperty("--r", "#ff0000");
    CCB = true;
  }
}
