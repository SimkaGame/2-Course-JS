import { setupColorChanger } from '../Web/Web';

describe('ColorChanger', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="colorBox" style="width: 100px; height: 100px; background-color: #3498db; margin: 20px;"></div>
            <button id="changeColorButton">Тык</button>
        `;
        setupColorChanger();
    });

    test('changes the background color of colorBox on button click', () => {
        const colorBox = document.getElementById('colorBox');
        const changeColorButton = document.getElementById('changeColorButton');

        expect(colorBox).not.toBeNull();
        expect(changeColorButton).not.toBeNull();

        const initialColor = getComputedStyle(colorBox).backgroundColor; //Получение цвета

        changeColorButton.click(); // Симуляция нажатия кнопки

        const newColor = getComputedStyle(colorBox).backgroundColor;

        // Проверка на изменения цвета
        expect(newColor).not.toBe(initialColor);
    });
});
