const gameContainer = document.getElementById("game");
const startButton = document.querySelector('#start');
const scoreCard = document.querySelector('#score');
const lowScoreCard = document.querySelector('#low-score');
const resetButton = document.querySelector("#reset");
const pairsInput = document.querySelector('input[name = "pairs"]');
const form = document.querySelector("form");
const radios = document.getElementsByName("mode");
const flipContainer = document.querySelector(".flip-container");
const flipper = document.querySelector(".flipper");

let score = 0;
let inProgress = false;
let cardsSelected = 0;
let lowScore = 0;
let matchesMade = 0;
let numSelected = 0;
let previousCard = "";
let currentCard = "initial value";
let previousColor = "";
let currentColor = "";
let gifGame = false;


let randColors = [];


const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];


const GIFS = [
  "coffee",
  "bulldog",
  "guy",
  "kermit",
  "bear",
  "coffee",
  "bulldog",
  "guy",
  "kermit",
  "bear"
];


const gifObj = {
  "coffee": "https://media.giphy.com/media/Rmu0SUVH8l1du/giphy.gif",
  "bulldog": "https://media.giphy.com/media/aiE3JQU3vLqTK/giphy.gif",
  "guy": "https://media.giphy.com/media/NEvPzZ8bd1V4Y/giphy.gif",
  "kermit": "https://media.giphy.com/media/Nw8z2olm0nGHC/giphy.gif",
  "bear": "https://media.giphy.com/media/dzaUX7CAG0Ihi/giphy.gif"
}



resetButton.addEventListener("click", function () {
  score = 0;
  scoreCard.innerText = (`Score: ${score}`);
  inProgress = false;
  let divs = document.querySelectorAll(".flip-container");
  for (let div of divs) {
    div.remove();
  }
});


// shuffle cards and create divs based on radio button input
startButton.addEventListener("click", function () {
  let gameMode = getGameMode();
  if (!inProgress) {
    inProgress = true;
    switch (gameMode) {
      case "basic":
        let shuffledColors = shuffle(COLORS);
        createDivsForColors(shuffledColors);
        break;
      case "random":
        if (!pairsInput.value) {
          inProgress = false;
          alert("Please specify the number of pairs for the game, then click start.");
        }
        randColors = generateRandomColors(pairsInput.value, randColors);
        let shuffledRandomColors = shuffle(randColors);
        createDivsForColors(shuffledRandomColors);
        break;
      case "gifs":
        gifGame = "true";
        let shuffledGifs = shuffle(GIFS);
        createDivsForGifs(shuffledGifs);
        break;
      default:
        inProgress = false;
        alert("ATTENTION USER:\nPlease select a game mode, then click start.");
    }
  } else {
    alert("Game already in progress, to start new game, click reset");
  }
})


//Adapted from https://stackoverflow.com/questions/9618504/how-to-get-the-selected-radio-button-s-value
function getGameMode() {
  let mode = "";
  for (i = 0; i <= 2; i++) {
    if (radios[i].checked) {
      mode = radios[i].value;
    }
  }
  return mode;
}


function restoreLowScore() {
  let json = localStorage.getItem("low-score");
  if (json) {
    lowScore = JSON.parse(localStorage.getItem("low-score")).lowScore;
  } else {
    localStorage.setItem("low-score", JSON.stringify({ "lowScore": 0 }));
  }
  lowScoreCard.innerText = `Five pair game low score: ${lowScore}`;
}

// reset a nonmatching pair of cards back to the blank side
function resetCards(card1, card2) {
  setTimeout(function () {
    card1.parentElement.style.transform = "rotateY(0deg)";
    card2.parentElement.style.transform = "rotateY(0deg)";
    numSelected = 0;
  }, 1000);
}


function updateLowScore() {
  if (lowScore === 0 || score < lowScore) {
    localStorage.setItem("low-score", JSON.stringify({ "lowScore": score }));
    lowScoreCard.innerText = `Low score: ${score}`
  }
}


function randomRGB() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
}


function generateRandomColors(pairs, array) {
  for (let i = 0; i < pairs; i++) {
    let color = randomRGB();
    array.push(color);
    array.push(color);
  }
  return array;
}



// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}



// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {

    // create divs for front and back of cards, and flipper divs
    const front = document.createElement("div");
    const back = document.createElement("div");
    const flipper = document.createElement("div");
    const flipContainer = document.createElement("div");

    //add classes
    front.classList.add("front");
    front.classList.add(color);

    back.classList.add("back");
    back.classList.add(color);
    // add color to the back of the card
    back.style.backgroundColor = color;

    flipper.classList.add("flipper");
    flipper.addEventListener("click", handleCardClick);


    flipContainer.classList.add("flip-container");

    // store the front and back side of a card in the flipper div
    flipper.append(front);
    flipper.append(back);

    // store the flipper inside a flip-container
    flipContainer.append(flipper);

    gameContainer.append(flipContainer);
  }
}

function createDivsForGifs(gifArray) {
  for (let gif of gifArray) {

    // create divs
    const front = document.createElement("div");
    const back = document.createElement("div");
    const flipper = document.createElement("div");
    const flipContainer = document.createElement("div");
    const hiddenGif = document.createElement("img");
    hiddenGif.src = gifObj[gif];

    //add classes
    front.classList.add("front");
    front.classList.add(gif);
    back.classList.add("back");
    back.classList.add(gif);

    //add gif to the back of the card
    back.append(hiddenGif);

    flipper.classList.add("flipper");
    flipper.addEventListener("click", handleCardClick);

    flipContainer.classList.add("flip-container");

    flipper.append(front);
    flipper.append(back);

    flipContainer.append(flipper);

    gameContainer.append(flipContainer);

  }
}


function handleCardClick(event) {
  // check if game is in progress, and make sure the selected card isn't already matched
  if (inProgress && !(event.target.parentElement.classList.contains("matched"))) {
    numSelected++;
    if (numSelected <= 2) {
      if (event.target.classList.contains("matched")) {
        console.log()
      }
      previousCard = currentCard;
      previousColor = previousCard.classList;
      currentCard = event.target;
      currentColor = currentCard.classList;
      currentCard.parentElement.style.transform = "rotateY(180deg)";
    }

    if (numSelected === 2 && currentCard != previousCard) {
      score++;
      scoreCard.innerText = (`Score: ${score}`);
      if (currentColor.value === previousColor.value) {
        matchesMade++;
        currentCard.parentElement.classList.add("matched");
        previousCard.parentElement.classList.add("matched");
        if (matchesMade === 5) {
          updateLowScore();
        }
        numSelected = 0;
      } else {
        resetCards(currentCard, previousCard);
      }
      // ELSE CASE prevents user from modifying the score by clicking the same card twice 
    } else {
      previousCard = "";
      numSelected = 1;
    }
  }
}

// when the DOM loads
restoreLowScore();