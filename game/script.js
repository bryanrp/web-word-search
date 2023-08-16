// Get the query parameters from the current URL
const urlSearchParams = new URLSearchParams(window.location.search);
// Get the value of the 'week' query parameter
const weekId = urlSearchParams.get('week');

// Get the game data
let answers, gridLetters;
fetch('data.json').then((response) => response.json()).then((data) => {
    answers = data[weekId - 1].answers;
    gridLetters = data[weekId - 1].gridLetters;
    createWordSearch();
    displayPossibleAnswers();

    grid.addEventListener("mousedown", startDragMouse);
    grid.addEventListener("mousemove", handleDragMouse);
    grid.addEventListener("mouseup", endDragMouse);
    grid.addEventListener("touchstart", startDragTouch, { passive: false }); // Add touchstart listener
    grid.addEventListener("touchmove", handleDragTouch, { passive: false }); // Add touchmove listener
    grid.addEventListener("touchend", endDragTouch, { passive: false }); // Add touchend listener
})

const grid = document.querySelector(".word-search");

function createWordSearch() {
    gridLetters.forEach(row => {
        const rowContainer = document.createElement("div");
        rowContainer.classList.add("row");
        row.forEach(letter => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = letter;
            rowContainer.appendChild(cell);
        });
        grid.appendChild(rowContainer);
    });
}

function displayPossibleAnswers() {
    const possibleAnswersList = document.querySelector(".possible-answers");

    // Clear the existing list
    possibleAnswersList.innerHTML = "";

    // Populate the list with possible answers
    answers.forEach(answer => {
        const listItem = document.createElement("li");
        listItem.textContent = answer;
        possibleAnswersList.appendChild(listItem);
    });
}

let isDragging = false;
let selectedCells = [];

let startCell = null; // Track the cell where dragging started
let hoverCell = null; // Track the cell currently being hovered over
let endCell = null; // Track the cell where dragging ended

let startRow = null; // Track the row where dragging started
let startCol = null; // Track the column where dragging started
let hoverRow = null; // Track the row currently being hovered over
let hoverCol = null; // Track the column currently being hovered over
let endRow = null; // Track the row where dragging ended
let endCol = null; // Track the column where dragging ended

function startDragMouse(event) {
    startDrag(event.target);
}

function startDragTouch(event) {
    startDrag(event.targetTouches[0].target);
}

function startDrag(cell) {
    if (startCell) {
        startCell.classList.remove("start");
        clearSelectedCells();
    }
    isDragging = true;
    startCell = cell;
    if (startCell.classList.contains("cell")) {
        startCell.classList.add("start");
        startRow = Array.from(startCell.parentElement.children).indexOf(startCell);
        startCol = Array.from(startCell.parentElement.parentElement.children).indexOf(startCell.parentElement);
    }
    console.log('Start row: ', startRow);
    console.log('Start column: ', startCol);
}

function handleDragMouse(event) {
    handleDrag(event.target);
}

function handleDragTouch(event) {
    event.preventDefault();
    handleDrag(document.elementFromPoint(event.targetTouches[0].clientX, event.targetTouches[0].clientY));
}

function handleDrag(cell) {
    if (!isDragging) return;
    hoverCell = cell;
    if (hoverCell.classList.contains("cell")) {
        hoverRow = Array.from(hoverCell.parentElement.children).indexOf(hoverCell);
        hoverCol = Array.from(hoverCell.parentElement.parentElement.children).indexOf(hoverCell.parentElement);

        clearSelectedCells();
        drawSelected(getCellsInLine(startRow, startCol, hoverRow, hoverCol));
    }
}

function endDragMouse() {
    endDrag();
}

function endDragTouch() {
    endDrag();
}

