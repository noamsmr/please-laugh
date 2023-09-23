const audios = [
    new Audio('audio/laugh1.mp3'),
    new Audio('audio/laugh2.mp3'),
    new Audio('audio/laugh3.mp3'),
    new Audio('audio/laugh4.mp3'),
    new Audio('audio/laugh5.mp3'),
    new Audio('audio/laugh6.mp3')
]
const laughButton = document.querySelector("#laughButton");
const FADE_LENGTH = 2;
let previousAudio;
let currentAudio;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image;
const lastImgNumber = 20;
const fps = 30
let imgNumber = 1;



// --- Animation ---

img.onload = function(){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(img, 0, 0);
};

img.src = "frames/frame_" + (imgNumber) + ".jpg";

function animateToFrame(targetFrame) {
    if (targetFrame === imgNumber) {
        return;
    }

    const step = imgNumber < targetFrame ? 1 : -1;

    let timer = setInterval( function(){
        if (imgNumber === targetFrame){
            clearInterval(timer);
        } else {
            imgNumber = imgNumber + step;
            img.src = "frames/frame_" + (imgNumber) + ".jpg";
        }
    }, 1000 / fps);
}



// --- Button listen ---

laughButton.addEventListener("click", (event) => {
    const nextAudio = getRandomAudio(previousAudio, currentAudio);

    animateToFrame(getRandomInt(19) + 1);

    fadeOut(currentAudio)

    nextAudio.volume = 1;
    play(nextAudio);

    previousAudio = currentAudio;
    currentAudio = nextAudio;
});

function play(audio) {
    audio.play();
}

function stop(audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1;
}

function fadeIn() {
    
}

function fadeOut(audio) {
    if (!audio) {
        return;
    }

    const volDecrease = 0.1 / FADE_LENGTH;
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
