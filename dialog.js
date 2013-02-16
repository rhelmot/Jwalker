g.dialog = {
	prefs: {},				//SETME
	box: {					//SETME
		rec: 0,
		margintop: 170,
		marginside: 25,		//refers to the distance between the box and the edge closest to the edge of the canvas
		paddingtop: 13,
		paddinglargeside: 150,
		paddingsmallside: 20
	},
	data: {},
	active: false,
	spriteframe: 0,
	spriteframetimer: 0,
	num: 0,
	part: 0,
	line: 0,
	char: 0,
	state: '',
	init: function (rec) {
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
				//side = '';
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
				console.log('Error parsing asset '+rec.filename+', line '+(l+1)+': speaker '+linedeg[0][1]+' is not defined.');
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
				g.dialog.data[num][part] = {char: linedeg[0][1], 'side':side, lines: []};
				if (linedeg[0][1] == '_')
					g.dialog.data[num][part].side = 'center';
				line = 0;
			}
			g.dialog.data[num][part].lines[line] = { line: linedeg[1], frame: linedeg[0][0] };
			line++;
		}
	},
	boxgoals: {
		left: function () {return 650-g.resources[g.dialog.box.rec].framex-g.dialog.box.marginside}, 
		right: function () {return g.dialog.box.marginside}, 
		center: function () {return Math.floor((650-g.resources[g.dialog.box.rec].framex)/2)}
	},
	show: function (num, callback)
	{
		if (g.dialog.data[num] == null)
		{
			console.log('Warning: no such dialog called "'+num+'".');
			return;
		}
		g.dialog.callback = callback;
		g.frozen = true;
		g.dialog.boxcur = 650;
		g.dialog.boxgoal = g.dialog.boxgoals[g.dialog.data[num][0].side]();
		g.timeouts.addtimeout(10, g.dialog.drawbox, true);
		g.timeouts.addtimeout (10, function (timer) {
			g.dialog.active = true;
			g.dialog.num = num;
			g.dialog.state = 'swap';
			g.dialog.char = 0;
			g.dialog.atend = false;
			g.dialog.part = 0;
			g.dialog.line = 0;
			g.dialog.spriteframe = 0;
			g.dialog.spriteframetimer = 5;
			if (g.dialog.data[num][0].char != '_')
				g.query.show(['Close conversation'],250,75,function () { g.dialog.active = false; });
		}, false);
	},
	boxgoal: 0,
	boxcur: 0,
	drawbox: function (timer) {
		if (typeof timer == 'undefined') timer = 0;
		var inc = Math.ceil((g.dialog.boxgoal - g.dialog.boxcur)/(timer+1));
		g.dialog.boxcur += inc;
		g.gfx.draw(g.dialog.box.rec, g.dialog.boxcur, g.dialog.box.margintop, 0, g.gfx.layers.dialog);
	},
	process: function () {
		var part = g.dialog.data[g.dialog.num][g.dialog.part];
		if (g.dialog.state == 'swap')
		{
			g.dialog.drawbox(g.dialog.spriteframetimer);
			if (g.dialog.part != 0)
			{
				var lpart = g.dialog.data[g.dialog.num][g.dialog.part-1];
				if (typeof g.dialog.prefs[lpart.char].spritesheet == 'number')
					g.dialog.drawsprite(g.dialog.prefs[lpart.char].spritesheet, g.dialog.prefs[lpart.char].states[lpart.lines[lpart.lines.length-1].frame].frames[g.dialog.spriteframe], lpart.side, 5-g.dialog.spriteframetimer);
			}
			if (g.dialog.part != g.dialog.data[g.dialog.num].length)
			{
				var lpart = g.dialog.data[g.dialog.num][g.dialog.part];
				if (typeof g.dialog.prefs[lpart.char].spritesheet == 'number')
					g.dialog.drawsprite(g.dialog.prefs[lpart.char].spritesheet, g.dialog.prefs[lpart.char].states[lpart.lines[0].frame].frames[0], lpart.side, g.dialog.spriteframetimer);
			}
			if (--g.dialog.spriteframetimer <= 0)
			{
				if (g.dialog.data[g.dialog.num].length == g.dialog.part)		//end of dialog, animate out
				{
					g.dialog.boxgoal = {left: 650, right: -537, center: 650}[g.dialog.data[g.dialog.num][g.dialog.part-1].side];
					g.timeouts.addtimeout(10, function (timer) {
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
					if (g.dialog.data[g.dialog.num][g.dialog.part].char != '_')
						g.dialog.spriteframetimer = g.dialog.prefs[g.dialog.data[g.dialog.num][g.dialog.part].char].states[g.dialog.data[g.dialog.num][g.dialog.part].lines[0].frame].timing;
					g.dialog.prerendertext();
				}
			}
		}
		else if (g.dialog.state == 'render')
		{
			g.dialog.drawbox();
			var character = g.dialog.prefs[part.char];
			var line = part.lines[g.dialog.line];
			if (--g.dialog.spriteframetimer <= 0 && g.dialog.data[g.dialog.num][g.dialog.part].char != '_')
			{
				g.dialog.spriteframetimer = character.states[line.frame].timing;
				if (--g.dialog.spriteframe == -1)
					g.dialog.spriteframe = character.states[line.frame].frames.length-1;
			}
			
			if (!g.dialog.atend)
				g.dialog.char++;
			if (g.dialog.data[g.dialog.num][g.dialog.part].char != '_')
				g.dialog.drawsprite(character.spritesheet, character.states[line.frame].frames[g.dialog.spriteframe], part.side);
			for (var i = 0; i < g.dialog.activeurls.length; i++)
			{
				if (g.controls.istouch(g.dialog.activeurls[i].dim))
				{
					var url = g.dialog.activeurls[i].url;										//should hopefully properly scope?
					g.list.add('Open new page', function () {window.open(url, '_blank');});
				}
			}
			if (g.k.frame.space || g.controls.istouch(new Rectangle(0,g.dialog.box.margintop,650,450))) // advance text!
			{
				g.k.frame.space = false;
				if (g.dialog.atend)
				{	//if at end of line go to next line
					g.dialog.char = 0;
					g.dialog.atend = false;
					if (++g.dialog.line == part.lines.length)
					{
						g.dialog.state = 'swap';
						g.dialog.line = 0;
						g.dialog.part++;
						if (g.dialog.part != g.dialog.data[g.dialog.num].length)
							g.dialog.boxgoal = g.dialog.boxgoals[g.dialog.data[g.dialog.num][g.dialog.part].side]();
					}
					else
						g.dialog.prerendertext();
					g.dialog.spriteframetimer = 5;
					g.dialog.spriteframe = 0;
				}
				else
					g.dialog.atend = true;
			}
			if (g.dialog.state != 'swap')
				g.gfx.drawfunc(g.dialog.drawtext, g.gfx.layers.dialog);
		}
	},
	drawsprite: function (recid, frame, side, timer)
	{
		if (typeof recid == 'undefined') return;
		if (typeof timer == 'undefined') timer = 0;
		var flip = {x:true,y:false};
		if (side == 'left')
			flip.x = false;
		var rec = g.resources[recid];
		var y = 450 - rec.framey;
		var x = -(timer*(rec.framex-80)/5);
		if (flip.x)
			x = 650 - x - rec.framex;
		g.gfx.draw(recid, x, y, frame, g.gfx.layers.dialog, flip);
	},
	activeurls: [],
	prerendertext: function () {
		var part = g.dialog.data[g.dialog.num][g.dialog.part];
		var text = ((part.char=='_')?'':(part.char.toUpperCase() + ': ')) + part.lines[g.dialog.line].line;
		var textarr = [];
		var style = {font: 'courier', size: '14px', color: g.dialog.prefs[part.char].color, bold: false, italics: false, underline: false, strike: false, newline: false};
		/*for (var i in g.dialog.prefs[part.char].style)
			style[i] = g.dialog.prefs[part.char].style[i];
		if (g.dialog.prefs[part.char].color)
			style.color = g.dialog.prefs[part.char];*/
		for (var i = 0; i < text.length; i++)
		{
			if (text[i] != '[')
				continue;
			var cutchars = 3;
			var newstyle = {};
			if (text.substr(i,3) == '[u]')
				newstyle.underline = true;
			else if (text.substr(i,4) == '[/u]')
				{ newstyle.underline = false; cutchars = 4; }
			else if (text.substr(i,4) == '[\\n]')
				{ newstyle.newline = true; cutchars = 4; }
			else if (text.substr(i,3) == '[b]')
				newstyle.bold = true;
			else if (text.substr(i,4) == '[/b]')
				{ newstyle.bold = false; cutchars = 4; }
			else if (text.substr(i,3) == '[i]')
				newstyle.italics = true;
			else if (text.substr(i,4) == '[/i]')
				{ newstyle.italics = false; cutchars = 4; }
			else if (text.substr(i,3) == '[s]')
				newstyle.strike = true;
			else if (text.substr(i,4) == '[/s]')
				{ newstyle.strike = false; cutchars = 4; }
			else if (text.substr(i,7) == '[color=')
			{
				cutchars = text.indexOf(']',i);
				if (cutchars == -1)
					continue;
				newstyle.color = text.substring(i+7, cutchars);
				cutchars = cutchars - i + 1;
			}
			else if (text.substr(i,8) == '[/color]')
				{ newstyle.color = g.dialog.prefs[part.char].color; cutchars = 8; }
			else if (text.substr(i,5) == '[url]')
			{
				newstyle.underline = true;
				newstyle.color = '#00E';
				cutchars = 5;
				newstyle.url = true;
			}
			else if (text.substr(i,6) == '[/url]')
			{
				newstyle.underline = false;
				newstyle.color = g.dialog.prefs[part.char].color;
				cutchars = 6;
				newstyle.url = false;
			}
			else if (text.substr(i,5) == '[url=')
			{
				cutchars = text.indexOf(']',i);
				if (cutchars == -1)
					continue;
				newstyle.underline = true;
				newstyle.color = '#00E';
				newstyle.url = text.substring(i+5, cutchars);
				cutchars = cutchars - i + 1;
			}
			else if (text.substr(i,6) == '[size=')
			{
				cutchars = text.indexOf(']',i);
				if (cutchars == -1)
					continue;
				newstyle.size = text.substring(i+6, cutchars);
				if (parseInt(newstyle.size) == newstyle.size)
					newstyle.size += 'px';
				cutchars = cutchars - i + 1;
			}
			else if (text.substr(i,7) == '[/size]')
				{ newstyle.size = '14px'; cutchars = 7; }
			else if (text.substr(i,6) == '[font=')
			{
				cutchars = text.indexOf(']',i);
				if (cutchars == -1)
					continue;
				newstyle.font = text.substring(i+6, cutchars);
				cutchars = cutchars - i + 1;
			}
			else if (text.substr(i,7) == '[/font]')
				{ newstyle.font = 'courier'; cutchars = 7; }
			else
				continue;
			/*if (textarr.length != 0 && textarr[textarr.length-1].text == '')
				textarr[textarr.length-1] = { text: text.substr(0,i), style: repointer(style)};
			else
				textarr[textarr.length] = { text: text.substr(0,i), style: repointer(style)};*/		//disallowed double-newlines and caused bugs; had to go :(
			textarr[textarr.length] = { text: text.substr(0,i), style: repointer(style)};
			style.newline = false;
			for (var j in newstyle)
				style[j] = newstyle[j];
			text = text.substr(i+cutchars);
			i = -1;
		}
		if (text != '')
			textarr[textarr.length] = { text: text, style: repointer(style)};
		text = [];
		var start = 0;
		var width = g.resources[g.dialog.box.rec].framex - g.dialog.box.paddingsmallside - (part.side=='center'?g.dialog.box.paddingsmallside:g.dialog.box.paddinglargeside);
		function breakline() {
			text[text.length] = {
				text: textarr[i].text.substring(lastbreak, lastsafe), 
				width: g.c.measureText(textarr[i].text.substring(lastbreak, lastsafe)).width, 
				style: repointer(textarr[i].style)
			};
			textarr[i].style.newline = true;
			lastbreak = lastsafe;
			start = 0;
		}
		for (var i = 0; i < textarr.length; i++)
		{
			g.gfx.settextstyle(textarr[i].style)
			var lastsafe = 0;
			var lastbreak = 0;
			if (textarr[i].style.newline)
				start = 0;
			for (var j = 0; j < textarr[i].text.length; j++)
			{
				if (g.c.measureText(textarr[i].text.substring(lastbreak,j+1)).width + start > width)
				{
					if (lastbreak == lastsafe)
					{
						if (start == 0)
						{
							lastsafe = j;
							breakline();
						}
						else
						{
							start = 0;
							textarr[i].style.newline = true;
						}
					}
					else
						breakline();
				}
				switch(textarr[i].text[j]) {
					case ' ':
					case '.':
					case '?':
					case '!':
					case '/':
					case '\\':
					case '-':
					case '_':
					case '~':
					lastsafe = j+1;
					default:
					break;
				}
			}
			text[text.length] = {
				text: textarr[i].text.substr(lastbreak), 
				width: g.c.measureText(textarr[i].text.substr(lastbreak)).width, 
				style: repointer(textarr[i].style)
			};
			start += text[text.length-1].width;
		}
		g.dialog.processedtext = text;
	},
	drawtext: function () {
		var remaining = g.dialog.char;
		var basex = g.dialog.boxcur + ((g.dialog.data[g.dialog.num][g.dialog.part].side=='left')?g.dialog.box.paddinglargeside:g.dialog.box.paddingsmallside);
		var left = basex;
		var top = g.dialog.box.margintop+g.dialog.box.paddingtop;
		var maxheight = 0;
		g.c.textBaseline = 'top';
		g.dialog.activeurls = [];
		for (var i = 0; i < g.dialog.processedtext.length; i++)
		{
			if (g.dialog.processedtext[i].style.newline)
			{
				left = basex;
				top += maxheight + 1;
				maxheight = 0;
			}
			var height = parseInt(g.dialog.processedtext[i].style.size);
			if (height > maxheight) maxheight = height;
			g.gfx.settextstyle(g.dialog.processedtext[i].style);
			if (!g.dialog.atend && g.dialog.processedtext[i].text.length >= remaining)
			{
				g.c.fillText(g.dialog.processedtext[i].text.substr(0,remaining),left,top);
				var width = g.c.measureText(g.dialog.processedtext[i].text.substr(0,remaining)).width;
				if (g.dialog.processedtext[i].style.underline)
				{
					g.c.fillRect(left,top+Math.ceil(height*0.9),width,Math.ceil(height/15));
				}
				if (g.dialog.processedtext[i].style.strike)
				{
					g.c.fillRect(left,top+Math.ceil(height*0.5),width,Math.ceil(height/15));
				}
				g.c.textBaseline = 'alphabetic';
				return;
			}
			else
			{
				g.c.fillText(g.dialog.processedtext[i].text,left,top);
				if (g.dialog.processedtext[i].style.underline)
				{
					g.c.fillRect(left,top+Math.ceil(height*0.9),
								g.dialog.processedtext[i].width,Math.ceil(height/15));
				}
				if (g.dialog.processedtext[i].style.strike)
				{
					g.c.fillRect(left,top+Math.ceil(height*0.5),
								g.dialog.processedtext[i].width,Math.ceil(height/15));
				}
				if (g.dialog.processedtext[i].style.url)
				{
					if (g.dialog.processedtext[i].style.url === true)
						g.dialog.processedtext[i].style.url = g.dialog.processedtext[i].text;
					g.dialog.activeurls[g.dialog.activeurls.length] = {url: g.dialog.processedtext[i].style.url, dim: new Rectangle(left, top, g.dialog.processedtext[i].width, height, true)};
				}
				left += g.dialog.processedtext[i].width;
				remaining -= g.dialog.processedtext[i].text.length;
			}
		}
		g.dialog.atend = true;
		g.c.textBaseline = 'alphabetic';
		/*var part = g.dialog.data[g.dialog.num][g.dialog.part];
		if (typeof part == 'undefined')
			return;
		var text = part.char.toUpperCase() + ': ' + part.lines[g.dialog.line].line.substr(0,g.dialog.char);
		var color = part.color;
		var left = g.dialog.boxcur + g.dialog.box.paddingsmallside;
		if (part.side == 'left')
			left = g.dialog.boxcur + g.dialog.box.paddinglargeside;
		var width = g.resources[g.dialog.box.rec].framex - g.dialog.box.paddingsmallside - (part.side=='center'?g.dialog.box.paddingsmallside:g.dialog.box.paddinglargeside);
		var top = g.dialog.box.margintop+g.dialog.box.paddingtop;
		g.c.fillStyle = color;
		g.c.font = "14px courier";
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
		text = text.slice(lastlen, text.length);}*/
	},
	notice: function (text, callback) {
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
	show: function (options, x, y, callback)
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
	process: function ()
	{
		if (!g.dialog.active)
		{
			if (g.k.frame.up)
			{
				g.query.timer = 0;
				if (--g.query.curr < 0)
					g.query.curr = g.query.options.length-1;
			}
			if (g.k.frame.down)
			{
				g.query.timer = 0;
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
		g.gfx.drawfunc(function () {
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
		}, g.gfx.layers.ui);
	},
	queueoption: function (text, callback) {
		g.query.queue[g.query.queue.length] = {text:text, callback:callback};
	},
	queue: [],
	clearqueue: function () {
		if (!g.query.queue.length || g.query.active)
			return;
		var lines = [];
		for (var i in g.query.queue)
			lines[i] = g.query.queue[i].text;
		lines[lines.length] = 'Cancel';
		g.query.show(lines, 250,100, function (num) { if(num==g.query.queue.length) {return;} g.query.queue[num].callback(); });
	}
};