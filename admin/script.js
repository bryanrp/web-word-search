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
        grid: chunkArray(grid, 10), // Assuming 10x10 grid
        answer: answer
    };

    // For demonstration, logging the request body
    console.log(requestBody);

    // You can perform your actual form submission here
});

// Add event listener to the "Add Input" button
const addInputButton = document.getElementById('add-input-btn');
addInputButton.addEventListener('click', function () {
    const inputList = document.querySelector('.input-list');
    const newInputItem = document.createElement('div');
    newInputItem.classList.add('input-item');
    newInputItem.innerHTML = `
        <input type="text" name="answer" placeholder="Text Input">
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