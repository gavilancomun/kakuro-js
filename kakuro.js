/* jshint esnext: true */
/* jshint node: true */

"use strict";

var arrEquals = function(a1, a2) {
  return JSON.stringify(a1) === JSON.stringify(a2);
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
}

class ValueCell {
  constructor(values) {
    this.values = values;
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
    return arrEquals(this.values, obj.values);
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
}

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
}

var v = function () {
  return new ValueCell([1, 2, 3, 4, 5, 6, 7, 8, 9]);
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
    .map(coll => v(coll));
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
  if (0 === pair[1].length) {
    return notValueCells;
  }
  else {
    var valueCells = pair[1];
    var newValueCells = solveStep(valueCells, f(last(notValueCells)));
    return concatLists(notValueCells, newValueCells);
  }
};

var assertEquals = function(expected, result) {
  if (expected !== result) {
    console.log("ERROR: expected " + expected + " got " + result);
  }
};

var assertCellEquals = function(expected, result) {
  if (!expected.equals(result)) {
    console.log("ERROR: expected " + expected + " got " + result);
  }
};

function testPermute() {
  var vs = [v(), v(), v()];
  var results = permuteAll(vs, 6);
  console.log(results);
  assertEquals(10, results.length);
  var diff = results.filter(p => allDifferent(p));
  assertEquals(6, diff.length);
}

function testTranspose() {
  var ints = [[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]];
  var tr = transpose(ints);
  console.log(ints);
  console.log(tr);
  assertEquals(ints.length, tr[0].length);
  assertEquals(ints[0].length, tr.length);
}

function testTakeWhile() {
  var result = takeWhile(n => n < 4, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  console.log(result);
  assertEquals(4, result.length);
}

function testConcat() {
  var a = [1, 2, 3];
  var b = [4, 5, 6, 1, 2, 3];
  var result = concatLists(a, b);
  console.log(result);
  assertEquals(9, result.length);
}

function testDrop() {
  var a = [1, 2, 3, 4, 5, 6];
  var result = drop(4, a);
  console.log(result);
  assertEquals(2, result.length);
}

function testTake() {
  var a = [1, 2, 3, 4, 5, 6];
  var result = take(4, a);
  console.log(result);
  assertEquals(4, result.length);
}

function testPartBy() {
  var data = [1, 2, 2, 2, 3, 4, 5, 5, 6, 7, 7, 8, 9];
  var result = partitionBy(n => 0 === (n % 2), data);
  console.log(result);
  assertEquals(9, result.length);
}

function testPartAll() {
  var data = [1, 2, 2, 2, 3, 4, 5, 5, 6, 7, 7, 8, 9];
  var result = partitionAll(5, 3, data);
  console.log(result);
  assertEquals(5, result.length);
}

function testPartN() {
  var data = [1, 2, 2, 2, 3, 4, 5, 5, 6, 7, 7, 8, 9];
  var result = partitionN(5, data);
  console.log(result);
  assertEquals(3, result.length);
}

function testSolveStep() {
  var result = solveStep([v(1, 2), v()], 5);
  console.log("solve step " + result);
  assertCellEquals(v(1, 2), result[0]);
  assertCellEquals(v(3, 4), result[1]);
}

function testGatherValues() {
  var line = [da(3, 4), v(), v(), d(4), e(), a(4), v(), v()];
  var result = gatherValues(line);
  console.log("gather " + result);
  assertEquals(4, result.length);
  assertCellEquals(da(3, 4), result[0][0]);
  assertCellEquals(d(4), result[2][0]);
  assertCellEquals(e(), result[2][1]);
  assertCellEquals(a(4), result[2][2]);
}

function testPairTargets() {
  var line = [da(3, 4), v(), v(), d(4), e(), a(4), v(), v()];
  var result = pairTargetsWithValues(line);
  console.log("pair " + result);
  assertEquals(2, result.length);
  assertCellEquals(da(3, 4), result[0][0][0]);
  assertCellEquals(d(4), result[1][0][0]);
  assertCellEquals(e(), result[1][0][1]);
  assertCellEquals(a(4), result[1][0][2]);
}

function testSolvePair() {
  var line = [da(3, 4), v(), v(), d(4), e(), a(4), v(), v()];
  var pairs = pairTargetsWithValues(line);
  var pair = pairs[0];
  var result = solvePair(cell => cell.getDown(), pair);
  console.log("solvePair " + result);
  assertEquals(3, result.length);
  assertCellEquals(v(1, 2), result[1]);
  assertCellEquals(v(1, 2), result[2]);
}

testPermute();
testTranspose();
testTakeWhile();
testConcat();
testDrop();
testTake();
testPartBy();
testPartAll();
testPartN();
testSolveStep();
testGatherValues();
testPairTargets();
testSolvePair();

