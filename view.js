// Copyright (c) 2023 SobaZino | Mehran Nosrati

var IP = 0;

class VIEW {
  constructor() {
    this.LIST = [];
    this.N = 0;
    IP = 0;
    this.IPBOOL = false;
    this.STARTBOOL = false;
    this.TIMEOUT = [];
  }

  INARR(Arr) {
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

  PUSHLEVEL() {
    for (var LE of this.LIST) {
      LEVEL.push(this.INARR(LE));
    }
    SETV.style.display = "block";
  }

  FINDSET(Arr, i) {
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
          this.FINDSET(Arr[2], i);
          break;
        } else if (Arr[2][0][1].length == 1) {
          Arr[2] = o;
          this.FINDSET(Arr[2], i);
          break;
        }
      }
    }
    return Arr;
  }

  MAIN(N) {
    this.N = N;
    var Temp = [];
    for (var Arr of P) {
      var index = P.indexOf(Arr);
      if (Arr[0] != 0) {
        P[index] = this.FINDSET(Arr, index);
        Temp.push(P[index]);
      } else {
        Temp.push(Arr);
      }
    }
    for (var Arr of Temp) {
      if (Arr[0] != 0) {
        this.LIST.push([0, Arr]);
      } else {
        for (var ArrT of Temp) {
          if (ArrT[0] != 0) {
            if (JSON.stringify(ArrT[2][0]) == JSON.stringify(Arr[1])) {
              this.LIST.push([1, ArrT]);
              break;
            }
          }
        }
      }
    }
    this.PUSHLEVEL();
    IP = 0;
    this.NEXT();
  }

  SHOWLEVELTEXT(Arr) {
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

  SETLEVELGRAPH(i) {
    Reset();
    var OUT;

    if (LEVEL[i].length <= 1) {
      OUT = "<b>G(" + LEVEL[i][0][0] + ",∅) =</b> C" + LEVEL[i][0][0] + "" + LEVEL[i][0][1] + " = <span>" + LEVEL[i][0][2] + "</span>";
      document.documentElement.style.setProperty("--r", "#ff0000");
    } else {
      if (this.LIST[i - this.N + 1][0] == 1) {
        OUT = "<b>OPT MIN => </b> " + this.SHOWLEVELTEXT(this.LIST[i - this.N + 1][1]);
        if (ColorBool) {
          document.documentElement.style.setProperty("--r", "#16d500");
        } else {
          document.documentElement.style.setProperty("--r", "#0b6d00");
        }
      } else {
        OUT = this.SHOWLEVELTEXT(this.LIST[i - this.N + 1][1]);
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

  SHOWLEVELGRAPH(array, t) {
    var IT = 0;
    var that = this;
    for (let i = IP; i < array.length; i++) {
      var timerId = setTimeout(function () {
        IP++;
        that.SETLEVELGRAPH(i);
        if (i === array.length - 1) {
          that.STOP();
          IP--;
        }
      }, IT * t);
      IT++;
      this.TIMEOUT.push(timerId);
    }
  }

  STOP() {
    if (this.STARTBOOL) {
      for (var i = 0; i < this.TIMEOUT.length; i++) {
        clearTimeout(this.TIMEOUT[i]);
      }
      this.TIMEOUT = [];
      this.STARTBOOL = false;
    }
  }

  SHOW() {
    if (this.STARTBOOL) {
      return;
    }
    this.STARTBOOL = true;

    this.SHOWLEVELGRAPH(LEVEL, 100);
  }

  NEXT() {
    var LL = LEVEL.length - 1;
    if (this.IPBOOL && IP < LL) {
      IP++;
    }
    this.SETLEVELGRAPH(IP);
    if (IP < LL) {
      IP++;
    }
    this.IPBOOL = false;
  }

  BACK() {
    if (IP > 0) {
      IP--;
    }
    if (!this.IPBOOL && IP > 0 && IP != LEVEL.length - 2) {
      IP--;
    }
    this.SETLEVELGRAPH(IP);
    this.IPBOOL = true;
  }
}
