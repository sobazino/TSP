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
var M = {};
var PL = [];
var P = [];
var LIST = [];
var LEVEL = [];
var CCB = false;
var TimeOUT = [];
var SB = false;
var BIP = false;
var IP = 0;

var link;
var node;

var div = d3.select("#VIEW"),
  width = div.node().getBoundingClientRect().width,
  height = div.node().getBoundingClientRect().height;
var svg = div
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", "0 0 " + width + " " + height)
  .attr("preserveAspectRatio", "xMidYMid meet");
var force = d3.layout.force().charge(-220).linkDistance(250).size([width, height]);
function Graph(nodes, links) {
  var graph = {
    nodes: nodes.map(function (name) {
      return { name: name.toString() };
    }),
    links: links.map(function (link) {
      return { source: link[0][0], target: link[0][1], title: link[1] };
    }),
  };
  force.nodes(graph.nodes).links(graph.links).start();
  svg.selectAll(".link").remove();
  svg.selectAll(".node").remove();
  link = svg.selectAll(".link").data(graph.links).enter().append("line").attr("class", "link");
  node = svg.selectAll(".node").data(graph.nodes).enter().append("g").attr("class", "node").call(force.drag);
  node.append("circle").attr("r", 20);
  node
    .append("text")
    .attr("dx", 0)
    .attr("dy", ".35em")
    .attr("class", "text")
    .text(function (d) {
      return d.name;
    });
  svg.append("defs").selectAll("marker").data(["end"]).enter().append("marker").attr("id", String).attr("viewBox", "0 1 15 15").attr("refX", 18).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "var(--r)");
  force.on("tick", function () {
    link
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });
    node.attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  });
}
function Marker(node) {
  link.style("stroke", function (d) {
    if (d.source.name == node[0].toString() && d.target.name == node[1].toString()) {
      return d3.select(this).attr("marker-end", "url(#end)");
    } else {
      return d3.select(this).style("stroke");
    }
  });
}
function Color(node, color) {
  link.style("stroke", function (d) {
    if ((d.source.name == node[0].toString() && d.target.name == node[1].toString()) || (d.source.name == node[1].toString() && d.target.name == node[0].toString())) {
      return color;
    } else {
      return d3.select(this).style("stroke");
    }
  });
}
function Reset() {
  link.attr("marker-end", null);
  link.style("stroke", "var(--c)");
}

