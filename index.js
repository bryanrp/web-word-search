async function generateButtons() {
    const buttonContainer = document.querySelector(".button-container");
    const data = await fetch('data.json')
        .then((response) => response.json());
    data.forEach(function (weekData, index) {
        const button = document.createElement("button");
        button.textContent = `Week ${index + 1}`;
        button.addEventListener("click", () => redirectToGamePage(index + 1));
        buttonContainer.appendChild(button);
    });
}

function redirectToGamePage(weekId) {
    window.location.href = `/game?week=${weekId}`;
}

generateButtons();