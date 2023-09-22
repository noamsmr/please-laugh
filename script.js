const audio1 = new Audio('laugh1.mp3');
const audio2 = new Audio('laugh2.mp3');
const audio3 = new Audio('laugh3.mp3');
const audio4 = new Audio('laugh4.mp3');
const audio5 = new Audio('laugh5.mp3');
const audio6 = new Audio('laugh6.mp3');
const laughButton = document.querySelector("#laughButton");
const FADE_LENGTH = 2;
let previousAudio;
let currentAudio;

laughButton.addEventListener("click", (event) => {
    const nextAudio = getRandomAudio(previousAudio, currentAudio);

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
        return audio1;
    }

    switch (getFilename(audio.src)) {
        case 'laugh1.mp3':
            return audio2;
        case 'laugh2.mp3':
            return audio3;
        case 'laugh3.mp3':
            return audio4;
        case 'laugh4.mp3':
            return audio5;
        case 'laugh5.mp3':
            return audio6;
        case 'laugh6.mp3':
            return audio1;
        default:
            return 0;
    }
}

function getRandomAudio(previousAudio, currentAudio) {
    let audio;

    switch (getRandomInt(6)) {
        case 0:
            audio = audio2;
            break;
        case 1:
            audio = audio3;
            break;
        case 2:
            audio = audio4;
            break;
        case 3:
            audio = audio5;
            break;
        case 4:
            audio = audio6;
            break;
        case 5:
            audio = audio1;
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
