g.loading = {
	active: false,
	load: function(list) { //0 - load
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
				function temp2(index) {
					return function() {
						g.resources[index].loaded = true;
					};
				}
				a.addEventListener('canplaythrough', temp2(i), false);
				g.resources[i].data = a;
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
	process: function() { //1 - loading
		if (!g.loading.done)
		{
			g.c.drawImage(document.getElementById('loadimg'),0,0);
			var total = 0;
			var loaded = 0;
			for (var i in g.loading.list)
			{
				total += g.resources[i].size;
				if (g.resources[i].type == 'image' && g.resources[i].data.complete) {
					loaded += g.resources[i].size; g.resources[i].loaded = true; }
				else if (g.resources[i].type == 'music' && g.resources[i].loaded)
					loaded += g.resources[i].size;
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
					var tarr = {
						0: 0,
						0xFFFFFF: 1
					};
					var tnext = 2;
					for (var index = 0; index < cdata.length; index+=4)
					{
						var tmp = (cdata[index]<<16)+(cdata[index+1]<<8)+cdata[index+2];
						if (typeof tarr[tmp] == 'undefined')
						{
							tarr[tmp] = tnext;
							tnext++;
						}
						pdata[rndex] = tarr[tmp];
						rndex++;
					}
					eval('g.resources[i].getData = function(x,y) { if (x < 0 || x > '+rec.data.width+' || y < 0 || y > '+rec.data.height+') {return 1;} return g.resources['+i+'].data[x + y*'+rec.data.width+']; }');	//whyyyyy
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