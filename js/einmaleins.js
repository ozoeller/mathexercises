"use strict";

let numSolution = 0;
let numCountRight = 0;
let numCountFalse = 0;
let startTime = 0;
let startTimeCalc = 0;
let mode = 0; // 0: normale Zufallsberechnung, 1: Wiederholung von falschen Berechnungen

function setElementVisible(el, boolean) {
    if (boolean) {
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
    }
}

function toggleElementVisibility(el) {
    setElementVisible(el, !isElementVisible(el));
}

function getResult(calcText) {
    const tokens = calcText.split(" ");
    const num1 = parseInt(tokens[0]);
    const num2 = parseInt(tokens[2]);
    return num1 * num2;
}

function createMultiplyString() {
    const randNum1 = Math.floor(Math.random() * 10) + 1;
    const randNum2 = Math.floor(Math.random() * 10) + 1;
    numSolution = randNum1 * randNum2;

    return randNum1 + " × " + randNum2;
}

function getNextCalcOfWrongList() {
    const ul = document.getElementById("listWrong");

    // Randomly select a new 'li'-element
    const liArr = ul.getElementsByTagName("li");
    const length = liArr.length;
    if (length > 0) {
        const randNodeNum = Math.floor(Math.random() * length);

        // Set selected-class
        liArr[randNodeNum].classList.add("selected");

        const calcText = liArr[randNodeNum].textContent;
        numSolution = getResult(calcText);
        return calcText;
    }
    // else: switch back to mode 0 (random calculations)
    mode = 0;
    return createMultiplyString();
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
        return createMultiplyString();
    } else {
        return getNextCalcOfWrongList();
    }
}

function removeLastSelectedListElement(ul) {
    const liArrSelected = ul.getElementsByClassName("selected");
    if (liArrSelected.length > 0) {
        ul.removeChild(liArrSelected[0]);
    }
}

function formatDuration(millis) {
    let sec = parseFloat((millis / 1000).toFixed(2));
    const min = Math.floor(sec / 60);
    sec = sec - (min * 60);

    if(min > 0) {
        return min + " Min., " + parseFloat(sec).toLocaleString("de-DE") + " Sek.";
    }
    return parseFloat(sec).toLocaleString("de-DE") + " Sek.";
}

function handleSolutionInput() {
    let durationTotal = 0;
    let durationCalc = 0;
    if(startTime === 0) {
        startTime = new Date();
        startTimeCalc = startTime;
    } else {
        const currentTime = new Date();
        durationTotal = currentTime - startTime;
        durationCalc = currentTime - startTimeCalc;
        const durationPerCalc = durationTotal /(numCountRight + numCountFalse);
        setNewTextById("durationTotal", formatDuration(durationTotal));
        setNewTextById("durationPerCalc", formatDuration(durationPerCalc));
        setNewTextById("durationLastCalc", formatDuration(durationCalc));
        startTimeCalc = currentTime;
    }
    const numSolutionInput = parseInt(document.getElementById("solution").value);
    // richtig
    if (numSolutionInput === numSolution) {
        // Emojiis siehe "https://emojipedia.org/"
        setNewTextById("feedbackDiv", "😀");
        setNewTextById("sumRight", ++numCountRight);
        if(mode === 1) {
            const ul = document.getElementById("listWrong");

            // Remove last selected 'li'-element
            removeLastSelectedListElement(ul);
        
            const liWrongCount = ul.getElementsByTagName("li").length;
            // Disable visibility of wrong-list
            if (liWrongCount === 0) {
                toggleElementVisibility(document.getElementById("wrongContainer"));
            }
        }

    } else { // falsch
        setNewTextById("feedbackDiv", "😖");
        setNewTextById("sumWrong", ++numCountFalse);
        const calcString = document.getElementById("calcString").textContent;
        const ul = document.getElementById("listWrong");

        if (mode === 1) {
            // Remove last selected 'li'-element
            removeLastSelectedListElement(ul);
        }
        
        const li = document.createElement("li");
        const span = document.createElement("span");
        ul.appendChild(li);
        li.appendChild(span);
        span.appendChild(document.createTextNode(calcString));

        if(mode === 0){
            const liWrongCount = document.getElementById("listWrong").getElementsByTagName("li").length;
            if (liWrongCount === 1) {
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
    if (el.style.display === 'none') {
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
    // verhindert das Absenden
    event.preventDefault();

    handleSolutionInput();
}

function onClickRecapOfWrongCalculations(event) {
    changeToPracticeMode();
}

function onSolutionFieldInputChanged(event) {
    // Feedback-Angabe löschen, wenn der Benutzer beginnt, etwas einzugeben
    // Dazu wird ein Unicode-Non-Breaking-Space eingefügt (&nbsp;)
    setNewTextById("feedbackDiv", "\u{00A0}");
}

window.onload = function () {
    const smit = document.getElementById("calc");
    smit.addEventListener("submit", onClickSubmit, false);

    const butRecapWrong = document.getElementById("butRecapWrong");
    butRecapWrong.addEventListener("click", this.onClickRecapOfWrongCalculations, false);

    document.getElementById("solution").addEventListener("input", onSolutionFieldInputChanged);

    toggleElementVisibility(document.getElementById("wrongContainer"));

    setNewTextById("calcString", createMultiplyString());
    setFocusToSolution();
};

