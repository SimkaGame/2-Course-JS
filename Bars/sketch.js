let myBar;
let studentData;

function preload() {
    studentData = loadTable('students.csv', 'csv', 'header');
}

function setup() {
    createCanvas(800, 800);
    
    myBar = new Bar(30, 30, 700, 700);
    myBar.setupAxis(0, 10, 0, 150, 1, 10);

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
    let genderCounts = {
        Male: 0,
        Female: 0
    };
    let maxValues = {
        quiz: 0,
        project: 0,
        exam: 0,
        finalMark: 0
    };

    // Сумма и подсчеты
    for (let i = 0; i < studentData.getRowCount(); i++) {
        sums.quiz += studentData.getNum(i, 'quiz');
        sums.project += studentData.getNum(i, 'project');
        sums.exam += studentData.getNum(i, 'exam');
        sums.finalMark += studentData.getNum(i, 'finalMark');
        counts.quiz++;
        counts.project++;
        counts.exam++;
        counts.finalMark++;

        // Подсчет количества по гендеру
        let gender = studentData.getString(i, 'gender');
        if (gender === 'M') {
            genderCounts.Male++;
        } else if (gender === 'F') {
            genderCounts.Female++;
        }

        // Поиск максимальных значений
        let quiz = studentData.getNum(i, 'quiz');
        let project = studentData.getNum(i, 'project');
        let exam = studentData.getNum(i, 'exam');
        let finalMark = studentData.getNum(i, 'finalMark');

        if (quiz > maxValues.quiz) {
            maxValues.quiz = quiz;
        }
        if (project > maxValues.project) {
            maxValues.project = project;
        }
        if (exam > maxValues.exam) {
            maxValues.exam = exam;
        }
        if (finalMark > maxValues.finalMark) {
            maxValues.finalMark = finalMark;
        }
    }

    // Среднее
    let averages = {
        quiz: sums.quiz / counts.quiz,
        project: sums.project / counts.project,
        exam: sums.exam / counts.exam,
        finalMark: sums.finalMark / counts.finalMark,
    };

    // Добавление столбцов в диаграмму
    myBar.addBar(1, averages.quiz, 1, 'red');
    myBar.addLabel(1 + 0.5, averages.quiz + 5, 'red', averages.quiz.toFixed(2)); // Отображение среднего значения в формате числа
    myBar.addBar(2, averages.project, 1, 'blue');
    myBar.addLabel(2 + 0.5, averages.project  + 5, 'blue', averages.project.toFixed(2)); // Отображение среднего значения в формате числа
    myBar.addBar(3, averages.exam, 1, 'green');
    myBar.addLabel(3 + 0.5, averages.exam  + 5, 'green', averages.exam.toFixed(2)); // Отображение среднего значения в формате числа
    myBar.addBar(4, averages.finalMark, 1, 'orange');
    myBar.addLabel(4 + 0.5, averages.finalMark  + 5, 'orange', averages.finalMark.toFixed(2)); // Отображение среднего значения в формате числа

    // Добавление столбцов для максимальных значений
    myBar.addBar(5, maxValues.quiz, 1, 'darkred');
    myBar.addLabel(5 + 0.5, maxValues.quiz  + 5, 'darkred', maxValues.quiz);
    myBar.addBar(6, maxValues.project, 1, 'darkblue');
    myBar.addLabel(6 + 0.5, maxValues.project  + 5, 'darkblue', maxValues.project);
    myBar.addBar(7, maxValues.exam, 1, 'darkgreen');
    myBar.addLabel(7 + 0.5, maxValues.exam  + 5, 'darkgreen', maxValues.exam);
    myBar.addBar(8, maxValues.finalMark, 1, 'darkorange');
    myBar.addLabel(8 + 0.5, maxValues.finalMark  + 5, 'darkorange', maxValues.finalMark);

    // Добавление столбцов для количества по гендеру
    myBar.addBar(9, genderCounts.Male, 1, 'lightblue');
    myBar.addLabel(9 + 0.5, genderCounts.Male  + 5, 'lightblue', genderCounts.Male + ' Male');
    myBar.addBar(10, genderCounts.Female, 1, 'pink');
    myBar.addLabel(10 + 0.5, genderCounts.Female  + 5, 'pink', genderCounts.Female + ' Female');
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
            strokeWeight(4);
            stroke(0);
            rect(this.x + xValue * (this.width / (this.xMax - this.xMin)) - width / 2, this.y + this.height - yValue * (this.height / this.yMax), width * (this.width / (this.xMax - this.xMin)), yValue * (this.height / this.yMax));
        }
    };

    this.addLabel = function (xValue, yValue, colour, label = '') {
        fill(colour);
        noStroke();
        textSize(12);
        textAlign(CENTER, BOTTOM);
        text(label || yValue, this.x + xValue * (this.width / (this.xMax - this.xMin)), this.y + this.height - yValue * (this.height / this.yMax) - 5);
    };
}
