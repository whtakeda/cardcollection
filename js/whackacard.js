function checkWhackStatus(evt)
{
	var card = selAry.pop();
	if ($(card).attr("id")=== evt.id)
	{
		clearTimeout(whackTimer);
		flipCard(card,"down");
		p1Score++;
		updateStatus();
		whackInterval -= 200;
		startWhackTimer();
	}
	else
	{
		selAry.push(card);
	}
}

function endWhack()
{
	var card = selAry.pop();

	flipCard(card,"down");
	updateMessage("Time's up!");
	gameOn = false;
}

function startWhackTimer()
{
	var card;
	var rnd;

	selAry = [];

	rnd = Math.floor((Math.random()*52));
	card = $('#'+rnd);
	selAry.push(card);
	flipCard(card,"up")
	whackTimer = setTimeout(endWhack,whackInterval);
	gameOn = true;
}