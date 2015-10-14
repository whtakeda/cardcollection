var $board;
var deckSize = 52;			// number of cards total (numsuits*numInSuits)
var numSuits = 4;			// number of different suits
var numInSuits = 13;		// number of different values in each suit
var difficulty = "easy";
var selAry = []; 			// push any cards that have been selected onto this stack so you can track them to turn them back over if needed
var game = "memory";
var p1Score = 0;			// single game score
var p2Score = 0;			// single game score
var p1Total = 0;			// total wins for all games
var p2Total = 0;			// total wins for all games
//var facedownClr = "#765e65";
var facedownClr = "rgb(165, 221, 227)";
var faceupClr = "#ffffff";
var facedownImg;
var selectedClr = "#fcfc00";// the background color for a card that is selected
var p1Turn = true;
var allowTies = true;		// for now this will always be true, but want to add logic to allow it to be false later
var raceEndTime;
var raceStartTime;
var raceTimer;
var whackTimer;
var whackInterval = 5000;	// initial time to whack in milliseconds
var gameStart = 0;			// used for timed games to determine how long the player took
var gameEnd = 0;			// used for timed games to determine how long the player took
var gameOn = false;
var deck = [];				// array for storing cards
var board = [];				// array for modeling game board
var player1 = "Player 1";
var player2 = "Player 2";
var currPlayer = "";
var complimentAry = ["Good job!", "You're doing great!", "Meh.", "Way to go!", "Awwww yeahhhhhhhhhh!"]
var mmAry = [];				// array for storing mastermind cards that player has to try and match
var mmSelAry = ["","","",""];			// array for storing player's picks for mastermind
//var mmNumTries = 0;			// number of turns a player has taken so far;
//var mmMaxTries = 10;
var mmLength = 4;			// number of cards player has to guess in mastermind
var cardBackAry = [ "url(/images/design1.jpg", "url(/images/design5.jpg)", "url(/images/design3.jpg)","url(/images/design4.jpg"];

facedownImg = cardBackAry[0];

