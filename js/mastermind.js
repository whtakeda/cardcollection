function playMastermind(dragidx,dropidx)
{
	var i;
	var found = false;
	// if card is already in array at another index, don't allow it to be added again
	for (i=0; i < mmSelAry.length; i++)
	{
//console.log(mmSelAry[i] + "=" + board[dragidx])
//console.log(i + "=" + dropidx)
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
		else
		{
//			updateMessage("You have already selected 4 cards.  To change your selections, deselect a selected card then select a new card");
		}	
	}

}

function guessMastermind()
{
	// compare selAry to mmAry and return feedback to user
	// compare value, suit, and color
	var i;
	var matches = [];
	var str = "";
	var mm1, mm2;

	// make sure there are 4 cards selected before checking
	for (i=0; i< mmSelAry.length; i++)
	{
		if (mmSelAry[i] === "")
		{
			updateMessage("");
			updateMessage("Please select 4 cards before guessing");
			return;
		}
	}

	for (i=0; i < mmSelAry.length; i++)
	{
		mm1 = mmSelAry[i];
		mm2 = mmAry[i];
		str += "Card " + (i+1);
//		console.log(mmSelAry[i])
//		console.log(mmAry[i])
		if (mm1 === mm2)
		{
			str += " Match";
		}
		else
		{
			if (deck[mm1].suit === deck[mm2].suit)
			{
				str += " suit "
			}

			if (deck[mm1].clr === deck[mm2].clr && deck[mm1].suit != deck[mm2].suit)
			{
				str += " color "
			}

			if (deck[mm1].val === deck[mm2].val)
			{
				str += " value "
			}
		}
		str += "<br>";
	}
	mmNumTries++;
	if (mmNumTries >= mmMaxTries)
	{
		str = "Sorry you did not guess the correct cards<br>" + str;
		$('#guess').attr("disabled",true)
	}
	updateMessage(str);
	updateStatus();
}

function initializeMastermind()
{
	var rnd
	var i;
	var found;

	mmTurns = 0;

	mmAry = [];
	// select 4 cards at random
	rnd = Math.floor((Math.random()*52));
	while (mmAry.length < 4)
	{
		found = false;
		for (i=0; i < mmAry.length; i++)
		{
			if (mmAry[i]-1 === rnd)
			{
				found = true;
			}
		}

		if (!found)
		{
			mmAry.push(rnd);
		}
		rnd = Math.floor((Math.random()*52));
	}
	console.log(mmAry);
}