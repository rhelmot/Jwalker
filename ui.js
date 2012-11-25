g.ui = {
	vollvl: 3,
	showncontrols: false,
	controlsframe: 0,
	volrec: 0,				//SETME - asset to use for volume control
	volrect: {},			//SETME - Rectangle to use for volume active zone and drawing area
	optrec: 0,				//SETME - asset to use for options button
	optrect: {},			//SETME - Rectangle to use for options active zone and drawing area
	controlsrec: 0,			//SETME - asset to use for controls button
	controlsrect: {},		//SETME - Rectangle to use for controls active zone and drawing area
	aboutdlg: '',			//SETME - dialog to use for 'About' text
	controlsdlg: '',		//SETME - dialog to use for 'Controls' text. KEEP IN MIND: first line will be overwritten with controls description. (see controls.js)
	enabled: true,
	
	process: function()
	{
		if (!g.ui.enabled)
			return;
		if (!g.mobile && g.controls.istouch(g.ui.volrect))
		{
			if (++g.ui.vollvl>3)
				g.ui.vollvl = 0;
			g.audio.setvol(g.ui.vollvl/3);
		}
		else if (g.controls.istouch(g.ui.optrect) && !g.frozen)
		{
			g.query.show(['Save/Load Game...','Control Settings','Debug...','About','Cancel'], 450, 65, function(num) {
				if (num == 3)
					g.dialog.show(g.ui.aboutdlg);
				else if (num == 2)
				{
					g.query.show([(g.debug.enabled?'Disable':'Enable')+' Dev Screen', 'Send Bug Report', 'Cancel'], 450, 65, function(num2) {
						if (num2 == 0)
							g.debug.enabled = !g.debug.enabled;
						else if (num2 == 1)
							g.dialog.notice('Hahaha, no. This feature doesn\'t work yet.');
					});
				}

				else if (num == 1)
				{
					var keysets = [];
					for (var i = 0; i < g.controls.keysets.length; i++)
						keysets[i] = g.controls.keysets[i].name;
					g.query.show(keysets, 450, 65, function(num2) {
						g.controls.keyset = num2;
					});
				}
				else if (num == 0)
				{
					var o = ['Save Game'];
					var s = JSON.parse(localStorage.getItem('saves'));
					for (var i in s)
					{
						var k = s[i].split('-');
						if (k[0] != g.num)
							continue;
						var d = new Date() - k[1];
						if (d > 86400000*4)
							o[o.length] = "Load Game: " + Math.floor(d/86400000) + " days ago";
						else if (d > 3600000)
							o[o.length] = "Load Game: " + Math.floor(d/3600000) + " hour"+((d>3600000*2)?"s":"")+" ago";
						else if (d > 60000)
							o[o.length] = "Load Game: " + Math.floor(d/60000) + " minute"+((d>60000*2)?"s":"")+" ago";
						else
							o[o.length] = "Load Game: " + Math.floor(d/1000) + " second"+((d>2000)?"s":"")+" ago";
					}
					o[o.length] = 'Cancel';
					g.query.show(o, 400, 65, function(num) {
						if (num == 0)
							g.save.save();
						else if (g.query.options[num] == 'Cancel')
							return;
						else
							g.save.load(num-1);
					});
				}
			});
		}
		else if (g.controls.istouch(g.ui.controlsrect) && !g.frozen)
		{
			g.ui.showncontrols = true;
			g.ui.controlsframe = 0;
			g.dialog.data[g.ui.controlsdlg][0].lines[0].line = g.controls.keysets[g.controls.keyset].description;
			g.dialog.show(g.ui.controlsdlg);
		}
		if (!g.mobile)
			g.gfx.draw(g.ui.volrec,g.ui.volrect.x1,g.ui.volrect.y1,g.ui.vollvl,g.gfx.layers.ui);
		g.gfx.draw(g.ui.optrec, g.ui.optrect.x1, g.ui.optrect.y1, 0, g.gfx.layers.ui);
		if (!g.ui.showncontrols)
			if (++g.ui.controlsframe >= 15) {g.ui.controlsframe = 0;}
		g.gfx.draw(g.ui.controlsrec, g.ui.controlsrect.x1, g.ui.controlsrect.y1, g.ui.controlsframe, g.gfx.layers.ui);
	}
};
g.save = {
	serialize: function() {
		var dsv = [];
		for (var i in g.resources)
		{
			if (typeof g.resources[i].data == 'object' && g.resources[i].use != 'quiltdata')
			{
				dsv[i] = {data: g.resources[i].data, loaded: g.resources[i].loaded};
				delete g.resources[i].data;
				g.resources[i].loaded = false;
			}
			else
				dsv[i] = false;
		}
		var c = g.c;
		delete g.c;
		var svst = JSON.stringify(g, function (key, val) {if (typeof val == 'function') { return val.toString(); } return val;});
		for (var i in g.resources)
		{
			if (dsv[i])
			{
				g.resources[i].data = dsv[i].data;
				g.resources[i].loaded = dsv[i].loaded;
			}
		}
		g.c = c;
		return svst;
	},
	save: function() {
		var svst = g.save.serialize();
		var games = JSON.parse(localStorage.getItem('saves'));
		if (games == null)
			games = [];
		var ts = Date.parse(new Date());
		games[games.length] = g.num + '-' + ts;
		localStorage.setItem('saves', JSON.stringify(games));
		localStorage.setItem(ts, svst);
	},
	load: function(num) {
		var games = JSON.parse(localStorage.getItem('saves'));
		var j = 0;
		var broken = false;
		for (var i in games)
		{
			var k = games[i].split('-');
			if (k[0] != g.num)
				continue;
			if (j == num)
			{
				broken = true;
				break;
			}
			j++;
		}
		if (!broken)
		{
			console.log('Warning: Invalid save number in g.save.load()');
			return;
		}
		var ts = games[j].split('-')[1];
		var svst = localStorage.getItem(ts);
		var sv = g.save.deserialize(svst);
		g.audio.setvol(sv.audio.globalvol);
		g.audio.play(sv.audio.currentbgm);
		g = sv;		//god help us all
		localStorage.removeItem(ts);
		for (var i = j+1; i < games.length; i++)
			games[i-1] = games[i];
		games = games.slice(0, games.length-1);
		localStorage.setItem('saves', JSON.stringify(games));
	},
	deserialize: function(gstr) {
		var sv = JSON.parse(gstr);
		sv = g.save.refunction(sv);
		sv.c = g.c;
		for (var i in g.resources)
		{
			if (g.resources[i].loaded)
			{
				sv.resources[i].loaded = true;
				sv.resources[i].data = g.resources[i].data;
			}
		}
		return sv;
	},
	refunction: function(obj) {
		for (var i in obj)
		{
			if (typeof obj[i] == 'object')
				obj[i] = this.refunction(obj[i]);
			else if (typeof obj[i] == 'string' && obj[i].substr(0,8) == 'function')
				eval('obj[i] = ' + obj[i]);
		}
		return obj;
	}
};

