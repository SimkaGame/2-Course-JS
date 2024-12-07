const colorBox = document.getElementById('colorBox');
const changeColorButton = document.getElementById('changeColorButton');

changeColorButton.addEventListener('click', () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    colorBox.style.backgroundColor = randomColor;
});