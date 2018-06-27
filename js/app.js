/*
 * Create a list that holds all of your cards
 */
//array of all cards in the game
let card = document.getElementsByClassName("card");

let cardDeck = [...card];

let deck = document.querySelector(".deck");
let shuffledCards = shuffle(cardDeck);

let openCards = [];
let matchedCards = [];

let moves = 0;
let moveCounter = document.querySelector(".moves");

let stars = document.querySelectorAll(".stars li");
let starCount = document.querySelector(".stars");

//game timer variables
let timer = document.querySelector("#timer");
let second = 0;
let minute = 0;
let hour = 0;
let interval;

let restart = document.getElementsByClassName("restart")[0];

let modal =  document.querySelector(".modal"); //document.getElementById("modal"); => does not work, why?
let closeModal = document.querySelector(".close");
let button = document.querySelector(".replay");


//start game timer
function startTime() {
    interval = setInterval(function () {        //setInterval method calls a function or evaluates an expression at specified intervals (in milliseconds).
    timer.innerHTML = minute + " mins " + second + " secs";
    second++;
    if (second === 60) {
      minute++;
      second = 0;
    }
    if (minute === 60) {
      hour++;
      console.log("This game should NOT take an hour!");
      minute = 0;
    }
  }, 1000);
}

//stop game timer
function stopTime() {
  clearInterval(interval);
}

//reset game timer
function resetTime() {
  clearInterval(interval);  //clearInterval stops the setInterval method (or close the window)
  second = 0;
  minute = 0;
  hour = 0;
  timer.innerHTML = minute + " mins " + second + " secs";
}

restart.onclick = function() {
  resetGame();
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
//shuffle the card deck
function shuffleCardDeck() {
   console.log("everyday I'm shuffling!");
   for(card of shuffledCards) {
     deck.appendChild(card);
   }
 }
shuffleCardDeck();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
     var currentIndex = array.length, temporaryValue, randomIndex;

     while (currentIndex !== 0) {
         randomIndex = Math.floor(Math.random() * currentIndex);
         currentIndex -= 1;
         temporaryValue = array[currentIndex];
         array[currentIndex] = array[randomIndex];
         array[randomIndex] = temporaryValue;
     }

     return array;
 }

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
//setting up event listeners
cardDeck.forEach(function(card) {                 //forEach() loops through cardDeck array and applies anonymous function to each card
    card.addEventListener("click", function(event)  {
      let clickTarget = event.target;
      // startTime();   //time starts accelerating after 3 or 4th click by 4 secs at a time, why?
      if (!clickTarget.classList.contains("match") && openCards.length < 2 && !openCards.includes(clickTarget)) {
        displayCard(clickTarget);
        addOpenCard(clickTarget);
        if (openCards.length === 2) {
          console.log("2 cards only!");
          isMatch();
          countMoves();
          gameEnd();
        }
      }
    });
});

//Display the cards symbol
// toggle card function - display the card's symbol
function displayCard (clickTarget) {
     clickTarget.classList.toggle("open");
     clickTarget.classList.toggle("show");
}

// add card to array of open cards
function addOpenCard(clickTarget) {
    openCards.push(clickTarget);
    console.log(openCards);  //This is a simple functionality test -> remove this line before submitting project
}

//Do cards in openCards array match?
function isMatch() {
  if (openCards[0].firstElementChild.className === openCards[1].firstElementChild.className) {
    doesMatch();
  } else {
    doesNotMatch();
  }
};

//if cards in openCards array do match
function doesMatch() {
      openCards[0].classList.toggle("match");
      openCards[1].classList.toggle("match");
      matchedCards.push(openCards[0,1]);
      console.log(matchedCards);
      openCards = [];
      console.log("Sweet Matching!");
}

//if cards in openCards array do not match
function doesNotMatch() {
      setTimeout(function() {
      console.log("Better luck next time!");
      displayCard(openCards[0]);
      displayCard(openCards[1]);
      openCards = [];
    }, 1000);
  }

function countMoves() {
  moves++;
  moveCounter.innerHTML = moves;
  if (moves === 1) {
    startTime(); //time does not randomly accelerate when startTime function is activated here, why?
  }
  if (moves > 10 && moves < 14) {
    for (i = 0; i < 3; i++) {
      if(i > 1) {
        stars[i].style.visibility = "collapse";
      }
    }
  } else if (moves > 14) {
      for (i = 0; i < 3; i++) {
        if (i > 0) {
          stars[i].style.visibility = "collapse";
        }
      }
    }
  }

//stop timer and end game when all cards are matched
function gameEnd () {
  if (matchedCards.length === 8 ) {
    stopTime();
    finalTime = "Total time " + timer.innerHTML;
    finalMoves = "You finished the game in " + moveCounter.innerHTML + " moves";
    finalStars = "Star rating: " + " " + starCount.innerHTML;
    //
    document.getElementById("final-moves").innerHTML = finalMoves;
    document.getElementById("final-time").innerHTML = finalTime;
    document.getElementById("final-stars").innerHTML = finalStars;
    //Show final stats
    modal.classList.toggle("show");
    modal.style.display = "block";
  }
}

function resetGame() {
  shuffleCardDeck();

  for (card of shuffledCards) {
    card.classList.remove("match", "open", "show");
  }

  matchedCards = [];
  resetTime();
  moves = 0;
  moveCounter.innerHTML = moves;
  //reset stars
  for (i = 0; i < 3; i++) {
    stars[i].style.visibility = "visible";
  }
  modal.style.display = "none";
}

//get span that closes the modal
let modalClose = document.getElementsByClassName("close")[0];

//user clicks on <span> X, to close the modal
modalClose.onclick = function() {
  modal.style.display = "none";
  resetGame();
  // clearInterval(interval);
}

//close modal and reset game when user clicks on replay button
button.onclick = function() {
  resetGame();
}
