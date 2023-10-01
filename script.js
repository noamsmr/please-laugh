let isInvert = false;
let isAudioInit = false;
let isAnimationInit = false;
let sampleBuffer;
let currentAudio;
let previousAudio;
const AUDIO_FADE_OUT_LENGTH = 2;
const BUFFER_MULTIPLIER = 1;
const audios = []

const FIRST_FRAME = 0;
const NUMBER_OF_FRAMES = 20;
const ANIMATION_TIMEOUT = 0; // 0 => no timeout
const compressionFunction = (x) => 0.23 * Math.pow(x, 1/4)
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let frameNumber = 0;
let start, previousTimeStamp;
let elapsedFrameDelay = 0;
let previousFrameNember = 0;
const happyFrames = []
const sadFrames = []
let currentFrame;
const invertButton = document.querySelector("#invert-button");
const text = document.querySelector("#text");
const container = document.querySelector("#container");
loadAudioFiles();
loadImageFiles();

window.onload = function() {
    currentFrame = happyFrames[0];

    isInvert = JSON.parse(localStorage.getItem("isInvert"));
    if (isInvert === null) { return }

    
    setInvertedTheme(isInvert);
    
    setTimeout(() => { window.scrollTo(0, 1) }, 0);
    
    
    happyFrames[0].onload = () => {
        window.requestAnimationFrame(() => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.drawImage(currentFrame, 0, 0);
        });
    }
}




// --- Audio ---

function loadAudioFiles() {
    for (let index = 0; index < 6; index++) {
        audios.push(new Audio(`audio/laugh${index}.mp3`))
    }
}

function setupAudioAPI() {
    if (isAudioInit) { return }

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024 * BUFFER_MULTIPLIER;
    sampleBuffer = new Float32Array(analyser.fftSize);
    audios.forEach(audio => {
        const source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
    });
    analyser.connect(audioCtx.destination);
    
    isAudioInit = true;
}

function startAnimation() {
    if (isAnimationInit) { return }

    window.requestAnimationFrame(step);
    
    isAnimationInit = true;
}

function play(audio) {
    audio.play();
}

function stop(audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1;
}

function fadeOut(audio) {
    if (!audio) {
        return;
    }

    const volDecrease = 0.1 / AUDIO_FADE_OUT_LENGTH;
    let volume = audio.volume;
    
    const intervId = setInterval(() => {
        volume = volume - volDecrease;

        if (volume < 0) {
            stop(audio);
            clearInterval(intervId);
        } else {
            audio.volume = volume;
        }
    }, 100);
}

function getNextAudio(audio) {
    if (!audio) {
        return audios[0];
    }

    switch (getFilename(audio.src)) {
        case 'laugh1.mp3':
            return audios[1];
        case 'laugh2.mp3':
            return audios[2];
        case 'laugh3.mp3':
            return audios[3];
        case 'laugh4.mp3':
            return audios[4];
        case 'laugh5.mp3':
            return audios[5];
        case 'laugh6.mp3':
            return audios[0];
        default:
            return 0;
    }
}

function getRandomAudio(previousAudio, currentAudio) {
    let audio;

    switch (getRandomInt(6)) {
        case 0:
            audio = audios[1];
            break;
        case 1:
            audio = audios[2];
            break;
        case 2:
            audio = audios[3];
            break;
        case 3:
            audio = audios[4];
            break;
        case 4:
            audio = audios[5];
            break;
        case 5:
            audio = audios[0];
            break;
        default:
    }
    if ((previousAudio && getFilename(previousAudio.src) === getFilename(audio.src)) ||
    (currentAudio && getFilename(currentAudio.src) === getFilename(audio.src))) {
        audio = getRandomAudio(previousAudio, currentAudio);
    }

    return audio;
}

function getFilename(fullPath) {
    return fullPath.replace(/^.*[\\\/]/, '');
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}



// --- Animation ---

