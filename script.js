


// --- Audio ---

const AUDIO_FADE_OUT_LENGTH = 2;
const BUFFER_MULTIPLIER = 1;
const audios = [
    new Audio('audio/laugh1.mp3'),
    new Audio('audio/laugh2.mp3'),
    new Audio('audio/laugh3.mp3'),
    new Audio('audio/laugh4.mp3'),
    new Audio('audio/laugh5.mp3'),
    new Audio('audio/laugh6.mp3')
]
let isAudioCtxInit = false;
let sampleBuffer;
let currentAudio;
let previousAudio;

const setupAudioAPIAndAnimation = () => {
    if (isAudioCtxInit) { return }

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

    window.requestAnimationFrame(step)
    
    isAudioCtxInit = true;
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

const NUMBER_OF_FRAMES = 20;
const ANIMATION_TIMEOUT = 100000;
const compressionFunction = (x) => 0.23 * Math.pow(x, 1/4)
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image;
let imgNumber = 20;
let start, previousTimeStamp;
let elapsedFrameDelay = 0;
let previousFrameNember = 1;

img.onload = function(){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(img, 0, 0);
};

setSadImgNum(imgNumber);

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
        let frameNumber = Math.floor(compressionFunction(sumOfSquares) * NUMBER_OF_FRAMES) + 20;

        if (previousFrameNember < frameNumber) {
            elapsedFrameDelay = elapsed + 100;
            setSadImgNum(frameNumber);
            previousFrameNember = frameNumber
        } else if (elapsed > elapsedFrameDelay) {
            elapsedFrameDelay = elapsed + 100;
            frameNumber = previousFrameNember > 20 ? previousFrameNember - 1 : 20;
            setSadImgNum(frameNumber);
            previousFrameNember = frameNumber
        }
    }

    // if (elapsed < ANIMATION_TIMEOUT) {
        previousTimeStamp = timeStamp;
        window.requestAnimationFrame(step);
    // }
}

function setHappyImgNum(number) {
    if (number > NUMBER_OF_FRAMES || number < 0 || number%1 !== 0) {
        console.warn('No such frame number:', number);
        return;
    }
    img.src = "frames/happy_frame_" + (number) + ".jpg";
}

function setSadImgNum(number) {
    if (number > NUMBER_OF_FRAMES + 20 || number < 20 || number%1 !== 0) {
        console.warn('No such frame number:', number);
        return;
    }
    img.src = "frames/sad_frame_" + (number) + ".jpg";
}



// --- Button listen ---

const laughButton = document.querySelector("#laugh-button");

laughButton.addEventListener("click", (event) => {
    setupAudioAPIAndAnimation();

    const nextAudio = getRandomAudio(previousAudio, currentAudio);
    if (!(currentAudio == nextAudio)) {
        fadeOut(currentAudio)
    }

    nextAudio.volume = 1;
    play(nextAudio);

    previousAudio = currentAudio;
    currentAudio = nextAudio;
});
