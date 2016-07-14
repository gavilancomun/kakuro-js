/* jshint esnext: true */
/* jshint node: true */

"use strict";

var arrEquals = function(a1, a2) {
  return JSON.stringify(a1) === JSON.stringify(a2);
};

var contains = function(coll, item) {
  return coll.indexOf(item) > -1;
};

var pad2 = function(n) {
  var s = "" + n;
  return (s.length < 2) ?  " " + s:  s;
};

class EmptyCell {
  toString() {
    return "EmptyCell";
  }

  equals(obj) {
    if (this === obj) {
      return true;
    }
    if (obj === null) {
      return false;
    }
    return true;
  }

  draw() {
    return "   -----  ";
  }
}

class ValueCell {
  constructor(values) {
    this.values = Array.of(...new Set(values));
  }

  toString() {
    return "ValueCell[" + this.values.join(", ") + "]";
  }

  equals(obj) {
    if (this === obj) {
      return true;
    }
    if (obj === null) {
      return false;
    }
    if (undefined === obj.values) {
      return false;
    }
    var s1 = new Set(this.values);
    var s2 = new Set(obj.values);
    if (s1.size == s2.size) {
      for (var item of s1) {
        if (!s2.has(item)) {
          return false;
        }
      }
      return true;
    }
    else {
      return false;
    }
  }

  draw() {
    if (1 == this.values.length) {
      return "     " + this.values[0] + "    ";
    }
    else {
      return " " + [1, 2, 3, 4, 5, 6, 7, 8, 9]
        .map(n => contains(this.values, n) ? "" + n : ".")
        .join("");
    }
  }
}

class DownAcrossCell {
  constructor(down, across) {
    this.down = down;
    this.across = across;
  }

  getDown() {
    return this.down;
  }

  getAcross() {
    return this.across;
  }

  toString() {
    return "DownAcrossCell[" + this.down + ", " + this.across + "]";
  }

  equals(obj) {
    if (this === obj) {
      return true;
    }
    if (obj === null) {
      return false;
    }
    if (undefined === obj.down) {
      return false;
    }
    return (this.down === obj.down) && (this.across === obj.across);
  }

  draw() {
    return "   " + pad2(this.down) + "\\" + pad2(this.across) + "  ";
  }}

class DownCell {
  constructor(down) {
    this.down = down;
  }

  getDown() {
    return this.down;
  }

  toString() {
    return "DownCell[" + this.down + "]";
  }

  equals(obj) {
    if (this === obj) {
      return true;
    }
    if (obj === null) {
      return false;
    }
    if (undefined === obj.down) {
      return false;
    }
    return (this.down === obj.down);
  }

  draw() {
    return "   " +  pad2(this.down) + "\\--  ";
  }
}

class AcrossCell {
  constructor(across) {
    this.across = across;
  }

  getAcross() {
    return this.across;
  }

  toString() {
    return "AcrossCell[" + this.across + "]";
  }

  equals(obj) {
    if (this === obj) {
      return true;
    }
    if ((obj === undefined) || (obj === null)) {
      return false;
    }
    if (undefined === obj.across) {
      return false;
    }
    return (this.across === obj.across);
  }

  draw() {
    return "   --\\" +  pad2(this.across) + "  ";
  }
}

var drawRow = function(row) {
  return row
    .map(v => v.draw())
    .join("") + "\n";
};

var drawGrid = function(grid) {
  return grid
    .map(row => drawRow(row))
    .join("");
};

