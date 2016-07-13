/* jshint esnext: true */
/* jshint node: true */

"use strict";

class ValueCell {
  constructor(values) {
    this.values = values;
  }
}

var v = function () {
  return new ValueCell([1, 2, 3, 4, 5, 6, 7, 8, 9]);
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

var assertEquals = function(expected, result) {
  if (expected !== result) {
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

testPermute();
testTranspose();
testTakeWhile();
testConcat();
testDrop();
testTake();
testPartBy();
testPartAll();
testPartN();

