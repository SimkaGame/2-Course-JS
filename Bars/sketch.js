let myBar;
let studentData;
let chartType = "bar";
let switchButton;
let categorySelect;
let pieData = [];
let averages, maxValues, genderCounts;

function preload() {
    studentData = loadTable('students.csv', 'csv', 'header');
}

function setup() {
    createCanvas(800, 800);

    //Элемент из HTML
    switchButton = select('#switchButton');
    categorySelect = select('#categorySelect');
    categorySelect.position(320, 780);

    myBar = new Bar(0, 0, 600, 600);
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
    maxValues = {
        quiz: -Infinity,
        project: -Infinity,
        exam: -Infinity,
        finalMark: -Infinity,
    };
    genderCounts = {
        Male: 0,
        Female: 0
    };

    // Подсчет суммы
    for (let i = 0; i < studentData.getRowCount(); i++) {
        let quiz = studentData.getNum(i, 'quiz');
        let project = studentData.getNum(i, 'project');
        let exam = studentData.getNum(i, 'exam');
        let finalMark = studentData.getNum(i, 'finalMark');

        sums.quiz += quiz;
        sums.project += project;
        sums.exam += exam;
        sums.finalMark += finalMark;

        counts.quiz++;
        counts.project++;
        counts.exam++;
        counts.finalMark++;

        maxValues.quiz = max(maxValues.quiz, quiz);
        maxValues.project = max(maxValues.project, project);
        maxValues.exam = max(maxValues.exam, exam);
        maxValues.finalMark = max(maxValues.finalMark, finalMark);

        let gender = studentData.getString(i, 'gender');
        if (gender === 'M') {
            genderCounts.Male++;
        } else if (gender === 'F') {
            genderCounts.Female++;
        }
    }

    averages = {
        quiz: sums.quiz / counts.quiz,
        project: sums.project / counts.project,
        exam: sums.exam / counts.exam,
        finalMark: sums.finalMark / counts.finalMark,
    };

    //Диаграмма
    this.barData = [
        { label: "Quiz", value: averages.quiz, color: "red" },
        { label: "Project", value: averages.project, color: "green" },
        { label: "Exam", value: averages.exam, color: "magenta" },
        { label: "Final Mark", value: averages.finalMark, color: "orange" },
        { label: "Quiz", value: maxValues.quiz, color: "red" },
        { label: "Project", value: maxValues.project, color: "green" },
        { label: "Exam", value: maxValues.exam, color: "magenta" },
        { label: "Final Mark", value: maxValues.finalMark, color: "orange" },
        { label: "Male", value: genderCounts.Male, color: "blue" },
        { label: "Female", value: genderCounts.Female, color: "pink" },
    ];

    // Отрисовка
    drawBarChart();
}

function draw() {
    noLoop();
}

//Смена диаграмм
function switchChartType() {
    if (chartType == "bar") {
        chartType = "pie";
        switchButton.html("Switch to Bar Chart");
        categorySelect.show();
        updatePieData();
    } else {
        chartType = "bar";
        switchButton.html("Switch to Pie Chart");
        categorySelect.hide();
        drawBarChart();
    }
}

//Обновления круговой диаграммы
function updatePieData() {
    let selectedCategory = categorySelect.value();
    if (selectedCategory == 'Средние значения') {
        pieData = [
            { label: "Quiz", value: averages.quiz, color: "red" },
            { label: "Project", value: averages.project, color: "blue" },
            { label: "Exam", value: averages.exam, color: "green" },
            { label: "Final Mark", value: averages.finalMark, color: "orange" },
        ];
    } else if (selectedCategory == 'Максимальные значения') {
        pieData = [
            { label: "Quiz", value: maxValues.quiz, color: "purple" },
            { label: "Project", value: maxValues.project, color: "cyan" },
            { label: "Exam", value: maxValues.exam, color: "magenta" },
            { label: "Final Mark", value: maxValues.finalMark, color: "yellow" },
        ];
    } else if (selectedCategory == 'Пол') {
        pieData = [
            { label: "Male", value: genderCounts.Male, color: "gray" },
            { label: "Female", value: genderCounts.Female, color: "pink" },
        ];
    }
    drawPieChart(); 
}

//Отрисовка диаграммы
function drawBarChart() {
    background(255);
    let barWidth = 1;
    let xValue = 1;

    for (let i = 0; i < barData.length; i++) {
        let data = barData[i];
        myBar.addBar(xValue, data.value, barWidth, data.color);

        //Надписи и значения
        let barX = myBar.x + xValue * (myBar.width / (myBar.xMax - myBar.xMin));
        let barY = myBar.y + myBar.height - data.value * (myBar.height / myBar.yMax);
        noStroke();
        fill(0);
        textSize(14);
        textAlign(LEFT);
        text(`${data.value.toFixed(1)}`, barX, barY - 10);

        xValue++;

        //Промежуток между столбцами
        if (i == 3 || i == 7) {
            xValue++;
        }
    }

    //Легенда категорий
    textAlign(CENTER);
    textSize(16);
    fill(0);
    text("Средние значения", 180, 630);
    text("Максимальные значения", 480, 630);
    text("Пол", 720, 630);

    drawLegend(barData);
}

//Отрисовка круговой диаграммы
function drawPieChart() {
    background(255);
    let total = pieData.reduce((sum, item) => sum + item.value, 0);
    let angleStart = 0;

    for (let item of pieData) {
        let angleEnd = angleStart + (item.value / total) * TWO_PI;
        fill(item.color);
        stroke(0);
        strokeWeight(1);
        arc(400, 400, 600, 600, angleStart, angleEnd, PIE);

        //Значения
        let midAngle = (angleStart + angleEnd) / 2;
        let labelX = 400 + cos(midAngle) * 150;
        let labelY = 400 + sin(midAngle) * 150;
        fill(0);
        noStroke();
        textSize(40);
        textAlign(CENTER, CENTER);
        text(`${item.value.toFixed(1)}`, labelX, labelY);

        angleStart = angleEnd;
    }

    drawLegend(pieData);
}

//Легенда
function drawLegend(data) {
    let startX = 10;
    let startY = 20;
    let boxSize = 20;
    let spacing = 30;

    for (let i = 0; i < data.length; i++) {
        fill(data[i].color);
        rect(startX, startY + i * spacing, boxSize, boxSize);
        fill(0);
        textSize(16);
        textAlign(LEFT, CENTER);
        text(data[i].label, startX + boxSize + 10, startY + i * spacing + boxSize / 2);
    }
}

//Cоздания диаграммы
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
    };
    this.addBar = function (xValue, yValue, width, colour) {
        stroke(0);
        strokeWeight(2);
        fill(colour);
        rect(this.x + xValue * (this.width / (this.xMax - this.xMin)) - width / 2, this.y + this.height - yValue * (this.height / this.yMax), width * (this.width / (this.xMax - this.xMin)), yValue * (this.height / this.yMax));
    };
}