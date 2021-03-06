//var $board;
var deckSize = 52;			// number of cards total (numsuits*numInSuits)
var numSuits = 4;			// number of different suits
var numInSuits = 13;		// number of different values in each suit
var difficulty = "hard";
var game = "memory";
var p1Score = 0;			// single game score
var p2Score = 0;			// single game score
var p1Total = 0;			// total wins for all games
var p2Total = 0;			// total wins for all games
var facedownClr = "rgb(165, 221, 227)";
var faceupClr = "#ffffff";
var facedownImg;
var selectedClr = "#ffff00";// the background color for a card that is selected
var p1Turn = true;
var allowTies = true;		// for now this will always be true, but want to add logic to allow it to be false later
var gameOn = false;
var deck = [];				// array for storing cards
var board = [];				// array for modeling game board
var complimentAry = ["Good job!", "You're doing great!", "Meh.", "Way to go!", "Awwww yeahhhhhhhhhh!"]
var selAry = []; 			// push any cards that have been selected onto this stack so you can track them to turn them back over if needed
var cardBackAry = [ "url(images/pc-default.png)", "url(images/pc-dean.png)", "url(images/pc-ezra.png)","url(images/pc-jim.png)","url(images/pc-phil.png)"];

/********* game-specific variables *********/

// race the clock variables
var raceEndTime;
var raceStartTime;
var raceTimer;
var raceClockStarted = false;
// whack-a-card variables
var whackTimer;
var whackInterval = 5000;	// initial time to whack in milliseconds
var gameStart = 0;			// used for timed games to determine how long the player took
var gameEnd = 0;			// used for timed games to determine how long the player took

// masterminder variables
var mmAry = [];				// array for storing mastermind cards that player has to try and match
var mmSelAry = ["","","",""];			// array for storing player's picks for mastermind


facedownImg = cardBackAry[0];

//$board = $('#board');
$('.card').on("click", this, function(evt){ clickCard(this); });
$('#difficulty').on("change", this, function(evt){ switchDifficulty(this); resetGame();})
$('#deckdesign').on("change", this, function(evt){ facedownImg = cardBackAry[this.value]; changeDeckDesign(); })
$('#game').on("change",this, function(evt){ game = this.value; switchGame(); });
$('#guess').on("click",this, function(evt){ makeGuessMM(); });
$('#reset').on("click", this, function(evt) { resetGame(); });
$('#demo').on("change", this, demoMode);
$('#modalbutton').on("click", this, function (){
	el = document.getElementById("myalert");
	el.style.visibility = (el.style.visibility === "visible") ? "hidden" : "visible";
});

// position is positinon in deck from 1-52
// used is a boolean to indicate the card has been inserted into the board
var card = function(name,suit,value,color,deckpos,direction)
{
	this.cname = name;
	this.suit = suit;
	this.val = value;
	this.clr = color;
	this.deckpos = deckpos; 		// position in deck array
	this.boardpos = 0;				// position on board; always 0 to start; gets set when board is initialized
	this.img = "url(images/" + suit + "-" + name + ".png)"
	this.direction = direction		// down or up (facedown or faceup) - currently not used.  keep here for now b/c might be using it later
}

function demoMode()
{
	var i;

	if ($('#demo').is(":checked"))
	{
		for (i=0; i<deckSize; i++)
		{
//			document.getElementById(i+1).style.color = deck[board[i]].clr;
			document.getElementById(i+1).innerHTML = deck[board[i]].val	+ deck[board[i]].suit[0];
		}
	}
	else
	{
		for (i=0; i<deckSize; i++)
		{
			document.getElementById(i+1).innerHTML = "";
		}
	}
}

function myAlert(str) 
{
	var el;
	var el2;

	$('#myalertcontent').html(str);

	el = document.getElementById("myalert");
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}

function changeDeckDesign()
{
	var i;

	for (i=1; i<=deckSize; i++)
	{
		if ($('#' + i).css("background-color") === facedownClr)
		{
			changeBgImage('#' + i,facedownImg)
		}
	}
}

function randomCompliment()
{
	var rnd;

	rnd = Math.floor(Math.random()*5);
	return complimentAry[rnd];
}

function changeBgColor(elId,clr)
{
	console.log(clr)
	$(elId).css("background-color",clr);
}

function changeBgImage(elId,img)
{
	$(elId).css("background-image",img);
}

function updateStatus()
{
	var str;
	str = 'Player 1 score: ' + p1Score + '<br>Player 2 score: ' + p2Score + '<br>Player 1 total wins: ' + p1Total + '<br>Player 2 total wins: ' + p2Total + '<br>';
	$('#score').html(str);
}

function updateMessage(msg)
{
	$('#messages').html(msg);
}

// assumes score is always a numeric value
function determineWinner(condition)
{
	var str;
	var score1 = parseFloat(p1Score);
	var score2 = parseFloat(p2Score);

	if (score1 === score2)
	{
		str = "Game over.  The game is a tie."
	}
	else if (condition === "highest")
	{
		if (score1 > score2)
		{
			p1Total++;
			str = "Game over. Player 1 is the winner!";
		}
		else if (score1 < score2)
		{
			p2Total++;
			str = "Game over.  Player 2 is the winner";
		}
	}
	else
	{
		if (score1 < score2)
		{
			p1Total++;
			str = "Game over. Player 1 is the winner!";
		}
		else if (score1 > score2)
		{
			p2Total++;
			str = "Game over.  Player 2 is the winner";
		}
	}
	return str;
}

