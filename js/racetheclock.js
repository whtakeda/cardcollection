function isWinnerRaceClock()
{
	var i,j;

	for (i=0; i<numSuits; i++)
	{
		for (j=0; j<numInSuits; j++)
		{
			// fails if the values don't match position in row
			if (deck[board[i*numInSuits+j]].val-1 != j)
			{
//				console.log("value failed at position " + (i*numInSuits+j))
				return false;
			}
			// also fails if values do match position but suits don't match
			else if (j>0 && deck[board[i*numInSuits+j]].suit != deck[board[i*numInSuits+j-1]].suit)
			{
//				console.log("suit failed at position " + (i*numInSuits+j))
				return false;
			}
		}
	}
	return true;
}

function playRaceClock(evtSrc, evtDest)
{
	var temp;

	// swap the background image and innerhtml of the divs (if demo mode is on)
	temp = deck[board[evtDest]].img;
	$('#' + (evtDest+1)).css("background-image", deck[board[evtSrc]].img);
	$('#' + (evtSrc+1)).css("background-image", temp);			temp = $('#' + (evtDest+1)).html();
	$('#' + (evtDest+1)).html($('#' + (evtSrc+1)).html());
	$('#' + (evtSrc+1)).html(temp);
	temp = $('#' + (evtDest+1)).css("color");
	$('#' + (evtDest+1)).css("color", $('#' + (evtSrc+1)).css("color"));
	$('#' + (evtSrc+1)).css("color",temp);
	// alsos swap the positions of the cards in the board array and the boardpos in the deck array
	temp = board[evtDest];
	board[evtDest] = board[evtSrc];
	board[evtSrc] = temp;
	temp = deck[board[evtDest]].boardpos;
	deck[board[evtDest]].boardpos = deck[board[evtSrc]].boardpos;
	deck[board[evtSrc]].boardpos = temp;

	if (isWinnerRaceClock())
	{
		gameEnd = Date.now();
		clearInterval(raceTimer);
		str = "Completed in " + ((raceEndTime - raceStartTime)/1000).toFixed(1) + " seconds";
		raceClockStarted = false;
			
		if (p1Turn)
		{
			p1Score = ((raceEndTime - raceStartTime)/1000).toFixed(1);
			str += "<br>Player 2's turn.";
			randomizeBoard("up",true);
		}
		else
		{
			p2Score = ((raceEndTime - raceStartTime)/1000).toFixed(1);
			str = determineWinner("lowest");
			gameOn = false;
		}
		updateStatus()
		myAlert(str);
		p1Turn = !p1Turn;
	}
}