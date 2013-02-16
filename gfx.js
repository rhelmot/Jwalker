g.gfx = {
	pixels: {},				//SETME
	layers: {				//SETME - Optional
		fading: 6,
		dialog: 5,
		ui: 4,
		prioritysprites: 3,
		prioritybg: 2,
		sprites: 1,
		bg: 0	
	},
	queue: [],
	draw: function (recid, x, y, frame, layer, flip, alpha) {	//for backgrounds, frame can be left blank
		var order = g.gfx.makeorder(recid, x, y, frame, flip, alpha);
		if (!order)
			return;
		if (g.gfx.queue[layer] == null)
			g.gfx.queue[layer] = [];
		g.gfx.queue[layer][g.gfx.queue[layer].length] = order;
	},
	makeorder: function (recid, x, y, frame, flip, alpha) {
		if (typeof flip == 'undefined')
			flip = {x:false, y:false};
		if (typeof alpha == 'undefined')
			alpha = 1;
		else if (alpha <= 0)
			return false;
		var rec = g.resources[recid];					//flip: {x: true, y: false}
		if (rec && rec.type != 'image')
		{
			if (rec.type == 'meta' && rec.use == 'quiltdata')
			{
				for (var qy = 0; qy < 450 + rec.patchy; qy += rec.patchy)
				{
					for (var qx = 0; qx < 650 + rec.patchx; qx += rec.patchx)
					{
						var rx = Math.floor((qx+x)/rec.patchx);
						var ry = Math.floor((qy+y)/rec.patchy);
						var trec = rec.data[ry];
						if (typeof trec == 'object')
						{
							trec = trec[rx];
							if (typeof trec == 'number')
								g.gfx.draw(trec, x-(rx*rec.patchx), y-(ry*rec.patchy), 0, g.gfx.layers.bg);
						}
					}
				}
				return false;
			}
			console.log('Warning: Attempting to draw nonimage resource #'+recid+'!');
			return false;
		}
		if (!rec.loaded)
		{
			console.log('Warning: Resource '+rec.filename+' is not loaded in area #'+g.area.currentarea+'!');
			return false;
		}
		if (rec.use == 'spritesheet')
		{
			var fx = frame%rec.framewidth;
			var fy = Math.floor(frame/rec.framewidth);
			if (fy >= rec.frameheight)
			{
				console.log('Warning: attempting to draw spritesheet frame outside defined range!');
				return false;
			}
			frame = {left: rec.framex*fx, top: rec.framey*fy, width: rec.framex, height: rec.framey};
		}
		else if (rec.use == 'background')
		{
			var dx = 0;
			var dy = 0;
			var w = 650;
			var h = 450;
			if (x < 0)
			{
				dx -= x;
				w += x;
				x = 0;
			}
			if (y < 0)
			{
				dy -= y;
				h += y;
				y = 0;
			}
			var rw = rec.width;
			var rh = rec.height;
			if (x + w > rw)
				w -= x + w - rw;
			if (y + h > rh)
				h -= y + h - rh;
			frame = {left:x, top:y, width:w, height:h};
			x = dx;
			y = dy;
		}
		if (x > 650 || y > 450 || x + frame.width <= 0 || y + frame.height <= 0)			//do not draw offscreen
			return false;
		frame.x = x;
		frame.y = y;
		frame.recid = recid;
		frame.flip = flip;
		frame.alpha = alpha;
		return frame;
	},
	drawfunc: function (func, layer) {
		if (typeof g.gfx.queue[layer] =='undefined')
			g.gfx.queue[layer] = [];
		g.gfx.queue[layer][g.gfx.queue[layer].length] = func;
	},
	paint: function () {
		g.gfx.fbpaint();
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
	fbdex: [],
	fblayer: 1,
	fbdraw: function (recid, x, y, frame, p, flip, alpha)
	{
		var order;
		if (g.resources[recid].use == 'background')
			order = g.gfx.makeorder(recid, g.area.areas[g.area.currentarea].x-x, g.area.areas[g.area.currentarea].y-y, frame, flip, alpha);
		else
			order = g.gfx.makeorder(recid, x-g.area.areas[g.area.currentarea].x, y-g.area.areas[g.area.currentarea].y, frame, flip, alpha);
		if (order)
		{
			order.p = p;
			g.gfx.fbdex[g.gfx.fbdex.length] = order;
		}
	},
	fbpaint: function () {
		if (g.gfx.fbdex.length)
		{
			g.gfx.fbdex.sort(function (a,b) {return a.p-b.p;});
			if (!g.gfx.queue[g.gfx.fblayer] || !g.gfx.queue[g.gfx.fblayer].length)
				g.gfx.queue[g.gfx.fblayer] = g.gfx.fbdex;
			else
				g.gfx.queue[g.gfx.fblayer] = g.gfx.fbdex.concat(g.gfx.queue[g.gfx.fblayer]);
			g.gfx.fbdex = [];
		}
	},
	setbgcolor: function (color) {
		g.c.canvas.style.backgroundColor = color;
		g.gfx.bgcolor = color;
	},
	bgcolor: 'white',
	settextstyle: function (style) {		//you'll have to handle underline/strikethrough on your own...
		g.c.fillStyle = style.color;
		g.c.font = (style.italics?'italic ':'')+(style.bold?'bold ':'')+style.size+' '+((style.font.indexOf(' ')==-1)?style.font:('"'+style.font+'"'));
	}
};