function loadImageFiles() {
    for (let index = FIRST_FRAME; index < NUMBER_OF_FRAMES; index++) {
        happyFrames.push(new Image);
        setTimeout(() => {happyFrames[index].src = `frames/happy_frame_${index}.jpg`});
    }
    for (let index = FIRST_FRAME; index < NUMBER_OF_FRAMES; index++) {
        sadFrames.push(new Image);
        setTimeout(() => {sadFrames[index].src = `frames/sad_frame_${index}.jpg`});
    }
}

function step(timeStamp) {
    if (start === undefined) {
        start = timeStamp;
    }
    const elapsed = timeStamp - start;

    if (previousTimeStamp !== timeStamp) {
        analyser.getFloatTimeDomainData(sampleBuffer);
        let sumOfSquares = 0;
        for (let i = 0; i < sampleBuffer.length; i++) {
            sumOfSquares += sampleBuffer[i] ** 2;
        }
        frameNumber = Math.floor(compressionFunction(sumOfSquares) * NUMBER_OF_FRAMES) + FIRST_FRAME;

        if (previousFrameNember < frameNumber) {
            elapsedFrameDelay = elapsed + 100;
            if (previousFrameNember !== frameNumber) {
                drawFrame(frameNumber);
                previousFrameNember = frameNumber;
            }
        } else if (elapsed > elapsedFrameDelay) {
            elapsedFrameDelay = elapsed + 100;
            frameNumber = previousFrameNember > FIRST_FRAME ? previousFrameNember - 1 : FIRST_FRAME;
            if (previousFrameNember !== frameNumber) {
                drawFrame(frameNumber);
                previousFrameNember = frameNumber
            }
        }
    }

    if (ANIMATION_TIMEOUT === 0 || elapsed < ANIMATION_TIMEOUT) {
        previousTimeStamp = timeStamp;
        window.requestAnimationFrame(step);
    }
}

function drawHappyFrame(number) {
    if (number >= FIRST_FRAME + NUMBER_OF_FRAMES || number < FIRST_FRAME || number%1 !== 0) {
        console.warn('No such frame number:', number);
        return;
    }

    currentFrame = happyFrames[number];

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(currentFrame, 0, 0);
}

function drawSadFrame(number) {
    if (number >= FIRST_FRAME + NUMBER_OF_FRAMES || number < FIRST_FRAME || number%1 !== 0) {
        console.warn('No such frame number:', number);
        return;
    }

    currentFrame = sadFrames[number];

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(currentFrame, 0, 0);
}

function drawFrame(frameNumber) {
    return (isInvert ? drawSadFrame : drawHappyFrame)(frameNumber);
}



// --- Button listen ---

canvas.addEventListener("click", (event) => {
    setupAudioAPI();
    startAnimation();

    const nextAudio = getRandomAudio(previousAudio, currentAudio);
    if (!(currentAudio == nextAudio)) {
        fadeOut(currentAudio)
    }

    nextAudio.volume = 1;
    play(nextAudio);

    previousAudio = currentAudio;
    currentAudio = nextAudio;
});

invertButton.addEventListener("click", () => {
    isInvert = !isInvert;

    setInvertedTheme(isInvert);
})

function setInvertedTheme(isInvert) {
    if (!isInvert) {
        previousFrameNember = 0
        ctx.filter = 'none'
        ctx.drawImage(currentFrame, 0, 0)

        container.classList.remove("invert-container");
        text.classList.remove("invert-text");
        invertButton.classList.remove("invert-invert");
        text.innerHTML = "אנא צחק";

        localStorage.setItem("isInvert", "false");
    } else {
        ctx.filter = 'invert(1)'
        ctx.drawImage(currentFrame, 0, 0)

        container.classList.add("invert-container");
        text.classList.add("invert-text");
        invertButton.classList.add("invert-invert");
        text.innerHTML = "אל נא צחק";

        localStorage.setItem("isInvert", "true");
    }
}