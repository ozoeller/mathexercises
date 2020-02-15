"use strict";

var numSolution = 0;
var numCountRight = 0;
var numCountFalse = 0;
var startTime = 0;
var startTimeCalc = 0;
var mode = 0; // 0: Random calculations, 1: Repetition of wrong calculations

function setElementVisible(el, boolean) {
  if (boolean) {
    el.style.display = "block";
  } else {
    el.style.display = "none";
  }
}

function toggleElementVisibility(el) {
  setElementVisible(el, !isElementVisible(el));
}

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

function getNextCalcOfWrongList() {
  var ul = document.getElementById("listWrong");

  // Randomly select a new 'li'-element
  var liArr = ul.getElementsByTagName("li");
  var length = liArr.length;

  if (length > 0) {
    var randNodeNum = Math.floor(Math.random() * length);

    // Set selected-class
    liArr[randNodeNum].classList.add("selected");
    var calcText = liArr[randNodeNum].textContent;
    numSolution = calcResult(calcText);
    return calcText;
  } // else: switch back to mode 0 (random calculations)

  mode = 0;
  return createNextCalculation();
}

function removeAllChildNodes(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function removeAllChildNodesById(elementId) {
  removeAllChildNodes(document.getElementById(elementId));
}

function setNewText(node, text) {
  removeAllChildNodes(node);
  node.appendChild(document.createTextNode(text));
}

function setNewTextById(elementId, text) {
  setNewText(document.getElementById(elementId), text);
}

function setFocusToSolution() {
  document.getElementById("solution").focus();
}

function getNextCalculationString() {
  if (mode === 0) {
    return createNextCalculation();
  } else {
    return getNextCalcOfWrongList();
  }
}

function removeLastSelectedListElement(ul) {
  var liArrSelected = ul.getElementsByClassName("selected");

  if (liArrSelected.length > 0) {
    ul.removeChild(liArrSelected[0]);
  }
}

function formatDuration(millis) {
  var sec = parseFloat((millis / 1000).toFixed(2));
  var min = Math.floor(sec / 60);
  sec = sec - min * 60;

  if (min > 0) {
    return min + " Min., " + parseFloat(sec).toLocaleString("de-DE") + " Sek.";
  }

  return parseFloat(sec).toLocaleString("de-DE") + " Sek.";
}

function handleSolutionInput() {
  var durationTotal = 0;
  var durationCalc = 0;

  if (startTime === 0) {
    startTime = new Date();
    startTimeCalc = startTime;
  } else {
    var currentTime = new Date();
    durationTotal = currentTime - startTime;
    durationCalc = currentTime - startTimeCalc;
    var durationPerCalc = durationTotal / (numCountRight + numCountFalse);
    setNewTextById("durationTotal", formatDuration(durationTotal));
    setNewTextById("durationPerCalc", formatDuration(durationPerCalc));
    setNewTextById("durationLastCalc", formatDuration(durationCalc));
    startTimeCalc = currentTime;
  }

  var numSolutionInput = parseInt(document.getElementById("solution").value); // richtig

  if (numSolutionInput === numSolution) { // correct
    // Emojiis: "https://emojipedia.org/"
    setNewTextById("feedbackDiv", "😀");
    setNewTextById("sumRight", ++numCountRight);

    var ul = document.getElementById("listWrong");

    if (mode === 1) {
      // Remove last selected 'li'-element
      removeLastSelectedListElement(ul);

      var liWrongCount = ul.getElementsByTagName("li").length;

      // Disable visibility of wrong-list
      if (liWrongCount === 0) {
        toggleElementVisibility(document.getElementById("wrongContainer"));
      }
    }
  } else { // wrong
    setNewTextById("feedbackDiv", "😖");
    setNewTextById("sumWrong", ++numCountFalse);
    var calcString = document.getElementById("calcString").textContent;

    if (mode === 1) {
      // Remove last selected 'li'-element
      removeLastSelectedListElement(ul);
    }

    var li = document.createElement("li");
    var span = document.createElement("span");

    ul.appendChild(li);

    li.appendChild(span);
    span.appendChild(document.createTextNode(calcString));

    if (mode === 0) {
      var _liWrongCount = document
        .getElementById("listWrong")
        .getElementsByTagName("li").length;

      if (_liWrongCount === 1) {
        setElementVisible(document.getElementById("wrongContainer"), true);
        setElementVisible(document.getElementById("butRecapWrong"), true);
        setNewTextById("butRecapWrong", "Falsche üben");
      }
    }
  }

  document.getElementById("calc").reset();
  setNewTextById("calcString", getNextCalculationString());
  setFocusToSolution();
}

function isElementVisible(el) {
  if (el.style.display === "none") {
    return false;
  }

  return true;
}

function changeToPracticeMode() {
  mode = 1;
  setElementVisible(document.getElementById("butRecapWrong"), false);
  setNewTextById("calcString", getNextCalculationString());
  setFocusToSolution();
}

function onClickSubmit(event) {
  // Prevent submit to remote server
  event.preventDefault();
  handleSolutionInput();
}

function onClickRecapOfWrongCalculations(event) {
  changeToPracticeMode();
}

function onSolutionFieldInputChanged(event) {
  // Insert "thinking face"-emoji while typing. Alternative: "&nbsp;"?
  setNewTextById("feedbackDiv", "🤔");
}

window.onload = function() {
  var smit = document.getElementById("calc");
  smit.addEventListener("submit", onClickSubmit, false);
  var butRecapWrong = document.getElementById("butRecapWrong");
  butRecapWrong.addEventListener(
    "click",
    this.onClickRecapOfWrongCalculations,
    false
  );
  document
    .getElementById("solution")
    .addEventListener("input", onSolutionFieldInputChanged);
  toggleElementVisibility(document.getElementById("wrongContainer"));
  setNewTextById("calcString", createNextCalculation());
  setFocusToSolution();
};
