g.gfx = {
	pixels: {},				//SETME
	queue: [],
	draw: function(recid, x, y, frame, layer, flip, alpha) {	//for backgrounds, frame takes the format {left: <xoffset>, top: <yoffset>, width: <width>, height: <height>}
		if (typeof flip == 'undefined')
			flip = {x:false, y:false};
		if (typeof alpha == 'undefined')
			alpha = 1;
		var rec = g.resources[recid];					//flip: {x: true, y: false}
		if (rec.type != 'image')
		{
			console.log('Warning: attempting to draw nonimage resource!');
			return;
		}
		if (rec.use == 'spritesheet')
		{
			var fx = frame%rec.framewidth;
			var fy = Math.floor(frame/rec.framewidth);
			if (fy >= rec.frameheight)
			{
				console.log('Warning: attempting to draw spritesheet frame outside defined range!');
				return;
			}
			frame = {left: rec.framex*fx, top: rec.framey*fy, width: rec.framex, height: rec.framey};
		}
		else if (rec.use == 'background' && frame.diy == true)
			frame = {left:0, top:0, width:rec.data.width, height:rec.data.height};
		if (x > 650 || y > 450 || x + frame.width <= 0 || y + frame.height <= 0)			//do not draw offscreen
			return;
		if (g.gfx.queue[layer] == null)
			g.gfx.queue[layer] = [];
		frame.x = x;
		frame.y = y;
		frame.recid = recid;
		frame.flip = flip;
		frame.alpha = alpha;
		g.gfx.queue[layer][g.gfx.queue[layer].length] = frame;
	},
	drawfunc: function(func, layer) {
		if (typeof g.gfx.queue[layer] =='undefined')
			g.gfx.queue[layer] = [];
		g.gfx.queue[layer][g.gfx.queue[layer].length] = func;
	},
	paint: function() {
		for (var i in g.gfx.queue)
		{
			for (var j in g.gfx.queue[i])
			{
				var order = g.gfx.queue[i][j];
				if (typeof order == 'function')
				{
					order();
					continue;
				}
				var rec = g.resources[order.recid];
				if (order.flip.x)
				{
					order.flip.x = -1;
					order.flip.xtrans = -2*(order.x+order.width/2);
				}
				else
				{
					order.flip.x = 1;
					order.flip.xtrans = 0;
				}
				if (order.flip.y)
				{
					order.flip.y = -1;
					order.flip.ytrans = -2*(order.y+order.height/2);
				}
				else
				{
					order.flip.y = 1;
					order.flip.ytrans = 0;
				}
				g.c.save();
				g.c.scale(order.flip.x, order.flip.y);
				g.c.translate(order.flip.xtrans, order.flip.ytrans);
				g.c.globalAlpha = order.alpha;
				g.c.drawImage(rec.data, order.left, order.top, order.width, order.height, order.x, order.y, order.width, order.height);
				g.c.restore();
			}
		}
		g.gfx.queue = [];
	},
	layers: {
		fading: 6,
		dialog: 5,
		ui: 4,
		prioritysprites: 3,
		prioritybg: 2,
		sprites: 1,
		bg: 0	
	}
};