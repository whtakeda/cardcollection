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
				else if (p2Score > p1Score)
				{
					p2Total++;
					winner = 'Player 2';
				}
				else
				{
					winner = "tie";
				}
			}
			return winner;
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
	var condition;

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

		if (difficulty === "easy")
		{
			condition = (card1.val === card2.val) && (idx != idx2);
		}
		else if (difficulty == "normal")
		{
			condition = (card1.val === card2.val) && (card1.clr === card2.clr) && (idx != idx2);
		}
		else if (difficulty == "hard")
		{
			condition = (card1.val === card2.val) && (idx != idx2);
		}

		if (condition)
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