$board = $('#board');
$('.card').on("click", this, function(evt){ clickCard(this); });
$('#difficulty').on("change", this, function(evt){ difficulty = this.value; switchGame();})
$('#deckdesign').on("change", this, function(evt){ facedownImg = cardBackAry[this.value]; changeDeckDesign(); })
$('#game').on("change",this, function(evt){ game = this.value; switchGame(); });
$('#guess').on("click",this, function(evt){ guessMastermind(); });
$('#reset').on("click", this, function(evt) { resetGame(); });
$('#demo').on("change", this, demoMode);
$('#modalbutton').on("click", this, function (){
	el = document.getElementById("myalert");
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
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
	this.img = "url(/images/" + suit + "-" + name + ".png)"
	this.direction = direction		// down or up (facedown or faceup) - currently not used.  keep here for now b/c might be using it later
}

function demoMode()
{
	var i;

	if ($('#demo').is(":checked"))
	{
		for (i=0; i<deckSize; i++)
		{
			document.getElementById(i+1).style.color = deck[board[i]].clr;
			document.getElementById(i+1).innerHTML = deck[board[i]].val	// this line for debugging only
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
		console.log("Here")
		if ($('#' + i).css("background-color") === facedownClr)
		{
			$('#' + i).css("background-image", facedownImg);
		}
	}
}

function randomCompliment()
{
	var rnd;

	rnd = Math.floor(Math.random()*5);
	return complimentAry[rnd];
}

function updateStatus()
{
	var str;
	str = 'Player 1 score: ' + p1Score + '<br>Player 2 score: ' + p2Score + '<br>Player 1 win total: ' + p1Total + '<br>Player 2 win total: ' + p2Total + '<br>';
	$('#score').html(str);
}

function updateMessage(msg)
{
	$('#messages').html(msg);
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
		$(evt).css({"background-image": deck[board[idx]].img})
		$(evt).css({"background-color": faceupClr})
	}
	else
	{
		$(evt).css({"background-image": facedownImg});
		$(evt).css({"background-color": facedownClr});
	}
	return;
}

function clickCard(evt)
{
	switch (game)
	{
		case "memory":
			playMemory(evt);
			break;
		case "whack":
			checkWhackStatus(evt);
			break;
		case "raceclock":
			// game doesn't start until first card is clicked
			if (!gameOn)
			{
				gameOn = true;
				gameStart = Date.now();
				raceStartTime = new Date;

				raceTimer = setInterval(function() {
							raceEndTime = new Date;
    						$('#timer').text(((raceEndTime - raceStartTime)/1000).toFixed(1) + " Seconds");
							}, 100);
			}
			playRaceClock(evt);
			break;
		case "mastermind":
			break;
		case "cardsearch":
			break;
	}
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {

	if (game != "mastermind") { return; }
    ev.originalEvent.dataTransfer.setData("text", ev.target.id);
}


function drop(ev) {
	var crd;
	ev.preventDefault();
    var data = ev.originalEvent.dataTransfer.getData("text");
//    ev.target.appendChild(document.getElementById(data));

	// space is already filled, then switch cards
	// if space is not filled, make sure card is not already selected and disallow if it is
	// otherwise just drop it in

	var filled = false;
	var evt = $('#'+data);	
	if (filled)
	{

	}
	else
	{
		if (playMastermind(evt.attr("id")-1,ev.target.id[2]-1))
		{
			ev.target.style.backgroundImage = document.getElementById(data).style.backgroundImage;
			ev.target.style.backgroundColor = document.getElementById(data).style.backgroundColor;
		}
		else
		{
//			alert("you already selected that card");
		}
	}

}

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
	p1Turn = true;
	$('#timer').html("");

	switch (game)
	{
		case "memory":
			dir = "down";
			gameOn = true;
			$('#start').attr("disabled", true)
			$('#guess').attr("disabled", true)
			$('#difficulty').attr("disabled",false)
			switch (difficulty)
			{
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
			$('#difficulty').val("normal");
			$('#difficulty').attr("disabled",true)
			difficulty = $('#difficulty').val();
			random = false;
			msg = "Drag and drop 4 cards to the boxes at the bottom then click 'Guess'.  You will be told if your card is an exact match or if it partially matches based on color, value, or suit.  To change cards, drag and drop another card on top of your existing selection."
			$('#start').attr("disabled", true)
			$('#guess').attr("disabled", false);
			break;
		case "raceclock":
			msg = "Click any card to start game.  Arrange the cards by value and suit from left to right starting with the ace.  Click any two cards to swap their position.";
			dir = "up";
			gameOn = false;
			$('#difficulty').val("normal");
			$('#difficulty').attr("disabled",true)
			difficulty = $('#difficulty').val();
			$('#start').attr("disabled", false)
			$('#guess').attr("disabled", true)
			break;
		case "cardsearch":
			dir = "down";
			gameOn = true;
			$('#start').attr("disabled", true)
			$('#guess').attr("disabled", true)
			$('#difficulty').attr("disabled",false)
			break;
		case "whack":
			dir = "down";
			gameOn = true;
			msg = "Click the start button to begin.  Click on cards as they turn over to score a point"
			$('#start').attr("disabled", false)
			$('#guess').attr("disabled", true)
			$('#difficulty').attr("disabled",false)
			switch (difficulty) 
			{
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
	initializeBoard(dir, random);
}

// clean up the board and the game data when switching between games
function switchGame()
{
	// right now this is the only action to perform when switching games
	resetGame();
}

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
			crd = new card(name,suit,j+1,color,i*13+j+1,"down");
//			console.log(i*13+j+1)
			deck.push(crd);
		}
	}
}

// assigns cards randomly to board and turns all cards facedown;
function initializeBoard(cardDir, random)
{
	var rnd;
	var i,j;
	var ary = [];	// used to track which slots on board have already been filled when initializing

	board = [];
	for (i=0;i<deckSize;i++)
	{
		ary.push(false);
	}

	for (i=0; i<deckSize; i++)
	{
		// initializes the board randomly or in order
		if (random)
		{
			rnd = Math.floor((Math.random()*52));
			while (ary[rnd] == true)
			{	
				rnd = Math.floor((Math.random()*52));
			}
		}
		else
		{
			rnd = i;
		}
		ary[rnd] = true;
		deck[rnd].boardpos = i;
		board.push(rnd);
		flipCard(i, cardDir);
		$('#' + (i+1)).attr("draggable","true");
		$('#' + (i+1)).on("dragstart", this, drag);

	}
	// PULL THIS LINE OUT LATER.  ONLY LEAVE IT HERE FOR DEBUGGING RIGHT NOW!!!!!!!!!!!!!!!!!!!
	demoMode();
	/////////////////////////////////////////////////////////////////////////////////////

	for (i=1; i<=4; i++)
	{
		$('#mm' + i).on("drop", this, drop);
		$('#mm' + i).on("dragover", this, allowDrop);
	}
}

initializeDeck();
initializeBoard("down", true);


