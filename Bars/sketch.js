let myBar;
let studentData;

function preload() {
    studentData = loadTable('students.csv', 'csv', 'header');
}

function setup() {
    createCanvas(800, 800);
    
    myBar = new Bar(10, 10, 700, 700);
    myBar.setupAxis(0, 10, 0, 100, 1, 10);

    let sums = {
        quiz: 0,
        project: 0,
        exam: 0,
        finalMark: 0,
    };
    let counts = {
        quiz: 0,
        project: 0,
        exam: 0,
        finalMark: 0,
    };

    //Сумма
    for (let i = 0; i < studentData.getRowCount(); i++) {
        sums.quiz += studentData.getNum(i, 'quiz');
        sums.project += studentData.getNum(i, 'project');
        sums.exam += studentData.getNum(i, 'exam');
        sums.finalMark += studentData.getNum(i, 'finalMark');
    //Кол
        counts.quiz++;
        counts.project++;
        counts.exam++;
        counts.finalMark++;
    }

    //Среднее
    let averages = {
        quiz: sums.quiz / counts.quiz,
        project: sums.project / counts.project,
        exam: sums.exam / counts.exam,
        finalMark: sums.finalMark / counts.finalMark,
    };

    // Добавление столбцов в диаграмму
    myBar.addBar(1, averages.quiz, 1, 'red');
    myBar.addBar(2, averages.project, 1, 'blue');
    myBar.addBar(3, averages.exam, 1, 'green');
    myBar.addBar(4, averages.finalMark, 1, 'orange');

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
        
        line(this.x, this.y + this.height, this.x + this.width, this.y + this.height); // X ось
        line(this.x, this.y, this.x, this.y + this.height); // Y ось
        

        for (let i = xMin; i <= xMax; i++) {
            line(this.x + i * (this.width / (xMax - xMin)), this.y + this.height, this.x + i * (this.width / (xMax - xMin)), this.y + this.height + 5);
            text(i, this.x + i * (this.width / (xMax - xMin)), this.y + this.height + 15);
        }


        for (let j = yMin; j <= yMax; j += yTickSpacing) {
            line(this.x, this.y + this.height - j * (this.height / yMax), this.x - 5, this.y + this.height - j * (this.height / yMax));
            text(j, this.x - 25, this.y + this.height - j * (this.height / yMax));
        }
    };


    this.addBar = function (xValue, yValue, width, colour) {
        if (yValue >= this.yMin && yValue <= this.yMax) {
            fill(colour);
//            noStroke();
            strokeWeight(4);
            stroke(0);
            rect(this.x + xValue * (this.width / (this.xMax - this.xMin)) - width / 2, this.y + this.height - yValue * (this.height / this.yMax), width * (this.width / (this.xMax - this.xMin)), yValue * (this.height / this.yMax));
        }
    };
}