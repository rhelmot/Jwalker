g.debug = {
enabled: false,
finger: -1,
process: function() {
	g.debug.enabled = true;
	g.debug.frames++;
	g.c.globalAlpha = .5;
	g.c.fillStyle = 'white';
	g.c.fillRect(92,85,350,23 + 20*g.debug.showdata.length);
	g.c.fillRect(97,386,162,43);
	g.c.fillRect(495,50,115,115);
	g.c.globalAlpha = 1;
	if (g.debug.finger >= 0 && !g.p[g.debug.finger])
		g.debug.finger = -1;
	if (g.debug.finger < 0)
	{
		for (var i in g.p)
		{
			if (g.p[i] && !g.p[i].used)
			{
				g.debug.finger = i;
				break;
			}
		}
	}
	g.c.fillStyle = 'black';
	g.c.font = 'bold 14px "courier new"';
	var out = "Pressed keys: ";
	var first = true;
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
	for (var i = 0; i < g.debug.showdata.length; i++)
		g.c.fillText(g.debug.showdata[i],100,120+i*20);
	g.debug.showdata = [];
	var d = new Date();
	g.c.fillText('FPS: '+(g.debug.fps).toString(), 100, 400);
	g.c.fillText('CPU time: '+((d-g.tstart)).toString(), 100, 425);
	
	if (g.debug.finger >= 0 && g.p[g.debug.finger].frame)
	{
		g.debug.rectData.x = g.p[g.debug.finger].x;
		g.debug.rectData.y = g.p[g.debug.finger].y;
	}
	if (g.debug.finger >= 0)
	{
		g.debug.rectData.width = g.p[g.debug.finger].x - g.debug.rectData.x;
		g.debug.rectData.height = g.p[g.debug.finger].y - g.debug.rectData.y;
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
adddata: function(data) {
	if (g.debug.enabled)
		g.debug.showdata[g.debug.showdata.length] = data;
},
showdata: [],
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