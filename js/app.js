/*
I used a variety of sources to get started on The Memory Game project, most of them are listed
on this [resource] (https://www.diigo.com/outliner/fii42b/Udacity-Memory-Game-Project?key=dwj0y5x9cw)
taken from the FEND Slack channel. Matthew Cranford's walkthrough was particularly helpful as
was Sandra Israel-Ovirih's Scotch.io [tutorial] (https://scotch.io/tutorials/how-to-build-a-memory-matching-game-in-javascript).
*/

/*
 * Create a list that holds all of your cards
 */
 //HTMLCollection(16) of all cards => it looks like an array
let card = document.getElementsByClassName("card");
// console.log(card);

//array of all cards - USE THE ARRAY??
let cardDeck = [...card];
// console.log(cardDeck);

//unordered list of all cards => ul of li's each containing an item which is the icon
let deck = document.querySelector(".deck");
// console.log(deck);

let shuffledCards = shuffle(cardDeck);
// console.log(shuffledCards);

//arrays to hold open and matched cards
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

//repeat icon in the score panel inside the restart <div>
// let restart = document.getElementsByClassName("restart");
let restart = document.querySelector(".fa-repeat");

//congratulations gameEnd modal
let modal =  document.querySelector(".modal");

//get span that closes the modal => grabs the X
let closeModal = document.querySelector(".close");

//replay button in modal
let button = document.querySelector(".replay");

//reset game when the document loads
document.body.onload = resetGame();

//getElementsByClassName vs querySelector && querySelectorAll

//start game timer
function startTime() {
    //setInterval method calls a function or evaluates an expression at specified intervals (milliseconds)
    interval = setInterval(function () {
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

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
//shuffle the card deck
function shuffleCardDeck() {
    let shuffledCards = shuffle(cardDeck);
      for(card of shuffledCards) {
        //cannot use =>  cardDeck. Uncaught TypeError: cardDeck.appendChild is not a function
        deck.appendChild(card);
      }
      console.log("everyday I'm shuffling!");
  }

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
//forEach() loops through cardDeck array and applies anonymous function to each card
cardDeck.forEach(function(card) {
    card.addEventListener("click", function(event)  {
      let clickTarget = event.target;
      //time starts accelerating after 3rd click by 2 secs at a time, why?
      // startTime();
      if (!clickTarget.classList.contains("match") && openCards.length < 2) {
        displayCard(clickTarget);
        addOpenCard(clickTarget);
      if (openCards.length === 2) {
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
}

//Do cards in openCards array match?
function isMatch() {
    if (openCards[0].firstElementChild.className === openCards[1].firstElementChild.className) {
      doesMatch();
  } else {
      doesNotMatch();
  }
};

//if cards in openCards array match => push matched cards into matchedCards array
function doesMatch() {
    openCards[0].childNodes[1].classList.toggle("match", true);
    openCards[1].childNodes[1].classList.toggle("match", true);
    openCards[0].classList.toggle("match", true);
    openCards[1].classList.toggle("match", true);
    openCards[0].childNodes[1].setAttribute("disabled", true);
    openCards[1].childNodes[1].setAttribute("disabled", true);
    openCards[0].setAttribute("disabled", true);
    openCards[1].setAttribute("disabled", true);
    matchedCards.push.apply(matchedCards, openCards);
    openCards = [];
    //TODO Why isn't removeEventListener() working?
    /*cardDeck.forEach(function(card) {
          card.removeEventListener("click", function(event)  {
            let clickTarget = event.target;
            //time starts accelerating after 3rd click by 2 secs at a time, why?
            // startTime();
            addOpenCard(clickTarget);
          });
      });*/
}

//if cards in openCards array do not match
function doesNotMatch() {
    openCards[0].classList.toggle("no-match");
    openCards[1].classList.toggle("no-match");
      setTimeout(function() {
        displayCard(openCards[0]);
        displayCard(openCards[1]);
        openCards[0].classList.toggle("no-match");
        openCards[1].classList.toggle("no-match");
        openCards = [];
      }, 1000);
  }

//count number of moves and star visibility
function countMoves() {
    moves++;
    moveCounter.innerHTML = moves;
    if (moves === 1) {
      //time does not accelerate when startTime function is activated here, why?
      startTime();
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
function gameEnd() {
    if (matchedCards.length === 16 ) {
      stopTime();
      let finalTime = "Total time " + timer.innerHTML;
      let finalMoves = "You finished the game in " + moveCounter.innerHTML + " moves";
      let finalStars = "Star rating: " + " " + starCount.innerHTML;
      //
      document.getElementById("final-moves").innerHTML = finalMoves;
      document.getElementById("final-time").innerHTML = finalTime;
      document.getElementById("final-stars").innerHTML = finalStars;
      //Show final stats
      modal.classList.toggle("show");
      modal.style.display = "block";
  }
}

//clear game board and reset everything
function resetGame() {
    shuffleCardDeck();
    resetTime();
    moves = 0;
    moveCounter.innerHTML = moves;
    matchedCards = [];
    openCards = [];
    for (card of shuffledCards) {
      card.classList.remove("match", "open", "show", "no-match", "disabled");
  } for (i = 0; i < 3; i++) { //reset stars
      stars[i].style.visibility = "visible";
  }
    modal.style.display = "none";
}

//get span that closes the modal
//TODO Compare with closeModal variable. Eliminate one of them
let modalClose = document.getElementsByClassName("close");

//restart icon in score panel resets game
restart.addEventListener("click", resetGame, false);

//user clicks on <span> X, to close the modal & reset the game
closeModal.addEventListener("click", resetGame, false);

//close modal and reset game when user clicks on replay button
button.onclick = function() {
  resetGame();
  modal.style.display = "none";
}
