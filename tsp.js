// Copyright (c) 2023 SobaZino | Mehran Nosrati

var LEVEL = [];
var P = [];

class TSP {
  constructor(Dist) {
    this.Dist = Dist;
    this.N = Dist[0].length;
    this.M = {};
    this.PL = [];
    this.COST = 0;
    this.TOUR = [1];
  }

  G(k, a) {
    if ([k, a] in this.M) {
      return this.M[[k, a]];
    }
    var values = [];
    var SG = [];
    for (var U of a) {
      var LA = [...a];
      LA.splice(LA.indexOf(U), 1);
      SG.push([U, LA]);
      var R = this.G(U, LA);
      var C = this.Dist[k - 1][U - 1];
      var result = C + R;
      values.push(result);
      P.push([[k, a], [k, U], [[U, LA]], C, R, result]);
    }
    this.M[[k, a]] = Math.min(...values);
    this.PL.push([[k, a], SG[values.indexOf(this.M[[k, a]])]]);
    if (a.length > 1) {
      P.push([0, SG[values.indexOf(this.M[[k, a]])]]);
    }
    return this.M[[k, a]];
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

  MAIN() {
    Graph(
      Array.from({ length: this.N }, (v, i) => i + 1),
      this.MATRIX(this.Dist)
    );
    for (var x = 1; x < this.N; x++) {
      LEVEL.push([[x + 1, 1, this.Dist[x][0]]]);
      this.M[[x + 1, []]] = this.Dist[x][0];
    }
    var Arr = Array.from({ length: this.N - 1 }, (_, i) => i + 2);
    this.G(1, Arr);

    var S = this.PL.pop();
    this.TOUR.push(S[1][0]);
    for (var i = 0; i < this.N - 2; i++) {
      for (var NS of this.PL) {
        if (JSON.stringify(S[1]) === JSON.stringify(NS[0])) {
          S = NS;
          this.TOUR.push(S[1][0]);
          break;
        }
      }
    }
    this.TOUR.push(1);

    this.COST = [this.M["1," + Arr.toString()]];
    return [this.N, [this.COST, this.TOUR]];
  }
}
