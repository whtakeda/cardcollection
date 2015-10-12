var $board;
var deckSize = 52;		// number of cards total (numsuits*numInSuits)
var numSuits = 4;		// number of different suits
var numInSuits = 13;	// number of different values in each suit
var difficulty = "easy";
var turn; // 1 or 2
var selAry = []; // push any cards that have been selected onto this stack so you can track them to turn them back over if needed
var game = "memory";
var p1Score = 0;	// single game score
var p2Score = 0;	// single game score
var p1Total = 0;	// total wins for all games
var p2Total = 0;	// total wins for all games
var facedownClr = "#765e65";
var faceupClr = "#ffffff";
var facedownImg = "url(/images/tictac-minion.png)";
var p1Turn = true;
var allowTies = true;		// for now this will always be true, but want to add logic to allow it to be false later
var whackTimer;
var whackInterval = 5000;	// initial time to whack in milliseconds
var gameStart = 0;			// used for timed games to determine how long the player took
var gameEnd = 0;			// used for timed games to determine how long the player took
var gameOn = false;
var demoMode = true;

$board = $('#board');
$board.on("click","div",function(evt){clickCard(this);});

$('#difficulty').on("change",this,function(evt){difficulty = this.value;})
$('#game').on("change",this,function(evt){game = this.value; switchGame();})


var deck = [ ];	// array for storing cards
var board = [];	// array for modeling game board

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

