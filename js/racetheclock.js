function isWinnerRaceClock()
{
	var i,j;

	for (i=0; i<numSuits; i++)
	{
		for (j=0; j<numInSuits; j++)
		{
			if (board[i*numInSuits+j].val-1 != j)
			{
				console.log("failed at position " + (i*numInSuits+j))
				return false;
			}
			else if (j>0 && board[i*numInSuits+j].suit != board[i*numInSuits+j-1].suit)
			{
				console.log("failed at position " + (i*numInSuits+j))
				return false;
			}
		}
	}
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
		$(evt).css("background-color",selectedClr);
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