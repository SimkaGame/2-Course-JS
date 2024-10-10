let sound;
let isInitialised;
let isLoaded = false;
let amplitude;
let amplitudes = [];
let fft;

function preload() {
    soundFormats('mp3', 'wav');
    sound = loadSound('assets/1.mp3', () => {
        console.log("sound is loaded!");
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

    for (let i = 0; i < width; i++) {
        amplitudes.push(0);
    }

    fft = new p5.FFT();
    colorMode(HSB, 360, 100, 100);
}

function draw() {
    background(0);
    fill(255);

    if (isInitialised && !sound.isPlaying()) {
        text("Press any key to play sound", width / 2, height / 2);
    } else if (sound.isPlaying()) {
        let level = amplitude.getLevel();
        amplitudes.push(level);
        amplitudes.shift();

        //Пульс
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
        
        //апгрейд
        let spectrum = fft.analyze();
        noStroke();
        for (let i = 0; i < spectrum.length; i++) {
            let x = map(i, 0, spectrum.length, 0, width);
            let h = map(spectrum[i], 0, 255, height / 2, 0); 
            fill((i + waveColor) % 360, 100, 100);
            rect(x, height, width / spectrum.length, -h);
        }
    }
}

function keyPressed() {
    if (!isInitialised) {
        isInitialised = true;

        let r = map(700, 400, width, 0.5, 4.0); 
        if (isLoaded) {
            sound.loop(0, r);
        }
    } else {
        if (key == ' ') {
            if (sound.isPaused()) sound.play();
            else sound.pause();
        }
    }
}