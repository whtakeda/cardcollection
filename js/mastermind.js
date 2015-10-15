function playMastermind(dragidx,dropidx)
{
	var i;
	var found = false;

	// if card is already in array at another index, don't allow it to be added again
	for (i=0; i < mmSelAry.length; i++)
	{
		if (mmSelAry[i] === board[dragidx] && i != dropidx)
		{
			found = true;
			return false;
		}
	}

	// if card is not selected then add it if there are still open spots
	if (!found)
	{
		if (mmSelAry)
		{
			mmSelAry[dropidx] = board[dragidx];
			return true;
		}
	}

}

function makeGuessMM()
{
	// compare selAry to mmAry and return feedback to user
	// compare value, suit, and color
	var i;
	var str = "";
	var mm1, mm2;
	var matchCnt = 0;
	var isMatch = false;

	// make sure there are 4 cards selected before checking
	for (i=0; i< mmSelAry.length; i++)
	{
		if (mmSelAry[i] === "")
		{
			myAlert("Please select 4 cards before guessing");
			return;
		}
	}

	for (i=0; i < mmSelAry.length; i++)
	{
		mm1 = mmSelAry[i];
		mm2 = mmAry[i];

		str += "Card " + (i+1) + ": ";
		if (mm1 === mm2)
		{
			matchCnt++;
			str += " Match";
		}
		else
		{
			isMatch = false;
			if (deck[mm1].suit === deck[mm2].suit)
			{
				str += " Suit ";
				isMatch = true;
			}

			if (deck[mm1].clr === deck[mm2].clr && deck[mm1].suit != deck[mm2].suit)
			{
				str += " Color ";
				isMatch = true;
			}

			if (deck[mm1].val === deck[mm2].val)
			{
				str += " Value ";
				isMatch = true;
			}

			if (!isMatch)
			{
				str += " Does not match any attributes"
			}
		}

		str += "<br>";
		updateMessage("");
		setTimeout(function(){ updateMessage(str); }, 300);
	}
	(p1Turn ? p1Score++ : p2Score++);
	if (matchCnt == 4)
	{
		randomizeBoard("up",false);
		if (p1Turn)
		{
			str = "Player 1 has completed their turn.<br>Player 2's turn";
			clearMMBoard();
			initializeMastermind();
		}
		else
		{
			str = determineWinner("lowest");
		}
		p1Turn = !p1Turn;
		myAlert(str);
	}
	updateStatus();
}

// clears the section where the player drags the cards to
function clearMMBoard()
{
	var i;

	for (i=1; i<=4; i++)
	{
		$('#mm'+i).css("backgroundImage","");
		$('#mm'+i).css("backgroundColor", "#000000")
	}
}

function initializeMastermind()
{
	var rnd
	var i;
	var found;

	mmTurns = 0;

	mmAry = [];
	// select 4 cards at random, make sure none are duplicates
	rnd = Math.floor((Math.random()*52));
	while (mmAry.length < 4)
	{
		found = false;
		if ((deck[rnd].val > numInSuits) || mmAry.indexOf(rnd)>=0)
		{
			found = true;
		}

		if (!found)
		{	
			mmAry.push(rnd);
		}
		rnd = Math.floor((Math.random()*52));
	}
//	console.log(mmAry);
}
