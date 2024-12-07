let myBar;
let studentData;

function preload() {
    studentData = loadTable('students.csv', 'csv', 'header');
}

function setup() {
    createCanvas(800, 800);
    
    myBar = new Bar(50, 50, 700, 700); // Увеличен отступ для текста
    myBar.setupAxis(0, 5, 0, 100, 1, 10); // Настроены границы осей

    let sums = {
        quiz: 0,
        project: 0,
        exam: 0,
        finalMark: 0,
    };

    // Подсчет суммы
    for (let i = 0; i < studentData.getRowCount(); i++) {
        sums.quiz += studentData.getNum(i, 'quiz');
        sums.project += studentData.getNum(i, 'project');
        sums.exam += studentData.getNum(i, 'exam');
        sums.finalMark += studentData.getNum(i, 'finalMark');
    }

    // Средние значения
    let averages = {
        quiz: sums.quiz / studentData.getRowCount(),
        project: sums.project / studentData.getRowCount(),
        exam: sums.exam / studentData.getRowCount(),
        finalMark: sums.finalMark / studentData.getRowCount(),
    };

    // Добавление столбцов в диаграмму
    myBar.addBar(1, averages.quiz, 0.5, 'red');
    myBar.addBar(2, averages.project, 0.5, 'blue');
    myBar.addBar(3, averages.exam, 0.5, 'green');
    myBar.addBar(4, averages.finalMark, 0.5, 'orange');
}

function draw() {
    noLoop();
}

function Bar(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.setupAxis = function (xMin, xMax, yMin, yMax, xTickSpacing, yTickSpacing) {
        this.xMin = xMin;
        this.xMax = xMax;
        this.yMin = yMin;
        this.yMax = yMax;

        stroke(0);
        strokeWeight(1);
        fill(0);
        
        // Оси
        line(this.x, this.y + this.height, this.x + this.width, this.y + this.height); // X ось
        line(this.x, this.y, this.x, this.y + this.height); // Y ось
        
        // Шкала X
        for (let i = xMin; i <= xMax; i++) {
            let xPos = this.x + (i - xMin) * (this.width / (xMax - xMin));
            line(xPos, this.y + this.height, xPos, this.y + this.height + 5);
            textAlign(CENTER);
            text(i, xPos, this.y + this.height + 15);
        }

        // Шкала Y
        for (let j = yMin; j <= yMax; j += yTickSpacing) {
            let yPos = this.y + this.height - (j - yMin) * (this.height / (yMax - yMin));
            line(this.x, yPos, this.x - 5, yPos);
            textAlign(RIGHT, CENTER);
            text(j, this.x - 10, yPos);
        }
    };

    this.addBar = function (xValue, yValue, barWidth, colour) {
        if (yValue >= this.yMin && yValue <= this.yMax) {
            fill(colour);
            noStroke();
            
            let barX = this.x + (xValue - this.xMin) * (this.width / (this.xMax - this.xMin));
            let barY = this.y + this.height - (yValue - this.yMin) * (this.height / (this.yMax - this.yMin));
            let barHeight = (yValue - this.yMin) * (this.height / (this.yMax - this.yMin));
            let barW = barWidth * (this.width / (this.xMax - this.xMin));
            
            rect(barX - barW / 2, barY, barW, barHeight);
        }
    };
}
