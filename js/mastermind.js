function playMastermind(dragidx,dropidx)
{
	var i;
	var found = false;
	// if card is already selected then fail
	for (i=0; i < mmSelAry.length; i++)
	{
		console.log(mmSelAry[i] + " , " + dragidx)
		console.log(i + " , " + dropidx)
		if (mmSelAry[i] === dragidx && i != dropidx)
		{
//			$(evt).css("background-color", "#ffffff");
//			selAry.splice(i,1);
			found = true;
			return false;
		}
	}

	// if card is not selected then add it if there are still open spots
	if (!found)
	{
		if (mmSelAry)
		{
//			$(evt).css("background-color", selectedClr);
//			console.log(board[$(evt).attr("id")-1].deckpos);
//console.log(idx)
			mmSelAry[dropidx] = dragidx;
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

	for (i=0; i < selAry.length; i++)
	{
		str += "Card " + (i+1);
		console.log(selAry[i])
		console.log(mmAry[i])
		if (selAry[i].deckpos === mmAry[i].deckpos)
		{
			str += "Match";
		}
		else
		{
			if (selAry[i].suit === mmAry[i].suit)
			{
				str += " suit "
			}

			if (selAry[i].clr === mmAry[i].clr && selAry[i].suit != mmAry[i].suit)
			{
				str += " color "
			}

			if (selAry[i].val === mmAry[i].val)
			{
				str += " value "
			}
		}
		str += "<br>";
	}
	updateMessage(str);
}

function initializeMastermind()
{
	var rnd
	var i;
	var found;

	// select 4 cards at random
	rnd = Math.floor((Math.random()*52));
	while (mmAry.length < 4)
	{
		found = false;
		for (i=0; i < mmAry.length; i++)
		{
			if (mmAry[i].deckpos-1 === rnd)
			{
				found = true;
			}
		}

		if (!found)
		{
			mmAry.push(deck[rnd]);
		}
		rnd = Math.floor((Math.random()*52));
	}
	console.log(mmAry);
}