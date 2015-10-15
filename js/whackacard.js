function checkWhackStatus(evt)
{
	var idx = selAry[0];

	if (idx === evt.id-1)
	{
		clearTimeout(whackTimer);
		flipCard(idx,"down");
		selAry.pop();
		(p1Turn ? p1Score++ : p2Score++ );
		updateStatus();
		whackInterval -= 200;
		startWhackTimer();
	}
}

function endWhackTurn()
{
	var str;
	var idx = selAry.pop();

	flipCard(idx,"down");
	updateMessage("Time's up!");

	if (p1Turn)
	{
		str = "Time's up.<br>Player 2's turn.<br>Click the start button to begin.";
	}
	else
	{
		str = determineWinner("highest");
		gameOn = false;
	}
	p1Turn = !p1Turn;
	myAlert(str);
	updateStatus();
}

function startWhackTimer()
{
	var card;
	var rnd;

	selAry = [];

	rnd = Math.floor((Math.random()*deckSize));
	selAry.push(rnd);
	flipCard(rnd,"up")
	whackTimer = setTimeout(endWhackTurn,whackInterval);
	gameOn = true;
}