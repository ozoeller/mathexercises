"use strict";

// Used in combination with "practicemath.js" to practice additions

function calcResult(calcText) {
    var tokens = calcText.split(" ");
    var num1 = parseInt(tokens[0]);
    var num2 = parseInt(tokens[2]);
    return num1 + num2;
  }
  
  function createNextCalculation() {
    var randNum1 = Math.floor(Math.random() * 100) + 1;
    var randNum2 = Math.floor(Math.random() * randNum1) + 1;
    numSolution = randNum1;
    return randNum2 + " + " + (randNum1 - randNum2);
  }
  
  