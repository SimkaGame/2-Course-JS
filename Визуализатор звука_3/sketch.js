let sound;
let isInitialised;
let isLoaded = false;
let amplitude;
let amplitudes = [];
let fft;
let speedSlider, rangeSlider;

function preload() {
    soundFormats('mp3', 'wav');
    sound = loadSound('assets/1.mp3', () => {
        isLoaded = true;
    });
    isInitialised = false;
    sound.setVolume(0.2);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER);
    textSize(32);

    amplitude = new p5.Amplitude();
    fft = new p5.FFT();
    colorMode(HSB, 360, 100, 100);

    //Ползунки
    speedSlider = createSlider(0.5, 3, 1, 0.1);
    speedSlider.position(20, 20);
    rangeSlider = createSlider(50, 300, 150, 10);
    rangeSlider.position(20, 60);

    for (let i = 0; i < width; i++) {
        amplitudes.push(0);
    }
}

function draw() {
    background(0);
    
    //текст
    fill(255);
    text("Скорость", speedSlider.x * 2 + speedSlider.width + 50, 35);
    text("Длина конфети", rangeSlider.x * 2 + rangeSlider.width + 100, 75);

    if (isInitialised && !sound.isPlaying()) {
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

        //Скорость звука
        sound.rate(speedSlider.value());

        //Конфети
        stroke(random(360), 100, 100, 0.5);
        let strokeRange = rangeSlider.value();
        for (let i = 0; i < 10; i++) {
            let x1 = random(width);
            let y1 = random(height);
            let x2 = x1 + random(-strokeRange, strokeRange);
            let y2 = y1 + random(-strokeRange, strokeRange);
            line(x1, y1, x2, y2);
        }

        //Высокие и низкие частоты
        let spectrum = fft.analyze();
        noStroke();
        for (let i = 0; i < spectrum.length; i++) {
            let x = map(i, 0, spectrum.length, 0, width);
            let h = map(spectrum[i], 0, 255, height / 2, 0); 

            //Окрашивание частот
            if (i < spectrum.length / 3) {
                fill((i + waveColor) % 60, 100, 100); // Низкие частоты
            } else if (i > spectrum.length * 2 / 3) {
                fill((i + waveColor + 240) % 360, 100, 100); // Высокие частоты
            } else {
                fill((i + waveColor) % 360, 100, 100);
            }
            rect(x, height, width / spectrum.length, -h);
        }
    }
}

function keyPressed() {
    if (!isInitialised) {
        isInitialised = true;

        if (isLoaded) {
            sound.loop(0, speedSlider.value());
        }
    } else {
        if (key == ' ') {
            if (sound.isPaused()) sound.play();
            else sound.pause();
        }
    }
}
