var header = null;
var playbackRates = [1, 1.5, 2, 2.5, 3];
var isPopupOpenned = false;
var selectedRate = 1;
var loopInterval = null;
var DEBUG = false;

function debug(...message) {
  DEBUG && console.log(...message);
}

function endRateLoop() {
  debug('finalizou o loop de rate');
  clearInterval(loopInterval);
  loopInterval = null;
}

function startRateLoop(rate) {
  if (loopInterval) {
    endRateLoop();
  }

  debug('iniciando o loop de rate');
  loopInterval = setInterval(() => {
    debug('dentro o loop de rate: ', rate);
    changeAudioRate(rate);
  }, 500)
}

function togglePopup() {
  const popupBox = document.querySelector(".popupBox");

  if (!popupBox) {
    return;
  }

  if (isPopupOpenned) {
    popupBox.classList.remove("visible")
  } else {
    popupBox.classList.add("visible")
  }

  isPopupOpenned = !isPopupOpenned;
}

function formatDisplayRate(rate) {
  let sufix = !String(rate).includes(".") ? ".0x" : "x";
  return `${rate}${sufix}`;
}

function changeAudioRate(rate) {  
  const speedButton = document.querySelector(".spChangerBtn");
  speedButton.textContent = formatDisplayRate(rate);

  if (rate === 1) {
    speedButton.classList.remove("active");
  } else {
    speedButton.classList.add("active");
  }

  const audios = document.querySelectorAll("audio");
  audios.forEach(audio => audio.playbackRate = rate);
}

function onChangeRate(rate) {
  togglePopup();
  
  if (rate === 1) {
    changeAudioRate(rate);
    endRateLoop();
  } else if (selectedRate !== rate) {
    changeAudioRate(rate);
    //inicia um loop com o novo rate
    startRateLoop(rate);
  }

  selectedRate = rate;
}

const interval = setInterval(() => {
  header = document.querySelector(`span[data-testid*="menu"]`)
    .parentElement
    .parentElement
    .parentElement;

  if (header) {
    clearInterval(interval);

    const speednButton = document.createElement("button");
    speednButton.textContent = formatDisplayRate(1);
    speednButton.classList.add("spChangerBtn");
    speednButton.addEventListener("click", () => togglePopup());
    header.appendChild(speednButton);

    //criando o popup de selecao
    const itensContainer = document.createElement("ul");
    itensContainer.classList.add("speedItensContainer");

    playbackRates.forEach(rate => {
      let speedItem = document.createElement("li");
        speedItem.classList.add("speedItem");      
        speedItem.textContent = formatDisplayRate(rate);
        speedItem.addEventListener("click", () => onChangeRate(rate));
        itensContainer.appendChild(speedItem);
    })

    const popupBox = document.createElement("div")
    popupBox.classList.add("popupBox");
    popupBox.appendChild(itensContainer);
    header.appendChild(popupBox);
  }
}, 1000)