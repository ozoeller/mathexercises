"use strict";

// Used in combination with "practicemath.js" to practice additions

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calcResult(calcText) {
    var tokens = calcText.split(" ");
    var num1 = parseInt(tokens[0]);
    var num2 = parseInt(tokens[2]);
    return num1 - num2;
  }
  
  function createNextCalculation() {
    var randNum1 = randomInt(1, 100);
    var randNum2 = randomInt(1, randNum1);
    numSolution = randNum1 - randNum2;
    return randNum1 + " - " + randNum2;
  }
  
  