function endDrag() {
    isDragging = false;
    endCell = hoverCell || startCell;
    endRow = hoverRow || startRow;
    endCol = hoverCol || startCol;

    if (startCell) {
        startCell.classList.remove("start");
        clearSelectedCells();

        let word = "";
        let cells = getCellsInLine(startRow, startCol, endRow, endCol);
        for (let cell of cells) {
            word = word + cell.textContent;
        }
        if (isAnswer(word)) {
            crossAnswer(word);
            drawAnswer(cells);
            if (isAllCrossed()) {
                const gameOver = document.querySelector(".game-over");
                gameOver.textContent = "Game Over";
            }
        }
    }

    startCell = null;
    hoverCell = null;
    startRow = null;
    startCol = null;
    hoverRow = null;
    hoverCol = null;

    console.log('End row', endRow);
    console.log('End col', endCol);
}

function getCellByPosition(row, col) {
    const cols = Array.from(grid.children); // Get all rows
    if (col < 0 || col >= cols.length) {
        return null; // Invalid row index
    }

    const cellsInCol = Array.from(cols[col].children); // Get cells in the specified row
    if (row < 0 || row >= cellsInCol.length) {
        return null; // Invalid column index
    }

    return cellsInCol[row]; // Return the cell element
}

function isALine(row1, col1, row2, col2) {
    if (row1 === null || row2 === null || col1 === null || col2 === null) return false; // Invalid cell index
    if (row1 === row2) return true;
    if (col1 === col2) return true;
    let drow = Math.abs(row1 - row2);
    let dcol = Math.abs(col1 - col2);
    return drow === dcol;
}

function getCellsInLine(row1, col1, row2, col2) {
    if (!isALine(row1, col1, row2, col2)) return [];
    let cells = [];
    if (row1 === row2) {
        if (col1 > col2) {
            [col1, col2] = [col2, col1];
            [row1, row2] = [row2, row1];
        }
        for (let col = col1; col <= col2; col++) {
            let cell = getCellByPosition(row1, col);
            cells.push(cell);
        }
    }
    else if (col1 === col2) {
        if (row1 > row2) {
            [row1, row2] = [row2, row1];
            [col1, col2] = [col2, col1];
        }
        for (let row = row1; row <= row2; row++) {
            let cell = getCellByPosition(row, col1);
            cells.push(cell);
        }
    }
    else {
        if (row1 > row2) {
            [row1, row2] = [row2, row1];
            [col1, col2] = [col2, col1];
        }
        let pMultiplier = 1;
        if (col1 > col2) pMultiplier = -1;
        for (let p = 0; row1 + p <= row2; p++) {
            let cell = getCellByPosition(row1 + p, col1 + p * pMultiplier);
            cells.push(cell);
        }
    }
    return cells;
}

function drawAnswer(cells) {
    for (let cell of cells) {
        cell.classList.add("found");
    }
}

function drawSelected(cells) {
    for (let cell of cells) {
        cell.classList.add("selected");
    }
}

function clearSelectedCells() {
    const selectedCells = document.querySelectorAll(".cell.selected");
    selectedCells.forEach(cell => {
        cell.classList.remove("selected");
    });
}

function isAnswer(word) {
    let reversedWord = word.split("").reverse().join("");
    for (const answer of answers) {
        if (word.toUpperCase() === answer.toUpperCase() ||
            reversedWord.toUpperCase() === answer.toUpperCase()) {
            return true;
        }
    }
    return false;
}

// Select the <ul> element by its class name
const ulElement = document.querySelector('.possible-answers');


function crossAnswer(word) {
    // Select all <li> elements within the <ul> using querySelectorAll
    const liElements = ulElement.querySelectorAll('li');
    let reversedWord = word.split("").reverse().join("");
    liElements.forEach(li => {
        let answer = li.textContent;
        if (word.toUpperCase() === answer.toUpperCase() ||
            reversedWord.toUpperCase() === answer.toUpperCase()) {
            li.classList.add("crossed");
        }
    });
}

function isAllCrossed() {
    // Select all <li> elements within the <ul> using querySelectorAll
    const liElements = ulElement.querySelectorAll('li');
    let allCrossed = true;
    liElements.forEach(li => {
        if (!li.classList.contains("crossed")) {
            allCrossed = false;
        }
    });
    return allCrossed;
}