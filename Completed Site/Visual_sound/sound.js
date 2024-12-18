let sound;
let isInitialised;
let isLoaded = false;
let amplitude;
let amplitudes = [];
let fft;
let speedSlider, rangeSlider;
let playButton, rewindButton, forwardButton, nextButton, prevButton;
let progressSlider;
let timeText;
let trackList = ["1.mp3", "2.mp3", "3.mp3"];
let currentTrackIndex = 0;

function preload() {
    loadTrack(currentTrackIndex);
}

function loadTrack(index) {
    if (sound) {
        sound.stop();
    }
    sound = loadSound(`assets/${trackList[index]}`, () => {
        isLoaded = true;
        sound.setVolume(0.2);
        sound.play();
    });
    isInitialised = false;
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER);
    textSize(16);

    amplitude = new p5.Amplitude();
    fft = new p5.FFT();
    colorMode(HSB, 360, 100, 100);

    // Ползунки
    speedSlider = createSlider(0.5, 3, 1, 0.1);
    speedSlider.position(20, 30);
    rangeSlider = createSlider(50, 300, 150, 10);
    rangeSlider.position(20, 70);

    // Кнопки управления
    playButton = createButton('▶️/⏸');
    playButton.position(60, 175);
    playButton.mousePressed(togglePlay);

    nextButton = createButton('⏮');
    nextButton.position(30, 175);
    nextButton.mousePressed(nextTrack);

    prevButton = createButton('⏭');
    prevButton.position(110, 175);
    prevButton.mousePressed(prevTrack);

    // Ползунок прогресса
    progressSlider = createSlider(0, 1, 0, 0.01);
    progressSlider.position(20, 140);
    progressSlider.input(updateProgress);

    // Текст времени
    timeText = createP('00:00 / 00:00');
    timeText.position(45, 90);
    timeText.style('color', 'white');

    for (let i = 0; i < width; i++) {
        amplitudes.push(0);
    }
}

function draw() {
    background(0);

    fill(255);
    textAlign(LEFT);

    //Ползунки
    text("Скорость", speedSlider.x, speedSlider.y - 10);
    text("Длина конфети", rangeSlider.x, rangeSlider.y - 10);

    if (isInitialised && !sound.isPlaying()) {
        textAlign(CENTER);
        text("Press any key to play sound", width / 2, height / 2);
    } else if (sound.isPlaying()) {
        let level = amplitude.getLevel();
        amplitudes.push(level);
        amplitudes.shift();

        let waveColor = map(level, 0, 0.2, 180, 360);
        stroke(waveColor, 100, 100);
        strokeWeight(2);
        noFill();

        beginShape();
        for (let i = 0; i < amplitudes.length; i++) {
            let y = map(amplitudes[i], 0, 0.2, height / 2, 0);
            vertex(map(i, 0, amplitudes.length, 0, width), y);
        }
        endShape();

        // Скорость звука
        sound.rate(speedSlider.value());

        // Конфети
        stroke(random(360), 100, 100, 0.5);
        let strokeRange = rangeSlider.value();
        for (let i = 0; i < 10; i++) {
            let x1 = random(width);
            let y1 = random(height);
            let x2 = x1 + random(-strokeRange, strokeRange);
            let y2 = y1 + random(-strokeRange, strokeRange);
            line(x1, y1, x2, y2);
        }

        // Высокие и низкие частоты
        let spectrum = fft.analyze();
        let binWidth = width / spectrum.length;

        for (let i = 0; i < spectrum.length; i++) {
            let x = map(i, 0, spectrum.length - 500, width, 0);
            let binHeight = map(spectrum[i], 0, 255, height, 0);
            let hueValue = map(i, 0, spectrum.length, 0, 360);

            fill(hueValue, 100, 100);
            noStroke();
            rect(x, binHeight, binWidth, height - binHeight);
        }

        // Обновление ползунка прогресса
        progressSlider.value(sound.currentTime() / sound.duration());

        // Обновление текста времени
        let currentTrackTime = sound.currentTime();
        let trackDuration = sound.duration();
        let currentMinutes = floor(currentTrackTime / 60);
        let currentSeconds = floor(currentTrackTime % 60);
        let durationMinutes = floor(trackDuration / 60);
        let durationSeconds = floor(trackDuration % 60);
        timeText.html(nf(currentMinutes, 2) + ':' + nf(currentSeconds, 2) + ' / ' + nf(durationMinutes, 2) + ':' + nf(durationSeconds, 2));
    }
}

function togglePlay() {
    if (sound.isPlaying()) {
        sound.pause();
    } else {
        sound.play();
    }
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % trackList.length;
    loadTrack(currentTrackIndex);
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + trackList.length) % trackList.length;
    loadTrack(currentTrackIndex);
}

function updateProgress() {
    if (sound.isPlaying()) {
        sound.jump(progressSlider.value() * sound.duration());
    }
}