class TSP {
  G(k, a) {
    if ([k, a] in M) {
      return M[[k, a]];
    }
    var values = [];
    var SG = [];
    for (var U of a) {
      var LA = [...a];
      LA.splice(LA.indexOf(U), 1);
      SG.push([U, LA]);
      var R = this.G(U, LA);
      var C = Dist[k - 1][U - 1];
      var result = C + R;
      values.push(result);
      P.push([[k, a], [k, U], [[U, LA]], C, R, result]);
    }
    M[[k, a]] = Math.min(...values);
    PL.push([[k, a], SG[values.indexOf(M[[k, a]])]]);
    P.push([0, SG[values.indexOf(M[[k, a]])]]);
    return M[[k, a]];
  }
  MATRIX(matrix) {
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
  UPDATE(D) {
    OV.innerHTML = "OPTIMAL VALUE : <span>" + D[0] + "</span>";
    OP.innerHTML = "OPTIMAL POLICY : <span>" + D[1] + "</span>";
  }
  MAIN(D) {
    Dist = D;
    n = Dist[0].length;
    Graph(
      Array.from({ length: n }, (v, i) => i + 1),
      this.MATRIX(Dist)
    );
    for (var x = 1; x < n; x++) {
      LEVEL.push([[x + 1, 1, Dist[x][0]]]);
      M[[x + 1, []]] = Dist[x][0];
    }
    var Arr = Array.from({ length: n - 1 }, (_, i) => i + 2);
    this.G(1, Arr);

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

    COST = [M["1," + Arr.toString()]];
    this.UPDATE([COST, TOUR]);
    VBUTTON.style.display = "block";
    return;
  }
}
class VIEW {
  U03(Arr) {
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
  U02() {
    for (var LE of LIST) {
      LEVEL.push(this.U03(LE));
    }
    SETV.style.display = "block";
  }
  U01(Arr, i) {
    var OPT;
    for (var PI of P) {
      var index = P.indexOf(PI);
      if (PI[0] == 0 && index <= i) {
        OPT = PI;
      }
    }
    for (var o of P) {
      if (o[0] != 0 && JSON.stringify(o[0]) == JSON.stringify(Arr[2][0]) && i != -1) {
        if (OPT && JSON.stringify(OPT[1]) == JSON.stringify(o[2][0])) {
          Arr[2] = o;
          this.U01(Arr[2], i);
          break;
        } else if (Arr[2][0][1].length == 1) {
          Arr[2] = o;
          this.U01(Arr[2], i);
          break;
        }
      }
    }
    return Arr;
  }
  U00() {
    var Temp = [];
    for (var Arr of P) {
      var index = P.indexOf(Arr);
      if (Arr[0] != 0) {
        P[index] = this.U01(Arr, index);
        Temp.push(P[index]);
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
    this.U02();
  }
  ATT(Arr) {
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
  SETG(i) {
    Reset();
    var OUT;

    if (LEVEL[i].length <= 1) {
      OUT = "<b>G(" + LEVEL[i][0][0] + ",∅) =</b> C" + LEVEL[i][0][0] + "" + LEVEL[i][0][1] + " = <span>" + LEVEL[i][0][2] + "</span>";
      document.documentElement.style.setProperty("--r", "#ff0000");
    } else {
      if (LIST[i - n + 1][0] == 1) {
        OUT = "<b>OPT MIN => </b> " + this.ATT(LIST[i - n + 1][1]);
        if (CCB) {
          document.documentElement.style.setProperty("--r", "#16d500");
        } else {
          document.documentElement.style.setProperty("--r", "#0b6d00");
        }
      } else {
        OUT = this.ATT(LIST[i - n + 1][1]);
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
  GraphCM(array, t) {
    var IT = 0;
    var that = this;
    for (let i = IP; i < array.length; i++) {
      var timerId = setTimeout(function () {
        IP++;
        that.SETG(i);
        if (i === array.length - 1) {
          that.STOP();
          IP--;
        }
      }, IT * t);
      IT++;
      TimeOUT.push(timerId);
    }
  }
  STOP() {
    if (SB) {
      for (var i = 0; i < TimeOUT.length; i++) {
        clearTimeout(TimeOUT[i]);
      }
      TimeOUT = [];
      SB = false;
    }
  }
  SHOW() {
    if (TOUR <= 1 || SB) {
      return;
    }
    SB = true;

    this.GraphCM(LEVEL, 100);
  }
  NEXT() {
    var LL = LEVEL.length - 1;
    if (BIP && IP < LL) {
      IP++;
    }
    this.SETG(IP);
    if (IP < LL) {
      IP++;
    }
    BIP = false;
  }
  BACK() {
    if (IP > 0) {
      IP--;
    }
    if (!BIP && IP > 0 && IP != LEVEL.length - 2) {
      IP--;
    }
    this.SETG(IP);
    BIP = true;
  }
}

var tsp = new TSP();
var view = new VIEW();
function STARTM() {
  view.STOP();
  COST = 0;
  TOUR = [1];
  M = {};
  P = [];
  LIST = [];
  LEVEL = [];
  SETV.style.display = "none";

  var lines = INPUT.value.split("\n");
  var array = lines.map((line) => {
    return line.split(",").map(Number);
  });
  tsp.MAIN(array);
}

function STARTV() {
  OUTPUT.innerHTML = "-";
  if (TOUR.length >= 2) {
    view.U00();
    IP = 0;
    view.NEXT();
  }
}

function Button(N) {
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
Graph([0, 1], [[[0, 1], 0]]);
