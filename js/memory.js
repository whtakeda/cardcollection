function isGameOverMemory()
{
	switch (difficulty)
	{
		case "megaeasy":
		case "easy":
		case "normal":
			return (p1Score + p2Score === deckSize/2) ? true : false;
			break;
		case "hard":
			return (p1Score + p2Score === deckSize/numSuits) ? true : false;
			break;
	}
}

function playMemory(evt)
{
	var idx,idx2;
	var evt2;
	var card1, card2;
	var val;
	var winner;
	var isMatch;
	var str;

	if (deck[$(evt).attr("id")-1].direction === "up") { return; }

	idx = $(evt).attr("id")-1;
	// just capture the first click
	if (selAry.length == 0)
	{
		// turn card faceup - change background image & color
		flipCard(idx,"up");

		// highlight card somehow so player can see which card is selected - change this later
		$(evt).css("background-color",selectedClr);

		selAry.push(idx);
	}
	// compare second click to first click
	else
	{
		// turn card faceup - change background image & color
		flipCard(idx,"up");

		// compare the two card values
		card1 = deck[board[idx]];
		idx2 = selAry.pop()
		card2 = deck[board[idx2]];

		switch (difficulty)
		{
			case "megaeasy":
			case "easy":
				isMatch = (card1.val === card2.val) && (idx != idx2);
				break;
			case "normal":
				isMatch = (card1.val === card2.val) && (card1.clr === card2.clr) && (idx != idx2);
				break;
			case "hard":
				isMatch = (card1.val === card2.val) && (idx != idx2);
				break;
		}

		if (isMatch)
		{
			// handle one difference between hard and normal/easy
			if (difficulty === "hard" && selAry.length < 2)
			{
				selAry.push(idx2);
				selAry.push(idx);
				return;
			}
			$('#' + (idx2+1)).css("background-color","#ffffff");

			rnd = Math.floor(Math.random()*5)
			updateMessage('You found a match!<br>' + randomCompliment());

			if (p1Turn) { p1Score++; } else { p2Score++; }
			if ( isGameOverMemory() )
			{
				str = determineWinner("highest");
				gameOn = false;
				myAlert(str);
			}
			updateStatus();
			selAry = [];
		}
		else
		{
			updateMessage('No match');
			setTimeout(function(){
				flipCard(idx,"down");
				flipCard(idx2,"down");
				while (selAry.length>0)
				{
					flipCard(selAry.pop(),"down");
				}

				updateMessage(playerTurn())
			},1500);
			p1Turn = !p1Turn;
		}
	}

}