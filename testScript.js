// const myAudio = document.querySelector("audio");

const myAudio = new Audio('laugh1.mp3')
const btn = document.querySelector('#btn')
let isAudioCtxInit = false;
let anl;

btn.addEventListener('click', (e) => {
  myAudio.play();
})

myAudio.addEventListener("play", (e) => {
  if (!isAudioCtxInit) {
    anl = createAudioCxt(myAudio);
    analize(anl.analyser, anl.sampleBuffer);

    isAudioCtxInit = true;
  }

  if (anl) {
    analize(anl.analyser, anl.sampleBuffer);
  }
})

function createAudioCxt(audioEl) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaElementSource(audioEl);

  analyser = audioCtx.createAnalyser();

  analyser.smoothingTimeConstant = 0.8;
  analyser.fftSize = 1024;

  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  const sampleBuffer = new Float32Array(analyser.fftSize);

  return { analyser, sampleBuffer };
}

function analize(analyser, sampleBuffer) {
  const id = setInterval(() => {
    analyser.getFloatTimeDomainData(sampleBuffer);
 
    let sumOfSquares = 0;
    for (let i = 0; i < sampleBuffer.length; i++) {
      sumOfSquares += sampleBuffer[i] ** 2;
    }
    const avgPowerDecibels = 10 * Math.log10(sumOfSquares / sampleBuffer.length);

    setTimeout(() => {
      clearInterval(id);
    }, 7000);

    console.log('avgPowerDecibels', avgPowerDecibels);
  }, 1000 / 3);
}