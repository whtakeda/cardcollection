function isWinnerRaceClock()
{
	var i,j;

	for (i=0; i<numSuits; i++)
	{
		for (j=0; j<numInSuits; j++)
		{
//			if (board[i*numInSuits+j].val-1 != j)
			if (deck[board[i*numInSuits+j]].val-1 != j)
			{
				console.log("failed at position " + (i*numInSuits+j))
				return false;
			}
//			else if (j>0 && board[i*numInSuits+j].suit != board[i*numInSuits+j-1].suit)
			else if (j>0 && deck[board[i*numInSuits+j]].suit != deck[board[i*numInSuits+j-1]].suit)
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
//	var card1, card2;
//	var evt1, evt2;
//	var pos1,pos2;
//	var idx1, idx2;

	if (selAry.length == 0)
	{
		selAry.push(evt.id-1);

		// highlight card somehow so player can see which card is selected - change this later
		$(evt).css("background-color",selectedClr);
	}
	else
	{
		// update the screen
//		el = selAry.pop();
		idx1 = selAry.pop();
		idx2 = evt.id-1;

//		card1 = el.card;
		card1 = deck[board[idx1]];
//		evt1 = el.evnt;
		evt1 = $('#'+(idx1+1));

//		card2 = board[$(evt).attr("id")-1];
//		evt2 = evt;
		card2 = deck[board[idx2]];
		evt2 = $('#'+(idx2+1));

		// update card values with new boardpos
		pos1 = card1.boardpos;
		pos2 = card2.boardpos;

		card1.boardpos = pos2;
		card2.boardpos = pos1;

		// switch card positions on board
//		board[pos1] = card2;
//		board[pos2] = card1;
		temp = board[pos1];
		board[pos1] = board[pos2];
		board[pos2] = temp;

		// update board images with new card
		$(evt1).css("background-image", card2.img);
		$(evt2).css("background-image", card1.img);

		$(evt1).html(card2.val)
		$(evt2).html(card1.val)
		$(evt1).css("background-color","#ffffff");
		if (isWinnerRaceClock())
		{
			gameEnd = Date.now();
			clearInterval(raceTimer);
			updateMessage("Completed in " + ((raceEndTime - raceStartTime)/1000).toFixed(1) + " seconds")
			gameOn = false;
		}
	}
}