function flipCard(evt,dir)
{
	var idx;

	idx = $(evt).attr("id")-1;	// id goes from 1-52 but idx goes from 0-51
	if (dir === "up")
	{
//console.log(evt)
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

function playWhackACard()
{
	// use timers to randomly select and turn a card faceup
	// possible ways to play (not going to include them all right now)
	// 1 - most whacks in a set time limit
	// 2 - count how long it takes to get a certain amount of whacks
	// 3- keep going (with shorter timer each time) until person doesn't whack card in time

	$('#start').on("click",this, startWhackTimer);
}

function checkWhackStatus(evt)
{
	var card = selAry.pop();
	if ($(card).attr("id")=== evt.id)
	{
		clearTimeout(whackTimer);
		flipCard(card,"down");
		p1Score++;
		updateStatus();
		whackInterval -= 200;
		startWhackTimer();
	}
	else
	{
		selAry.push(card);
	}
}

function endWhack()
{
	var card = selAry.pop();

	flipCard(card,"down");
	updateMessage("Time's up!");
	gameOn = false;
}

function startWhackTimer()
{
	var card;
	var rnd;

	selAry = [];

	rnd = Math.floor((Math.random()*52));
	card = $('#'+rnd);
	selAry.push(card);
	flipCard(card,"up")
	whackTimer = setTimeout(endWhack,whackInterval);
	gameOn = true;
}

function isWinnerRaceClock()
{
	var i,j;

	for (i=0; i<numSuits;i++)
	{
		// array position == card.val and suit matches suit of previous card
		for (j=0; j<numInSuits; j++)
		{
			if (board[i+j].val-1 != j)
			{
				if (j>0 && board[j].suit != board[j-1].suit)
				{	
					console.log("failed at position " + (i+j))
				}
				else
				{
					return false;
				}
			}
		}
	}
/*
	for (i=0; i<deckSize; i++)
	{
		if (board[i].deckpos-1 != board[i].boardpos)
		{
			return false;
		}
	}
*/
	return true;
}

function playRaceClock(evt)
{
	var card1, card2;
	var evt1, evt2;
	var pos1,pos2;
	var el;

	if (selAry.length == 0)
	{
		selAry.push({"evnt":evt,"card":board[$(evt).attr("id")-1]});

		// highlight card somehow so player can see which card is selected - change this later
		$(evt).css("background-color","red");
	}
	else
	{
		// update the screen
		el = selAry.pop();

		card1 = el.card;
		evt1 = el.evnt;

		card2 = board[$(evt).attr("id")-1];
		evt2 = evt;

		// update card values with new boardpos
		pos1 = card1.boardpos;
		pos2 = card2.boardpos;

		card1.boardpos = pos2;
		card2.boardpos = pos1;

		// switch card positions on board
		board[pos1] = card2;
		board[pos2] = card1;

		// update board images with new card
		$(evt1).css("background-image", card2.img);
		$(evt2).css("background-image", card1.img);

		$(evt1).html(card2.val)
		$(evt2).html(card1.val)
		$(evt1).css("background-color","#ffffff");
		if (isWinnerRaceClock())
		{
			gameEnd = Date.now();
			updateMessage("Completed in " + (gameEnd-gameStart)/1000 + " seconds")
			gameOn = false;
		}
	}
}

function isWinnerMemory()
{
	var winner = "";

	switch (difficulty)
	{
		case "easy":
		case "normal":
			if (p1Score + p2Score == 26)
			{
				if (p1Score > p2Score)
				{
					p1Total++;
					winner = 'Player 1';
 	 	 	 	}
				else if (p2Score > p1Score)
				{
					p2Total++;
					winner = 'Player 2';
				}
				else
				{
					winner = 'tie';
				}
				p1Score = (p2Score = 0);
			}
			return winner;
			break;
		case "hard":
			if (p1Score + p2Score == 13)
			{
				if (p1Score > p2Score)
				{
					p1Total++;
					winner = 'Player 1'
				}
				else
				{
					p2Total++;
					winner = 'Player 2';
				}
				p1Score = (p2Score = 0);
			}
			return winner;
			break;
	}
}

function playMemory(evt)
{
	var idx;
	var evt2;
	var card1, card2;
	var val;
	var winner;
	var condition;

	// just capture the first click
	if (selAry.length == 0)
	{
		// turn card faceup - change background image & color
		flipCard(evt,"up");

		selAry.push({"evnt":evt,"card":board[$(evt).attr("id")-1]});
	}
	// compare second click to first click
	else
	{
		// turn card faceup - change background image & color
		flipCard(evt,"up");

		// compare the two card value
		card1 = board[$(evt).attr("id")-1];
		val = selAry.pop();
		evt2 = val.evnt;
		card2 = val.card;

		if (difficulty === "easy")
		{
			condition = (card1.val === card2.val);
		}
		else if (difficulty == "normal")
		{
			condition = (card1.val === card2.val) && (card1.clr === card2.clr);
		}
		else if (difficulty == "hard")
		{
			condition = (card1.val === card2.val);
		}

		if (condition)
		{
			// handle one difference between hard and normal/easy
			if (difficulty === "hard" && selAry.length < 2)
			{
				selAry.push(val);
				selAry.push({"evnt":evt,"card":board[$(evt).attr("id")-1]});
				return;
			}

			updateMessage('You found a match!');
			if (p1Turn) { p1Score++; } else { p2Score++; }
			winner = isWinnerMemory()
			if ( winner != "" )
			{
				if (winner != "tie")
				{
					updateMessage(winner + " wins the game!");
				}
				else
				{
					updateMessage("The game is a tie");
				}
				gameOn = false;
			}
			updateStatus();
			selAry = [];
		}
		else
		{
			updateMessage('no match');
			setTimeout(function(){
				flipCard(evt,"down");
				flipCard(evt2,"down");
				while (selAry.length>0)
				{
					flipCard(selAry.pop().evnt,"down");
				}

				if (p1Turn) 
				{
		 			updateMessage("Player 1's turn");
				}
				else
				{
		 			updateMessage("Player 2's turn");
				}
			},1000);
			p1Turn = !p1Turn;
		}
	}
}

function clickCard(evt)
{
	switch (game)
	{
		case "memory":
			if (!gameOn)
			{
				gameOn = true;
			}
			switch (difficulty)
			{
				case "easy":
					playMemory(evt);
					break;
				case "normal":
					playMemory(evt);
					break;
				case "hard":
					playMemory(evt);
					break;
			}
			break;
		case "whack":
			checkWhackStatus(evt);
			break;
		case "raceclock":
			if (!gameOn)
			{
				gameOn = true;
				gameStart = Date.now();
			}
			playRaceClock(evt);
			break;
		case "mastermind":
			break;
		case "cardsearch":
			break;
	}
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

function switchGame()
{
	p1Score = 0;
	p2Score = 0;
	updateStatus();

	switch (game)
	{
		case "memory":
			dir = "down";
			break;
		case "mastermind":
			dir = "down";
			break;
		case "raceclock":
			dir = "up";
			break;
		case "cardsearch":
			dir = "down";
			break;
		case "whack":
			dir = "down";
			playWhackACard();
	}
	initializeBoard(dir);
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
//		console.log(deck[rnd])
		deck[rnd].boardpos = i;
		board.push(deck[rnd]);
		flipCard($('#' + (i+1)), cardDir);
		if (demoMode)
		{
			document.getElementById(i+1).innerHTML = deck[rnd].val 	// this line for debugging only
		}
//		console.log(board)
	}
//		console.log(ary)
/*
	// this intializes data for a 4x13 array
	for (i=0; i<4; i++)
	{
		board[i] = [];
		for (j=0; j<13; j++)
		{
			board[i].push("")
		}

	}

	for (i=0; i<4; i++)
	{
		for (j=0; j<13; j++)	
		{
			rnd = Math.floor((Math.random()*52));
			while (ary[rnd].used == true)
			{	
				rnd = Math.floor((Math.random()*52));
			}
			board[i][j] = ary[rnd];
			ary[rnd].used = true;
//			document.getElementById((i*13+j+1).toString()).style.backgroundImage = "url(" + ary[rnd].img + ")"
		}
	}
*/
}

initializeDeck();
initializeBoard("down");
