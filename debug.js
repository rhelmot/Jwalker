g.debug = {
enabled: false,	
process: function() {
	g.debug.enabled = true;
	g.debug.frames++;
	g.c.globalAlpha = .5;
	g.c.fillStyle = 'white';
	g.c.fillRect(92,85,350,43);
	g.c.fillRect(97,386,162,43);
	g.c.fillRect(495,50,115,115);
	g.c.globalAlpha = 1;
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
	g.c.fillText('FPS: '+(g.debug.fps).toString(), 100, 400);
	g.c.fillText('CPU time: '+((d-g.tstart)).toString(), 100, 425);
	
	if (g.m.click)
	{
		g.debug.rectData.x = g.m.x;
		g.debug.rectData.y = g.m.y;
	}
	if (g.m.down)
	{
		g.debug.rectData.width = g.m.x - g.debug.rectData.x;
		g.debug.rectData.height = g.m.y - g.debug.rectData.y;
	}
	g.c.fillStyle = 'red';
	g.c.globalAlpha = 0.5;
	g.c.fillRect(g.debug.rectData.x, g.debug.rectData.y, g.debug.rectData.width, g.debug.rectData.height);
	g.c.globalAlpha = 1;
	g.c.fillStyle = 'black';
	g.c.fillText('Rectangle:',500,60);
	g.c.fillText('Screen X: '+g.debug.rectData.x,500,80);
	g.c.fillText('Screen Y: '+g.debug.rectData.y,500,95);
	g.c.fillText('Area X: '+(g.debug.rectData.x + g.area.areas[g.area.currentarea].x),500,110);
	g.c.fillText('Area Y: '+(g.debug.rectData.y + g.area.areas[g.area.currentarea].y),500,125);
	g.c.fillText('Width: '+g.debug.rectData.width,500,140);
	g.c.fillText('Height: '+g.debug.rectData.height,500,155);
},
frames: 0,
fps: 60,
rectData: { x: 0, y: 0, width: 0, height: 0 }
};
setInterval(function() {
	if (g.debug.enabled)
	{
		g.debug.fps = g.debug.frames;
		g.debug.frames = 0;
	}
},1000);