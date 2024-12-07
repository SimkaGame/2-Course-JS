export function setupColorChanger() {
    const colorBox = document.getElementById('colorBox');
    const changeColorButton = document.getElementById('changeColorButton');

    // Проверка на DOM
    if (!colorBox || !changeColorButton) {
        console.error('Elements not found in the DOM');
        return;
    }

    changeColorButton.addEventListener('click', () => {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        colorBox.style.backgroundColor = randomColor;
    });
}


// Автоматический вызов после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    setupColorChanger();
});
