g.loading = {
	active: false,
	load: function(list) {
		for (var ii in list)
		{
			var i = list[ii];
			if (g.resources[i].loaded)
			{
				delete list[ii];
				continue;
			}
			if (g.resources[i].type == 'image')
			{
				g.resources[i].data = new Image();
				g.resources[i].data.src = g.recRoot + g.resources[i].filename;
			}
			else if (g.resources[i].type == 'music')
			{
				var a = new Audio();
				if (g.mobile)
					a.preload = 'none';
				//g.loading.hackloadlistener(i);
				var atypes = {mp3:'audio/mpeg',ogg:'audio/ogg'};
				var broken = false;
				for (var j = 0; j < g.resources[i].extensions.length; j++)
				{
					if (a.canPlayType(atypes[g.resources[i].extensions[j]]) != '')
					{
						a.src = g.recRoot + g.resources[i].filename + '.' + g.resources[i].extensions[j];
						broken = true;
						break;
					}
				}
				if (!broken)
				{
					g.resources[i].type = 'null';
					g.resources[i].use = 'cantPlayAudioFormat';
					g.resources[i].loaded = true;
				}
				g.resources[i].data = a;
				if (g.mobile)
					eval('g.list.add("Load '+{bgm:'music track',sfx:'sound effect'}[g.resources[i].use]+': '+g.resources[i].size+' KB", function() {g.resources['+i+'].data.load();}, function() {g.resources['+i+'].type="null"; g.resources['+i+'].use="userRejectedLoad"; g.resources['+i+'].loaded=true;});');
			}
			else if (g.resources[i].type == 'text')
			{
				g.resources[i].client = new XMLHttpRequest();
				g.resources[i].client.open('GET', g.recRoot + g.resources[i].filename);
				function temp(index) {
					return function() {
						if (typeof g.resources[index].client == 'object' && g.resources[index].client.readyState == 4)
						{
							g.resources[index].data = g.resources[index].client.responseText;
							g.resources[index].loaded = true;
							delete g.resources[index].client;
						}
					};
				}
				g.resources[i].client.onreadystatechange = temp(i);
				g.resources[i].client.send();
			}
		}
		g.loading.list = list;
		g.loading.active = true;
		g.loading.done = false;
		g.loading.processed = false;
	},
	hackloadlistener: function(id)
	{
		return 'g.resources['+id+'].data.addEventListener("canplaythrough", function() {g.resources['+id+'].loaded = true;}, false);';
	},
	process: function() {
		if (!g.loading.done)
		{
			g.c.drawImage(document.getElementById('loadimg'),0,0);
			var total = 0;
			var loaded = 0;
			for (var i in g.loading.list)
			{
				if (g.resources[i].type != 'null')
					total += g.resources[i].size;
				if (g.resources[i].type == 'image' && g.resources[i].data.complete) {
					loaded += g.resources[i].size; g.resources[i].loaded = true; }
				else if (g.resources[i].type == 'music' && (g.resources[i].data.readyState > 3 || g.mobile)) {
					loaded += g.resources[i].size; g.resources[i].loaded = true;}
				else if (g.resources[i].type == 'text' && g.resources[i].loaded)
					loaded += g.resources[i].size;
			}
			var perc = 100*loaded/total;
			g.c.fillText(Math.floor(perc)+'%',320,400);
			g.loading.done = (total == loaded);
		}
		else if (!g.loading.processed)
		{
			g.c.drawImage(document.getElementById('loadimg'),0,0);
			g.c.fillText('100%',320,400);
			for (var i in g.loading.list)
			{
				var rec = g.resources[i];
				if (rec.type == 'text' && rec.use == 'dialog')
					g.dialog.init(rec);
				else if (rec.type == 'image' && rec.use == 'hitbox')
				{
					var canvas = document.createElement('canvas');
					canvas.width = rec.data.width;
					canvas.height = rec.data.height;
					var cxt = canvas.getContext('2d');
					cxt.drawImage(rec.data, 0, 0);
					var cdata = cxt.getImageData(0,0,canvas.width, canvas.height).data;
					var pdata = [];
					var rndex = 0;
					var tnext = 2;
					for (var index = 0; index < cdata.length; index+=4)
					{
						var tmp = (cdata[index]<<16)+(cdata[index+1]<<8)+cdata[index+2];
						if (typeof g.gfx.pixels[tmp] == 'undefined')
						{
							g.gfx.pixels[tmp] = tnext;
							tnext++;
						}
						pdata[rndex] = g.gfx.pixels[tmp];
						rndex++;
					}
					var bits = [rec.offset?(rec.offset.x):('0'), rec.offset?(rec.data.width+rec.offset.x):(rec.data.width), rec.offset?(rec.offset.y):('0'), rec.offset?(rec.data.height+rec.offset.y):(rec.data.height), rec.offset?(rec.offset.x):('0'), rec.offset?(rec.offset.y):('0')];
					eval('g.resources[i].getData = function(x,y) { if (x < '+bits[0]+' || x > '+bits[1]+' || y < '+bits[2]+' || y > '+bits[3]+') {return 1;} return g.resources['+i+'].data[(x - '+bits[4]+') + (y - '+bits[5]+')*'+rec.data.width+']; }');	//whyyyyy
					g.resources[i].data = pdata;
					
				}
			}
			g.timeouts.addtimeout(60,function(timer) {
					g.area.loadarea(g.area.currentarea, 'inout', 'black', 'start');
					g.timeouts.addtimeout(30,function() { g.loading.active = false; }, false);
				}, false);
			g.loading.processed = true;
		}
		else
		{
			g.gfx.drawfunc(function() {
				g.c.drawImage(document.getElementById('loadimg'),0,0);
				g.c.fillText('100%',320,400);
			}, g.gfx.layers.fading);
		}
	}
};