g.debugEnabled = false;
g.debug = function() {
	g.debugEnabled = true;
	g.c.moveTo(g.m.x,0);
	g.c.lineTo(g.m.x,450);
	g.c.moveTo(0,g.m.y);
	g.c.lineTo(650,g.m.y);
	if (g.m.click)
		g.c.strokeStyle = 'green';
	else if (g.m.down)
		g.c.strokeStyle = 'red';
	else
		g.c.strokeStyle = 'black';
	g.c.stroke();
	g.c.beginPath();
	g.c.fillStyle = 'black';
	g.c.font = 'bold 14px "courier new"';
	g.c.fillText('Mouse: (' + g.m.x + ', ' + g.m.y + ')', 100,120);
	var first = true;
	var out = "Pressed keys: ";
	for (var i in g.k)
	{
		if (g.k[i] && i != 'frame')
		{
			if (first)
				first = false;
			else
				out += ',';
			out += i;
		}
	}
	g.c.fillText(out,100,100);
	var d = new Date();
	g.c.fillText('FPS: '+(1000/(d-g.tlast)).toString(), 100, 400);
	g.c.fillText('CPU time: '+((d-g.tstart)).toString(), 100, 425);
	g.tlast = d;
};