g.list = {
	list: [],
	add: function(text, pass, fail) {
		if (typeof fail != 'function')
			fail = function() {};
		g.list.list[g.list.list.length] = {'text':text, 'pass':pass, 'fail':fail};
	},
	check: function() {
		if (g.list.list.length > 0)
		{
			for (var i = 0; i < g.list.list.length; i++)
			{
				var li = document.createElement('li');
				var checkbox = document.createElement('input');
				checkbox.type = 'checkbox';
				checkbox.id = 'checklist'+i;
				checkbox.checked = true;
				var text = document.createTextNode(g.list.list[i].text);
				li.appendChild(checkbox);
				li.appendChild(text);
				document.getElementById('itemlist').appendChild(li);
			}
			g.c.globalAlpha = 0.5;
			g.c.fillStyle = 'black';
			g.c.fillRect(0,0,650,450);
			g.c.globalAlpha = 1;
			document.getElementById('messagediv').style.display = 'block';
			kill();
		}
	},
	accept: function() {
		var check;
		for (var i = 0; check=document.getElementById('checklist'+i); i++)
		{
			if (check.checked)
				g.list.list[i].pass();
			else
				g.list.list[i].fail();
		}
		g.list.list = [];
		document.getElementById('messagediv').style.display = 'none';
		document.getElementById('itemlist').innerHTML = '';
		birth();
		return false;
	}
};