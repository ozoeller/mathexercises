"use strict";

// Used in combination with "practicemath.js" to practice multiplications

function calcResult(calcText) {
    var tokens = calcText.split(" ");
    var num1 = parseInt(tokens[0]);
    var num2 = parseInt(tokens[2]);
    return num1 * num2;
  }
  
  function createNextCalculation() {
    var randNum1 = Math.floor(Math.random() * 10) + 1;
    var randNum2 = Math.floor(Math.random() * 10) + 1;
    numSolution = randNum1 * randNum2;
    return randNum1 + " × " + randNum2;
  }
  
  