g.dialog = {
	prefs: {},				//SETME
	boxrec: 0,				//SETME
	data: {},
	active: false,
	spriteframe: 0,
	spriteframetimer: 0,
	num: 0,
	part: 0,
	line: 0,
	char: 0,
	state: '',
	init: function(rec) {
		var data = rec.data.split('\r\n');
		if (data.length == 1)
			data = rec.data.split('\n');
		var num;
		var part = 0;
		var line = 0;
		var side = 'right';
		for (var l = 0; l < data.length; l++)
		{
			if (data[l] == '')
				continue;
			if (data[l].substr(0,1) == '!')
			{
				num = data[l].substr(1);
				part = -1;
				line = 0;
				g.dialog.data[num] = [];
				continue;
			}
			if (data[l].substr(0,1) == ':')				//colon at beginning of dialog line is synonym for _!_:
				data[l] = '_!_: '+data[l].substr(1);
			var linedeg = data[l].split(': ');
			if (linedeg.length > 2)
			{
				for (var j = 2; j < linedeg.length; j++)
					linedeg[1] += ': ' + linedeg[j];
			}
			linedeg[0] = linedeg[0].split('!');
			if (typeof g.dialog.prefs[linedeg[0][1]] == 'undefined')
			{
				console.log('Error parsing asset '+rec.filename+', line '+l+': speaker '+linedeg[0][1]+' is not defined.');
				linedeg[0] = ['_','_'];
			}
			if (typeof g.dialog.prefs[linedeg[0][1]].states[linedeg[0][0]] == 'undefined')
			{
				console.log('Error parsing asset '+rec.filename+', line '+(l+1)+': pose '+linedeg[0][0]+' is not defined for speaker '+linedeg[0][1]+'.');
				linedeg[0][0] = 'neutral';
			}
			if (part == -1 || g.dialog.data[num][part].char != linedeg[0][1])
			{
				part++;
				if (side == 'left')
					side = 'right';
				else
					side = 'left';
				g.dialog.data[num][part] = {char: linedeg[0][1], 'side':side, spritesheet: g.dialog.prefs[linedeg[0][1]].spritesheet, color: g.dialog.prefs[linedeg[0][1]].color, lines: []};
				if (linedeg[0][1] == '_')
				{
					g.dialog.data[num][part].side = 'center';
				}
				line = 0;
			}
			var temp = g.dialog.prefs[linedeg[0][1]].states[linedeg[0][0]];
			g.dialog.data[num][part].lines[line] = { line: linedeg[1], frames: temp.frames, timing: temp.timing };
			line++;
		}
	},
	show: function(num, callback)
	{
		if (g.dialog.data[num] == null)
		{
			console.log('Warning: no such dialog called "'+num+'".');
			return;
		}
		g.dialog.callback = callback;
		g.frozen = true;
		g.dialog.boxcur = 650;
		g.dialog.boxgoal = {left: 88, right: 25, center: 57}[g.dialog.data[num][0].side];
		if (g.dialog.data[num][0].char != '_')
			g.query.show(['Close conversation'],300,100,function() { g.dialog.active = false; });
		g.timeouts.addtimeout(10, g.dialog.drawbox, true);
		g.timeouts.addtimeout (10, function(timer) {
			g.dialog.active = true;
			g.dialog.num = num;
			g.dialog.state = 'swap';
			g.dialog.char = 0;
			g.dialog.part = 0;
			g.dialog.line = 0;
			g.dialog.spriteframe = 0;
			g.dialog.spriteframetimer = 5;
		}, false);
	},
	boxgoal: 0,
	boxcur: 0,
	drawbox: function(timer) {
		if (typeof timer == 'undefined') { var timer = 0; }
		var inc = Math.ceil((g.dialog.boxgoal - g.dialog.boxcur)/(timer+1));
		g.dialog.boxcur += inc;
		g.gfx.draw(g.dialog.boxrec, g.dialog.boxcur, 170, 0, g.gfx.layers.dialog);
	},
	process: function() {
		if (g.dialog.state == 'swap')
		{
			g.dialog.drawbox(g.dialog.spriteframetimer);
			if (g.dialog.part != 0)
			{
				var lpart = g.dialog.data[g.dialog.num][g.dialog.part-1];
				g.dialog.drawsprite(lpart.spritesheet, lpart.lines[lpart.lines.length-1].frames[g.dialog.spriteframe], lpart.side, 5-g.dialog.spriteframetimer);
			}
			if (g.dialog.part != g.dialog.data[g.dialog.num].length)
			{
				var lpart = g.dialog.data[g.dialog.num][g.dialog.part];
				g.dialog.drawsprite(lpart.spritesheet, lpart.lines[0].frames[0], lpart.side, g.dialog.spriteframetimer);
			}
			if (--g.dialog.spriteframetimer <= 0)
			{
				if (g.dialog.data[g.dialog.num].length == g.dialog.part)
				{
					g.dialog.boxgoal = {left: 650, right: -537, center: 650}[g.dialog.data[g.dialog.num][g.dialog.part-1].side];
					g.timeouts.addtimeout(10, function(timer) {
						g.dialog.drawbox(timer);
						if (timer == 0)
						{
							g.frozen = false;
							g.query.active = false;
							if (typeof g.dialog.callback == 'function') {g.dialog.callback();}
						}
					}, true);
					g.dialog.active = false;
				}
				else
				{
					g.dialog.state = 'render';
					g.dialog.spriteframe = 0;
					g.dialog.spriteframetimer = g.dialog.data[g.dialog.num][g.dialog.part].lines[0].timing;
				}
			}
		}
		else if (g.dialog.state == 'render')
		{
			g.dialog.drawbox();
			var line = g.dialog.data[g.dialog.num][g.dialog.part].lines[g.dialog.line];
			if (--g.dialog.spriteframetimer <= 0)
			{
				g.dialog.spriteframetimer = line.timing;
				if (--g.dialog.spriteframe == -1)
				{
					g.dialog.spriteframe = line.frames.length-1;
				}
			}													//don't we all hate it when this happens
			/*var temptext = 
			eval('var tempfunc = function() { g.dialog.drawtext("'++'", "'++'", ' + +'); }');*/
			
			if (g.dialog.char != line.line.length)
				g.dialog.char++;
			g.dialog.drawsprite(g.dialog.data[g.dialog.num][g.dialog.part].spritesheet, line.frames[g.dialog.spriteframe], g.dialog.data[g.dialog.num][g.dialog.part].side);
			if (g.k.frame.space || g.controls.istouch(new Rectangle(g.dialog.boxcur,170,g.dialog.boxcur+537,440))) // advance text!
			{
				g.k.frame.space = false;
				if (line.line.length == g.dialog.char)
				{	//if at end of line go to next line
					g.dialog.char = 0;
					if (++g.dialog.line == g.dialog.data[g.dialog.num][g.dialog.part].lines.length)
					{
						g.dialog.state = 'swap';
						g.dialog.line = 0;
						g.dialog.part++;
						if (g.dialog.part != g.dialog.data[g.dialog.num].length)
						{
							if (g.dialog.data[g.dialog.num][g.dialog.part].side == 'left')
								g.dialog.boxgoal = 88;
							else if (g.dialog.data[g.dialog.num][g.dialog.part].side == 'right')
								g.dialog.boxgoal = 25;
							else
								g.dialog.boxgoal = 57;
						}
					}
					g.dialog.spriteframetimer = 5;
					g.dialog.spriteframe = 0;
				}
				else
				{	//else skip to the end of the line
					g.dialog.char = line.line.length;
				}
			}
			if (g.dialog.state != 'swap')
				g.gfx.drawfunc(g.dialog.drawtext, g.gfx.layers.dialog);
		}
	},
	drawsprite: function(recid, frame, side, timer)
	{
		if (typeof recid == 'undefined') {return;}
		if (typeof timer == 'undefined') { var timer = 0; }
		var flip = {y:false};
		if (side == 'left')
			flip.x = false;
		else
			flip.x = true;
		var rec = g.resources[recid];
		var y = 450 - rec.framey;
		var x = -(timer*(rec.framex-80)/5);
		if (flip.x)
			x = 650 - x - rec.framex;
		g.gfx.draw(recid, x, y, frame, g.gfx.layers.dialog, flip);
	},
	drawtext: function() {
		var part = g.dialog.data[g.dialog.num][g.dialog.part];
		if (typeof part == 'undefined')
			return;
		var text = part.char.toUpperCase() + ': ' + part.lines[g.dialog.line].line.substr(0,g.dialog.char);
		var color = part.color;
		var left = g.dialog.boxcur + 20;
		if (part.side == 'left')
			left = g.dialog.boxcur + 150;
		var width = 350;
		if (part.side == 'center')
			width = 497;
		var top = 195;
		g.c.fillStyle = color;
		g.c.font = "bold 14px 'courier new'";
		if (text.substr(0,3) == '_: ')
			text = text.substr(3);
		while (text != "") {
			var lastlen = 0;
			for (var i = 0; i < text.length; i++) {
				var char = text.substr(i,1);
				if (i == text.length-1) {
					if (g.c.measureText(text.substr(0,i+1)).width > width) { break; }
					lastlen = i+1;
				}
				if (char == ' ' || char == '-') {
					if (g.c.measureText(text.substr(0,i)).width > width) { break; }
					lastlen = i+1;
				}
			}
			if (lastlen == 0) {
			for (; lastlen < text.length; lastlen++)
			{
				if (g.c.measureText(text.substr(0,lastlen)).width > width) { lastlen--; break; }
			}
		}
		g.c.fillText(text.substr(0, lastlen), left, top);
		top += 15;
		text = text.slice(lastlen, text.length);}
	},
	notice: function(text, callback) {
		if (typeof text == 'string')
			text = [text];
		for (var i = 0; i < text.length; i++)
		{
			text[i] = {
				frames: [],
				line: text[i]
			};
		}
		g.dialog.data['_TEMP_'] = [{char:'_',color:'black',lines:text,side:'center'}];
		g.dialog.show('_TEMP_', callback);
	}
};
g.query = {
	show: function(options, x, y, callback)
	{
		g.frozen = true;
		g.query.active = true;
		g.c.font = 'bold 14px "courier new"';
		var rlen = 0;
		var clen = 0;
		for (var i in options)
		{
			var t = g.c.measureText(options[i]).width;
			if (t > rlen)
				rlen = t;
			if (options[i].length > clen)
				clen = options[i].length;
		}
		g.query.width = rlen;
		g.query.height = (options.length)*16;
		g.query.curr = 0;
		g.query.callback = callback;
		g.query.char = 0;
		g.query.timer = 0;
		g.query.maxchar = clen;
		g.query.x = x;
		g.query.y = y;
		g.query.options = options;
		g.k.frame.space = false;	//prevent false triggering
	},
	process: function()
	{
		if (!g.dialog.active)
		{
			if (g.k.frame.up)
			{
				if (--g.query.curr < 0)
					g.query.curr = g.query.options.length-1;
			}
			if (g.k.frame.down)
			{
				if (++g.query.curr >= g.query.options.length)
					g.query.curr = 0;
			}
			if (g.k.frame.space)
			{
				g.query.active = false;
				g.frozen = false;
				g.k.frame.space = false;
				if (typeof g.query.callback == 'function')
				{
					g.query.callback(g.query.curr);
					g.query.queue = [];
				}
			}
		}
		var pottouch = g.controls.istouchfinger(new Rectangle(g.query.x,g.query.y,g.query.width,g.query.height, true));
		if (pottouch >= 0)
		{
			for (var i = 0; i < g.query.options.length; i++)
			{
				if (g.p[pottouch].y >= g.query.y + i*16 && g.p[pottouch].y <= g.query.y + (i+1)*16)
				{
					g.query.active = false;
					g.frozen = false;
					if (typeof g.query.callback == 'function')
					{
						g.query.callback(i);
						g.query.queue = [];
					}
				}
			}
		}
		if (++g.query.timer > 60)
			g.query.timer = 0;
		if (g.query.char != g.query.maxchar)
			g.query.char++;
		g.gfx.drawfunc(function() {
			g.c.fillStyle = '#FF9000';
			g.c.fillRect(g.query.x-23, g.query.y-5, g.query.width + 31, g.query.height+10);
			g.c.fillStyle = '#FFFF00';
			g.c.fillRect(g.query.x-21, g.query.y-2, g.query.width + 27, g.query.height+4);
			g.c.fillStyle = 'black';
			g.c.fillRect(g.query.x-19, g.query.y, g.query.width + 23, g.query.height);
			g.c.font = 'bold 14px "courier new"';
			g.c.fillStyle = 'white';
			for (var i in g.query.options)
			{
				var o = g.query.options[i];
				if (o.length > g.query.char)
					o = o.substr(0,g.query.char);
				g.c.fillText(o, g.query.x, g.query.y + 12 + 16*i);
			}
			if (g.query.timer < 30)
				g.c.fillText('>', g.query.x-14, g.query.y + 12 + 16*g.query.curr);
		}, g.gfx.layers.dialog);
	},
	queueoption: function(text, callback) {
		g.query.queue[g.query.queue.length] = {text:text, callback:callback};
	},
	queue: [],
	clearqueue: function() {
		if (!g.query.queue.length || g.query.active)
			return;
		var lines = [];
		for (var i in g.query.queue)
			lines[i] = g.query.queue[i].text;
		lines[lines.length] = 'Cancel';
		g.query.show(lines, 250,100, function(num) { if(num==g.query.queue.length) {return;} g.query.queue[num].callback(); });
	}
};