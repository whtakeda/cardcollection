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
var facedownClr = "#765e65";
var faceupClr = "#ffffff";
var facedownImg = "url(/images/tictac-minion.png)";
var selectedClr = "#c0c0c0";// the background color for a card that is selected
var p1Turn = true;
var allowTies = true;		// for now this will always be true, but want to add logic to allow it to be false later
var whackTimer;
var whackInterval = 5000;	// initial time to whack in milliseconds
var gameStart = 0;			// used for timed games to determine how long the player took
var gameEnd = 0;			// used for timed games to determine how long the player took
var gameOn = false;
var demoMode = true;
var deck = [];				// array for storing cards
var board = [];				// array for modeling game board
var player1 = "Player 1";
var player2 = "Player 2";
var mmAry = ["","","",""];				// array for storing mastermind cards that player has to try and match
var mmSelAry = ["","","",""];			// array for storing player's picks for mastermind

$board = $('#board');
$board.on("click","div",function(evt){clickCard(this);});

$('#difficulty').on("change", this, function(evt){ difficulty = this.value; switchGame();})
$('#game').on("change",this, function(evt){ game = this.value; switchGame(); })
$('#guess').on("click",this, function(evt){ guessMastermind(); })





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

function updateStatus()
{
	$('#score').html('Player 1 score: ' + p1Score + '<br>Player 2 score: ' + p2Score + '<br>Player 1 win total: ' + p1Total + '<br>Player 2 win total: ' + p2Total);
}

function updateMessage(msg)
{
	$('#messages').html(msg);
}

function clearScores()
{
	p1Score = (p2Score = 0);
}
/*
function flipCard(evt,dir)
{
	var idx;

	idx = $(evt).attr("id")-1;	// id goes from 1-52 but idx goes from 0-51
	if (dir === "up")
	{
		$(evt).css({"background-image": board[idx].img})
		$(evt).css({"background-color": faceupClr})
	}
	else
	{
		$(evt).css({"background-image": facedownImg});
		$(evt).css({"background-color": facedownClr});
	}
	return;
}
*/

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
			}
			playRaceClock(evt);
			break;
		case "mastermind":
//			playMastermind(evt);
			break;
		case "cardsearch":
			break;
	}
}


// clean up the board and the game data when switching between games
function switchGame()
{
	var msg = "";

	switch (game)
	{
		case "memory":
			dir = "down";
			gameOn = true;
			break;
		case "mastermind":
			dir = "up";
			gameOn = true;
			initializeMastermind();
//			$('#start').on("click",this, playMastermind);
			break;
		case "raceclock":
			msg = "Game starts by clicking any card";
			dir = "up";
			gameOn = false;
			break;
		case "cardsearch":
			dir = "down";
			gameOn = true;
			break;
		case "whack":
			dir = "down";
			gameOn = true;
			$('#start').on("click",this, startWhackTimer);
	}
	selAry = [];
	clearScores();
	updateStatus();
//	updateMessage(msg);
	initializeBoard(dir);
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
		if (playMastermind(evt,data))
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

// assigns cards randomly to board and turns all cards facedown;
function initializeBoard(cardDir)
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
		rnd = Math.floor((Math.random()*52));
		while (ary[rnd] == true)
		{	
			rnd = Math.floor((Math.random()*52));
		}
		ary[rnd] = true;
		deck[rnd].boardpos = i;
		board.push(rnd);
		flipCard(i, cardDir);
		$('#' + (i+1)).attr("draggable","true");
		$('#' + (i+1)).on("dragstart", this, drag);
		if (demoMode)
		{
			document.getElementById(i+1).innerHTML = deck[rnd].val 	// this line for debugging only
		}
	}

	$('#mm1').on("drop", this, drop);
	$('#mm1').attr("greedy",true);
	$('#mm1').on("dragover", this, allowDrop);

	$('#mm2').on("drop", this, drop);
	$('#mm2').on("dragover", this, allowDrop);

	$('#mm3').on("drop", this, drop);
	$('#mm3').on("dragover", this, allowDrop);

	$('#mm4').on("drop", this, drop);
	$('#mm4').on("dragover", this, allowDrop);

}

initializeDeck();
initializeBoard("down");
