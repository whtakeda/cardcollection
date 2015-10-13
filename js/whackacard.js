function checkWhackStatus(evt)
{
	var idx = selAry.pop();

	if (idx === evt.id-1)
	{
		clearTimeout(whackTimer);
		flipCard(idx,"down");
		p1Score++;
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
	var idx = selAry.pop();

	flipCard(idx,"down");
	updateMessage("Time's up!");
	gameOn = false;
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