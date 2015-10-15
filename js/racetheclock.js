function isWinnerRaceClock()
{
	var i,j;

	for (i=0; i<numSuits; i++)
	{
		for (j=0; j<numInSuits; j++)
		{
			if (deck[board[i*numInSuits+j]].val-1 != j)
			{
//				console.log("failed at position " + (i*numInSuits+j))
				return false;
			}
			else if (j>0 && deck[board[i*numInSuits+j]].suit != deck[board[i*numInSuits+j-1]].suit)
			{
				console.log("failed at position " + (i*numInSuits+j))
				return false;
			}
		}
	}
	return true;
}

function playRaceClock(evtSrc, evtDest)
{
	var card1, card2;
	var evt1, evt2;
	var pos1,pos2;
	var idx1, idx2;

	// swap the background image of the divs, the innerhtml of the divs (if demo mode is on)
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
//		updateMessage("Completed in " + ((raceEndTime - raceStartTime)/1000).toFixed(1) + " seconds");
		str = "Completed in " + ((raceEndTime - raceStartTime)/1000).toFixed(1) + " seconds";
		raceClockStarted = false;
		ignoreDrop = false;
			
		if (p1Turn)
		{
			p1Score = ((raceEndTime - raceStartTime)/1000).toFixed(1) + " seconds";
			str += "<br>Player 2's turn.";
			initializeBoard("up",true);
		}
		else
		{
			p2Score = ((raceEndTime - raceStartTime)/1000).toFixed(1) + " seconds";
			if (p1Score < p2Score)
			{
				p1Total++;
				str += "<br>Player 1 is the winner";
			}
			else if (p2Score < p1Score)
			{
				p2Total++;
				str += "<br>Player 2 is the winner";
			}
			else
			{
				str += "<br>The game is a tie.";
			}
			gameOn = false;
		}
		updateStatus()
		myAlert(str);
		p1Turn = !p1Turn;
	}
}

function playRaceClockClick(evt)
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
		temp = board[pos1];
		board[pos1] = board[pos2];
		board[pos2] = temp;

		// update board images with new card
		$(evt1).css("background-image", card2.img);
		$(evt2).css("background-image", card1.img);

		$(evt1).html(card2.val);
		$(evt2).html(card1.val);
		$(evt1).css("background-color","#ffffff");
		if (isWinnerRaceClock())
		{
			gameEnd = Date.now();
			clearInterval(raceTimer);
//			updateMessage("Completed in " + ((raceEndTime - raceStartTime)/1000).toFixed(1) + " seconds");
			str = "Completed in " + ((raceEndTime - raceStartTime)/1000).toFixed(1) + " seconds";
			raceClockStarted = false;
			
			if (p1Turn)
			{
				p1Score = ((raceEndTime - raceStartTime)/1000).toFixed(1) + " seconds";
				str += "<br>Player 2's turn.";
				initializeBoard("up",true);
			}
			else
			{
				p2Score = ((raceEndTime - raceStartTime)/1000).toFixed(1) + " seconds";
				if (p1Score < p2Score)
				{
					p1Total++;
					str += "<br>Player 1 is the winner";
				}
				else if (p2Score < p1Score)
				{
					p2Total++;
					str += "<br>Player 2 is the winner";
				}
				else
				{
					str += "<br>The game is a tie.";
				}
				gameOn = false;
			}
			updateStatus()
			myAlert(str);
			p1Turn = !p1Turn;
		}
	}
}