function clearScores()
{
	p1Score = (p2Score = 0);
}

// return a string of whose turn it is
function playerTurn()
{
	if (p1Turn)
	{
		return "Player 1's turn";
	}
	else
	{
		return "Player 2's turn";
	}
}

function flipCard(idx,dir)
{
	var evt = "#" + (idx+1);

	if (dir === "up")
	{
//		$(evt).css({"background-image": deck[board[idx]].img});
//		$(evt).css({"background-color": faceupClr});
		changeBgImage(evt,deck[board[idx]].img);
		changeBgColor(evt,faceupClr);
		deck[idx].direction = "up";
	}
	else
	{
//		$(evt).css({"background-image": facedownImg});
//		$(evt).css({"background-color": facedownClr});
		changeBgImage(evt,facedownImg);
		changeBgColor(evt,facedownClr);
		deck[idx].direction = "down";
	}
	return;
}

function clickCard(evt)
{
	switch (game)
	{
		case "memory":
			if (!gameOn) { myAlert("Hey click the reset button if you want to play again!"); return; }
			playMemory(evt);
			break;
		case "whack":
			if (!gameOn) { myAlert("Hey click the reset button if you want to play again!"); return; }
			checkWhackStatus(evt);
			break;
		case "raceclock":
			// do nothing for now but leave this as a placeholder for future development
			break;
		case "mastermind":
			// do nothing for now but leave this as a placeholder for future development
			break;
		case "cardsearch":
			// do nothing for now but leave this as a placeholder for future development
			break;
	}
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.originalEvent.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
	var crd;
	ev.preventDefault();
    var data = ev.originalEvent.dataTransfer.getData("text");
	var filled = false;
	var evt = $('#'+data);	
	var evt1, evt2;

	// space is already filled, then switch cards
	// if space is not filled, make sure card is not already selected and disallow if it is
	// otherwise just drop it in

	if (game === "mastermind")
	{
		if (playMastermind(evt.attr("id")-1,ev.target.id[2]-1))
		{
			ev.target.style.backgroundImage = document.getElementById(data).style.backgroundImage;
			ev.target.style.backgroundColor = document.getElementById(data).style.backgroundColor;
		}
	}
	else if (game === "raceclock")
	{
		// disallow move if player tries to drop card onto mm card slots
		if (ev.target.id.indexOf("mm") >= 0) { return; }
		if (!gameOn) { myAlert("Hey click the reset button if you want to play again!"); return; }

		// game doesn't start until first card is clicked
		if (!raceClockStarted)
		{
			raceClockStarted = true;
			gameStart = Date.now();
			raceStartTime = new Date;

			raceTimer = setInterval(function() {
						raceEndTime = new Date;
   						$('#timer').text("Elapsed time:" + ((raceEndTime - raceStartTime)/1000).toFixed(1) + "s");
						}, 100);
		}

		evtSrc = evt.attr("id")-1; 
		evtDest = ev.target.id-1;

		playRaceClock(evtSrc, evtDest);
	}
}

//  resets all variables back to intial values (execept totals wins for each player), i.e. to the values they had when the page was loaded
function resetGame()
{
	var msg = "";
	var random = true;
	var i;

	clearTimeout(whackTimer);
	clearInterval(raceTimer);
	selAry = [];
	mmAry = [];
	mmSelAry.forEach(function(el,idx,ary) { ary[idx] = "" });
	clearMMBoard();
	clearScores();
	updateStatus();
	raceClockStarted = false;
	p1Turn = true;
	$('#timer').html("");

	switch (game)
	{
		case "memory":
			dir = "down";
			gameOn = true;
			$('#start').attr("disabled", true)
			$('#guess').attr("disabled", true)
			switch (difficulty)
			{
				case "megaeasy":
				case "easy":
					msg = "Select any card to start the game<br>Match any 2 cards by value to make a match<br>" + playerTurn();
					break;
				case "normal":
					msg = "Select any card to start the game<br>Match any 2 cards by value and color to make a match<br>" + playerTurn();
					break;
				case "hard":
					msg = "Select any card to start the game<br>Match all 4 cards by value to make a match<br>" + playerTurn();
					break;
			}
			break;
		case "mastermind":
			dir = "up";
			gameOn = true;
			initializeMastermind();
			random = false;
			msg = "The computer has pre-selected 4 cards.  Drag and drop 4 cards to the boxes at the bottom then click 'Guess'.  You will be told if your card is an exact match or if it partially matches based on color, value, or suit.  To change cards, drag and drop another card on top of your existing selection."
			$('#start').attr("disabled", true)
			$('#guess').attr("disabled", false);
			break;
		case "raceclock":
			msg = "Swap any 2 cards to start game.  Arrange cards by value and suit from left to right starting with the ace.  Order of suits does not matter.";
			dir = "up";
			gameOn = true;
			$('#start').attr("disabled", true)
			$('#guess').attr("disabled", true)
			break;
		case "whack":
			dir = "down";
			gameOn = true;
			msg = "Click the start button to begin.  Click on cards as they turn over to score a point"
			$('#start').attr("disabled", false)
			$('#guess').attr("disabled", true)
			switch (difficulty) 
			{
				case "megaeasy":
					whackInterval = 10000;
					break;
				case "easy":
					whackInterval = 8000;
					break;
				case "normal":
					whackInterval = 5000;
					break;
				case "hard":
					whackInterval = 3000;
					break;
			}
			$('#start').off();
			$('#start').on("click",this, startWhackTimer);
	}
	updateMessage(msg);
	randomizeBoard(dir, random);
}

