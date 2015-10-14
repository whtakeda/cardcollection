function checkWhackStatus(evt)
{
	var idx = selAry.pop();

	if (idx === evt.id-1)
	{
		clearTimeout(whackTimer);
		flipCard(idx,"down");
		(p1Turn ? p1Score++ : p2Score++ );
		updateStatus();
		whackInterval -= 200;
		startWhackTimer();
	}
	else
	{
		selAry.push(idx);
	}
}

function endWhack()
{
	var str;
	var idx = selAry.pop();

	flipCard(idx,"down");
	updateMessage("Time's up!");
	gameOn = false;

	if (p1Turn)
	{
		str = "Time's up.<br>Player 2's turn.<br>Click the start button to begin.";
	}
	else
	{
		if (p1Score > p2Score)
		{
			p1Total++;
			str = "Time's up.  Player 1 is the winner";
		}
		else if (p2Score > p1Score)
		{
			p2Total++;
			str = "Time's up.  Player 2 is the winner";
		}
		else
		{
			str = "Time's up.  The game is a tie.";
		}
	}
	p1Turn = !p1Turn;
//	updateMessage(str);
	myAlert(str)
	updateStatus();
}

function startWhackTimer()
{
	var card;
	var rnd;

	selAry = [];

	rnd = Math.floor((Math.random()*52));
	selAry.push(rnd);
	flipCard(rnd,"up")
	whackTimer = setTimeout(endWhack,whackInterval);
	gameOn = true;
}