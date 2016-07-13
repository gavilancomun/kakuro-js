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

var assertEquals = function(expected, result) {
  if (expected !== result) {
    console.log("ERROR: expected " + expected + " got " + result);
  }
};

console.log(v());

function testPermute() {
  var vs = [v(), v(), v()];
  var results = permuteAll(vs, 6);
  console.log(results);
  assertEquals(10, results.length);
  var diff = results.filter(p => allDifferent(p));
  assertEquals(6, diff.length);
}

testPermute();

