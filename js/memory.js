function isWinnerMemory()
{
	var winner = "";

	switch (difficulty)
	{
		case "easy":
		case "normal":
			if (p1Score + p2Score == deckSize/2)
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
			if (p1Score + p2Score == deckSize/numSuits)
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