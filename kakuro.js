/* jshint esnext: true */
/* jshint node: true */

"use strict";

const arrEquals = (a1, a2) => JSON.stringify(a1) === JSON.stringify(a2);

const contains = (coll, item) => coll.indexOf(item) > -1;

const pad2 = n => {
  const s = "" + n;
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
    let s1 = new Set(this.values);
    let s2 = new Set(obj.values);
    if (s1.size == s2.size) {
      for (let item of s1) {
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

const drawRow = row => row.map(v => v.draw()).join("") + "\n";

const drawGrid = grid => grid.map(row => drawRow(row)).join("");

const v = function() {
  if (0 === arguments.length) {
    return new ValueCell([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  }
  else {
    return new ValueCell(Array.of.apply([], arguments));
  }
};

const e = () => new EmptyCell();

const da = (down, across) => new DownAcrossCell(down, across);

const d = down => new DownCell(down);

const a = across => new AcrossCell(across);

const flatten = arrays => Array.prototype.concat.apply([], arrays);

const conj = (arr, value) => arr.concat([value]);

const concatLists = (coll1, coll2) => coll1.concat(coll2);

const allDifferent = arr => arr.length === new Set(arr).size;

const permute = (vs, target, soFar) => {
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

const permuteAll = (vs, target) => permute(vs, target, []);

const isPossible = (v, n) => {
  for (let item of v.values) {
    if (n === item) {
      return true;
    }
  }
  return false;
};

const transpose = m => {
  if (0 === m.length) {
    return [];
  }
  else {
    let result = [];
    for (let i = 0; i < m[0].length; ++i) {
      let row = [];
      for (let col of m) {
        row.push(col[i]);
      }
      result.push(row);
    }
    return result;
  }
};

const takeWhile = (f, coll) => {
  let result = [];
  for (let item of coll) {
    if (!f(item)) {
      break;
    }
    result.push(item);
  }
  return result;
};

const drop = (n, coll) => {
  let result = [];
  let count = 1;
  for (let item of coll) {
    if (count > n) {
      result.push(item);
    }
    ++count;
  }
  return result;
};

let take = (n, coll) => {
  let result = [];
  let count = 1;
  for (let item of coll) {
    if (count > n) {
      return result;
    }
    result.push(item);
    ++count;
  }
  return result;
};

let partitionBy = (f, coll) => {
  if (0 === coll.length) {
    return [];
  }
  else {
    let head = coll[0];
    let fx = f(head);
    let group = takeWhile(y => fx === f(y), coll);
    return concatLists([group], partitionBy(f, drop(group.length, coll)));
  }
};

const partitionAll = (n, step, coll) => {
  if (0 === coll.length) {
    return [];
  }
  else {
    return concatLists([take(n, coll)], partitionAll(n, step, drop(step, coll)));
  }
};

const partitionN = (n, coll) => partitionAll(n, n, coll);

const last = coll => coll[coll.length - 1];

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

var solveLine = function(line, f) {
  return flatten(pairTargetsWithValues(line)
    .map(pair => solvePair(f, pair)));
};

var solveRow = function(row) {
  return solveLine(row, x => x.getAcross());
};

var solveColumn = function(column) {
  return solveLine(column, x => x.getDown());
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

