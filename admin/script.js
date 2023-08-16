const gridContainer = document.getElementById('grid-container');

// Generate the 10x10 grid cells
for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
        const input = document.createElement('input');
        input.classList.add('grid-cell');
        input.type = 'text';
        gridContainer.appendChild(input);
    }
}

// Get the grid form element
const gridForm = document.getElementById('grid-form');

// Get the code snippet element
const codeSnippetElement = document.getElementById('code-snippet');

// Add event listener to the form submission
gridForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Collect grid values
    const gridCells = document.querySelectorAll('.grid-cell');
    const grid = Array.from(gridCells).map(cell => cell.value);

    // Collect answer values
    const answerInputs = document.querySelectorAll('[name="answer"]');
    const answer = Array.from(answerInputs).map(input => input.value);

    // Create the request body
    const requestBody = {
        gridLetters: chunkArray(grid, 10), // Assuming 10x10 grid
        answer: answer
    };

    codeSnippetElement.textContent = JSON.stringify(requestBody, null, 4);
});

// Add event listener to the "Generate random letters on empty cells" button
const generateRandomButton = document.getElementById('gen-random-btn');
generateRandomButton.addEventListener('click', function (event) {
    event.preventDefault();
    const gridCells = document.querySelectorAll('.grid-cell');
    gridCells.forEach(function (cell) {
        if (cell.value === "")
            cell.value = getRandomUppercaseLetter();
    })
})

// Add event listener to the "Clear all cells" button
const clearButton = document.getElementById('clear-btn');
clearButton.addEventListener('click', function (event) {
    event.preventDefault();
    const gridCells = document.querySelectorAll('.grid-cell');
    gridCells.forEach(function (cell) {
        cell.value = "";
    })
})

// Add event listener to the "Add Input" button
const addInputButton = document.getElementById('add-input-btn');
addInputButton.addEventListener('click', function () {
    const inputList = document.querySelector('.input-list');
    const newInputItem = document.createElement('div');
    newInputItem.classList.add('input-item');
    newInputItem.innerHTML = `
        <input type="text" name="answer" placeholder="Answer">
        <span class="remove-input-btn">- Remove</span>
      `;
    inputList.appendChild(newInputItem);
});

// Add event listener to dynamically added "Remove" buttons
document.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('remove-input-btn')) {
        const inputItem = event.target.closest('.input-item');
        inputItem.remove();
    }
});

// Helper function to chunk an array into subarrays
function chunkArray(array, chunkSize) {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunkedArray.push(array.slice(i, i + chunkSize));
    }
    return chunkedArray;
}

// Helper function to get random uppercase letter
function getRandomUppercaseLetter() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet.charAt(randomIndex);
}