var v = function() {
  if (0 === arguments.length) {
    return new ValueCell([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  }
  else {
    return new ValueCell(Array.of.apply([], arguments));
  }
};

var e = function () {
  return new EmptyCell();
};

var da = function(down, across) {
  return new DownAcrossCell(down, across);
};

var d = function(down) {
  return new DownCell(down);
};

var a = function(across) {
  return new AcrossCell(across);
};

var flatten = function(arrays) {
  return Array.prototype.concat.apply([], arrays);
};

var conj = function(arr, value) {
  return arr.concat([value]);
};

var concatLists = function(coll1, coll2) {
  return coll1.concat(coll2);
};

var allDifferent = function(arr) {
  return arr.length === new Set(arr).size;
};

var permute = function(vs, target, soFar) {
  if (target >= 1) {
    if (soFar.length == (vs.length - 1)) {
      return [conj(soFar, target)];
    }
    else {
      let arrays = vs[soFar.length].values.map(n => permute(vs, (target - n), conj(soFar, n)));
      return flatten(arrays);
    }
  }
  else {
    return [];
  }
};

var permuteAll = function(vs, target) {
  return permute(vs, target, []);
};

var isPossible = function(v, n) {
  for (var item of v.values) {
    if (n === item) {
      return true;
    }
  }
  return false;
};

var transpose = function(m) {
  if (0 === m.length) {
    return [];
  }
  else {
    var result = [];
    for (var i = 0; i < m[0].length; ++i) {
      let row = [];
      for (var col of m) {
        row.push(col[i]);
      }
      result.push(row);
    }
    return result;
  }
};

var takeWhile = function(f, coll) {
  var result = [];
  for (var item of coll) {
    if (!f(item)) {
      break;
    }
    result.push(item);
  }
  return result;
};

var drop = function(n, coll) {
  var result = [];
  var count = 1;
  for (var item of coll) {
    if (count > n) {
      result.push(item);
    }
    ++count;
  }
  return result;
};

var take = function(n, coll) {
  var result = [];
  var count = 1;
  for (var item of coll) {
    if (count > n) {
      return result;
    }
    result.push(item);
    ++count;
  }
  return result;
};

var partitionBy = function(f, coll) {
  if (0 === coll.length) {
    return [];
  }
  else {
    var head = coll[0];
    var fx = f(head);
    var group = takeWhile(y => fx === f(y), coll);
    return concatLists([group], partitionBy(f, drop(group.length, coll)));
  }
};

var partitionAll = function(n, step, coll) {
  if (0 === coll.length) {
    return [];
  }
  else {
    return concatLists([take(n, coll)], partitionAll(n, step, drop(step, coll)));
  }
};

var partitionN = function(n, coll) {
  return partitionAll(n, n, coll);
};

var last = function(coll) {
  return coll[coll.length - 1];
};

var solveStep = function(cells, total) {
  var finalIndex = cells.length - 1;
  var perms = permuteAll(cells, total)
    .filter(v => isPossible(last(cells), v[finalIndex]))
    .filter(v => allDifferent(v));
  return transpose(perms)
    .map(coll => v.apply(null, coll));
};

// returns (non-vals, vals)*
var gatherValues = function(line) {
  return partitionBy(v => v instanceof ValueCell, line);
};

var pairTargetsWithValues = function(line) {
  return partitionN(2, gatherValues(line));
};

var solvePair = function(f, pair) {
  var notValueCells = pair[0];
  if ((undefined === pair[1]) || (0 === pair[1].length)) {
    return notValueCells;
  }
  else {
    var valueCells = pair[1];
    var newValueCells = solveStep(valueCells, f(last(notValueCells)));
    return concatLists(notValueCells, newValueCells);
  }
};

var solveLine = function(line, pairSolver) {
  return flatten(pairTargetsWithValues(line)
    .map(pair => pairSolver(pair)));
};

var solveRow = function(row) {
  return solveLine(row, v => solvePair(x => x.getAcross(), v));
};

var solveColumn = function(column) {
  return solveLine(column, v => solvePair(x => x.getDown(), v));
};

var solveGrid = function(grid) {
  var rowsDone = grid.map(r => solveRow(r));
  var colsDone = transpose(rowsDone)
    .map(col => solveColumn(col));
  return transpose(colsDone);
};

var gridEquals = function(g1, g2) {
  if (g1.length == g2.length) {
    for (var i = 0; i < g1.length; ++i) {
      for (var j = 0; j < g1[i].length; ++j) {
        if (!g1[i][j].equals(g2[i][j])) {
          return false;
        }
      }
    }
    return true;
  }
  else {
    return false;
  }
};

var solver = function(grid) {
  console.log(drawGrid(grid));
  var g = solveGrid(grid);
  if (gridEquals(g, grid)) {
    return g;
  }
  else {
    return solver(g);
  }
};