// clean up the board and the game data when switching between games
function switchGame()
{
	// right now this is the only action to perform when switching games
	resetGame();
}

function switchDifficulty(this1)
{
	difficulty = this1.value;
	switch (difficulty)
	{
		case "megaeasy":
			numInSuits = 4;
			deckSize = 16;
			break;
		case "easy":
			numInSuits = 8;
			deckSize = 32;
			break;
		case "normal":
			numInSuits = 10;
			deckSize = 40;
			break;
		case "hard":
			numInSuits = 13;
			deckSize = 52;
			break;
	}
	redrawBoard();
}

// populate the deck data object with card data
function initializeDeck()
{
	for (var i=0; i<numSuits; i++)
	{
		for (var j=0; j<numInSuits; j++)
		{
			switch (i)
			{
				case 0:
					suit = "hearts";
					color = "red";
					break;
				case 1:
					suit = "spades";
					color = "black";
					break;
				case 2:
					suit = "diamonds";
					color = "red";
					break;
				case 3:
					suit = "clubs";
					color = "black";
					break;
			}

			switch (j)
			{
					case 0: name="ace"; break;
					case 1: name="two"; break;
					case 2: name="three"; break;
					case 3: name="four"; break;
					case 4: name="five"; break;
					case 5: name="six"; break;
					case 6: name="seven"; break;
					case 7: name="eight"; break;
					case 8: name="nine"; break;
					case 9: name="ten"; break;
					case 10: name="jack"; break;
					case 11: name="queen"; break;
					case 12: name="king"; break;
			}
			crd = new card(name,suit,j+1,color,i*numInSuits+j+1,"down");
			deck.push(crd);
		}
	}
}

// assigns cards randomly to board and turns all cards facedown;
// board stores the card index only, not the actual card
// this is called every time the values on the board need to be randomized again
function randomizeBoard(cardDir, random)
{
	var rnd;
	var i,j;
	var ary = [];	// used to track which slots on board have already been filled when initializing
//cardDir = "up"
	board = [];
	for (i=0;i<52;i++)
	{
		ary.push(false);
	}

	j = 0;

	for (i=0; i<deckSize; i++)
	{
		// initializes the board randomly or in order
		if (random)
		{
			rnd = Math.floor((Math.random()*52));
			// this skips the cards that are not in use to make sure they are not loaded into the board
			while ((ary[rnd] == true) ||  (deck[rnd].val > numInSuits))
			{	
				rnd = Math.floor((Math.random()*52));
			}
		}
		else
		{	
			// this is because all the cards are loaded into the deck whether or not they are used on the board
			// this skips the cards that are not in use to make sure they are not loaded into the board
  			while (deck[i+j].val > numInSuits) { j++; }
			rnd = i+j;
		}
		ary[rnd] = true;
		deck[rnd].boardpos = i;
		board.push(rnd);
		flipCard(i, cardDir);

	}
	// PULL THIS LINE OUT LATER.  ONLY LEAVE IT HERE FOR DEBUGGING RIGHT NOW!!!!!!!!!!!!!!!!!!!
//	demoMode();
	/////////////////////////////////////////////////////////////////////////////////////
}

// this will redraw the board when it gets resized (e.g 4x8, 4x10, or 4x13)
// also reattaches event handlers when elements get re-created
function redrawBoard()
{
	var i,j;
	var str = "";
	var cnt=1;

	$('#board').html("");
	for (i=1; i<=numSuits; i++)
	{
		for (j=1; j<=numInSuits; j++)
		{
			str += '<div class="card" id="' + (cnt++) + '"></div>\r';
		}
		str += '<div class="div-clear"></div>';
	}
	$('#board').append(str);
	$('.card').on("click", this, function(evt){ clickCard(this); });


	for (i=1; i<=deckSize; i++)
	{
		$('#' + i).attr("draggable","true");
		$('#' + i).on("dragstart", this, drag);

		$('#' + i).on("drop", this, drop);
		$('#' + i).on("dragover", this, allowDrop);
	}
}

// this should be called once when the page is loaded.
function initializeGame()
{
	var i;

	for (i=1; i<=4; i++)
	{
		$('#mm' + i).on("drop", this, drop);
		$('#mm' + i).on("dragover", this, allowDrop);

		$('#mm' + i).attr("draggable","true");
		$('#mm' + i).on("dragstart", this, drag);

	}

}