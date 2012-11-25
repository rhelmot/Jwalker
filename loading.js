g.loading = {
	atypes: {mp3:'audio/mpeg',ogg:'audio/ogg'},
	percent: {font: 'bold 14px "courier new"', color: 'black', x:320, y:350},		//SETME - Optional
	active: false,
	loadqueue: [],
	processqueue: [],
	failqueue: [],
	loaddata: {recid: false},
	processdata: false,
	add: function(list, callback) {
		var any = g.loading.active;
		for (var ii in list)
		{
			var i = list[ii];
			if (!g.resources[i])
				continue;
			if (g.resources[i].type == 'meta')
			{
				switch (g.resources[i].use) {
					case 'quiltdata':
					var full = g.resources[i].data[0];
					for (var j = 1; j < g.resources[i].data.length; j++)
						full = full.concat(g.resources[i].data[j]);
					any = any | g.loading.add(full);
					continue;
					
					default:
					console.log('Warning: Unknown use of metadata in resource #'+i);
				}
			}
			if (g.loading.should_load(i))
			{
				g.loading.loadqueue[g.loading.loadqueue.length] = i;
				any = true;
			}
		}
		g.loading.active = any;
		if (typeof callback == 'function')
			g.loading.callback = callback;
		return any;
	},
	should_load: function(rec) {
		if (!g.resources[rec])
		{
			console.log('Warning: Attempting to load nonexistant resource '+rec);
			return false;
		}
		if (g.resources[rec].loaded)
			return false;
		var lim = g.loading.loadqueue.length;
		lim = (g.loading.processqueue.length>lim)?g.loading.processqueue.length:lim;
		for (var i = 0; i < lim; i++)
		{
			if (g.loading.loadqueue[i] == rec || g.loading.processqueue[i] == rec)
				return false;
		}
		return true;
	},
	work: function() {
		g.loading.load();
		g.loading.process();
		g.loading.draw();
		g.loading.error();
		if (!g.loading.processqueue.length && !g.loading.loadqueue.length && !g.loading.failqueue.length && g.loading.processdata===false && g.loading.loaddata.recid===false)
		{
			g.loading.processout = 0;
			if (typeof g.loading.callback == 'function')
			{
				g.loading.callback();
				g.loading.callback = null;
			}
		}
	},
	checkaudio: function(id) {
		var rec = g.resources[id];
		if (rec.cantplay)
			return false;
		var a = new Audio();
		for (var j = 0; j < rec.extensions.length; j++)
		{
			if (a.canPlayType(g.loading.atypes[rec.extensions[j]]) != '')
			{
				rec.mimetype = g.loading.atypes[rec.extensions[j]];
				return [g.loading.atypes[rec.extensions[j]], rec.extensions[j]];
			}
		}
		console.log('Error: Browser reported unable to play audio format.');
		rec.cantplay = true;
		return false;
	},
	load: function() {
		if (g.loading.loaddata.recid === false)
		{
			if (!g.loading.loadqueue.length)
				return;
			g.loading.loaddata = {};
			var i = g.loading.loadqueue.shift();
			g.loading.loaddata.filename = g.resources[i].filename;
			g.loading.loaddata.type = g.resources[i].type;
			g.loading.loaddata.use = g.resources[i].use;
			g.loading.loaddata.size = g.resources[i].size;
			g.loading.loaddata.recid = i;
			g.loading.loaddata.loadedsize = 0;
			if (window.Blob && window.URL && window.URL.createObjectURL)
			{
				g.loading.loaddata.method = 1;
				if (g.loading.loaddata.type == 'audio')
				{
					var mimetype = g.loading.checkaudio(i);
					if (!mimetype)
					{
						g.loading.loaddata.recid = false;;
						return;
					}
					g.loading.loaddata.mimetype = mimetype[0];
					g.loading.loaddata.filename += '.'+mimetype[1];
				}
				var client = new XMLHttpRequest();
				client.open('GET', g.recRoot + g.loading.loaddata.filename);
				client.responseType = ((g.loading.loaddata.type=='text')?'text':'blob');
				client.onprogress = function(e) {
					g.loading.loaddata.loadedsize = e.loaded / 1024;
					g.loading.loaddata.size = e.total / 1024;
				}
				client.onerror = function(e) {
					g.loading.failqueue[g.loading.failqueue.length] = g.loading.loaddata.recid;
					g.loading.loaddata.recid = false;
				}
				client.onload = function(e) {
					g.loading.loaddata.fin = true;
					g.loading.loaddata.data = this.response;
				}
				client.send();
				g.loading.loaddata.client = client;
			}
			else
			{
				g.loading.loaddata.method = 0;
				if (g.loading.loaddata.type == 'image')
				{
					g.loading.loaddata.data = new Image();
					g.loading.loaddata.data.src = g.recRoot + g.loading.loaddata.filename;
				}
				else if (g.loading.loaddata.type == 'music')
				{
					var mimetype = g.loading.checkaudio(i);
					if (!mimetype)
					{
						g.loading.loaddata.recid = false;
						return;
					}
					g.loading.loaddata.filename += '.'+mimetype[1];
					var a = new Audio();
					if (g.mobile)
					{
						a.preload = 'none';
						g.list.add(
			'Load '+{bgm:'music track',sfx:'sound effect'}[g.loading.loaddata.use]+': '+g.loading.loaddata.size+' KB',
			function() {
				g.loading.loaddata.data.load();
			}, 
			function() {
				g.loading.loaddata.error = 'userRejectedLoad';
			}			);
					}
					a.src = g.recRoot + g.loading.loaddata.filename;
					g.loading.loaddata.data = a;
				}
				else if (g.resources[i].type == 'text')
				{
					g.loading.loaddata.client = new XMLHttpRequest();
					g.loading.loaddata.client.open('GET', g.recRoot + g.loading.loaddata.filename);
					g.loading.loaddata.client.onreadystatechange = function() {
						if (this.readyState == 4)
						{
							g.loading.loaddata.data = g.loading.loaddata.client.responseText;
							g.loading.loaddata.loaded = true;
						}
					}
					g.loading.loaddata.client.send();
				}
			}
		}
		else
		{
			var i = g.loading.loaddata.recid;
			if (g.loading.loaddata.method == 0)
			{
				if ((g.loading.loaddata.type == 'image' && g.loading.loaddata.data.complete) ||
					(gloading.loaddata.type == 'music' && (g.loading.loaddata.data.readyState > 3 || g.mobile)) ||
					(g.loading.loaddata.type == 'text' && loading.loaddata.loaded))
				{
					g.resources[i].data = g.loading.loaddata.data;
					g.loading.processqueue[g.loading.processqueue.length] = i;
					g.loading.loaddata.recid = false;
					g.resources[i].loaded = true;
				}
			}
			else if (g.loading.loaddata.method == 1)
			{
				if (g.loading.loaddata.fin)
				{
					g.resources[i].data = g.loading.loaddata.data;
					g.loading.processqueue[g.loading.processqueue.length] = i;
					g.loading.loaddata.recid = false;
					g.resources[i].loaded = true;
				}
			}
		}
	},
	/*hackloadlistener: function(id)
	{
		return 'g.resources['+id+'].data.addEventListener("canplaythrough", function() {g.resources['+id+'].loaded = true;}, false);';
	},*/
	processout: 0,
	process: function() {
		if (g.loading.processdata === false)
		{
			if (!g.loading.processqueue.length)
				return;
			var i = g.loading.processqueue.shift();
			g.loading.processdata = i;
			g.loading.processout += g.resources[i].size;
			if (g.resources[i].data.toString() == '[object Blob]')
			{
				if (g.resources[i].type = 'image')
				{
					desync(function() {
						var img = new Image();
						img.onload = function(e) {
							window.URL.revokeObjectURL(img.src);
							g.resources[i].data = img;
							if (g.resources[i].use == 'hitbox')
							{
								g.loading.processhitbox(g.resources[i]);
							}
							else if (g.resources[i].use == 'background')
							{
								g.resources[i].width = img.width;
								g.resources[i].height = img.height;
								g.loading.processdata = false;
							}
							else if (g.resources[i].use == 'spritesheet')
							{
								if (g.resources[i].framewidth && g.resources[i].frameheight && g.resources[i].framex && g.resources[i].framey)
								{}
								else if (g.resources[i].framewidth && g.resources[i].frameheight)
								{
									g.resources[i].framex = Math.floor(img.width/g.resources[i].framewidth);
									g.resources[i].framey = Math.floor(img.height/g.resources[i].frameheight);
								}
								else if (g.resources[i].framex && g.resources[i].framey)
								{
									g.resources[i].framewidth = Math.floor(img.width/g.resources[i].framex);
									g.resources[i].frameheight = Math.floor(img.height/g.resources[i].framey);
								}
								else
								{
									g.resources[i].framewidth = 1;
									g.resources[i].frameheight = 1;
									g.resources[i].framex = img.width;
									g.resources[i].framey = img.height;
								}
								g.loading.processdata = false;
							}
						}
						img.src = window.URL.createObjectURL(new Blob([g.resources[i].data], {type: 'image/png'}));
					});
				}
				else if (g.resources[i].type == 'audio')
				{
					desync(function(e) {
						var a = new Audio();
						a.onload = function(e)
						{
							window.URL.revokeObjectURL(a.src);
							g.resources[i].data = a;
							g.loading.processdata = false;
						}
						a.src = window.URL.createObjectURL(new Blob([g.resources[i].data], {type: g.resources[i].mimetype}));
					});
				}
				else
				{
					//...
					console.log('Warning: blob of unknown type somehow ended up in the processing function...?');
					g.loading.processdata = false;
				}
			}
			else
			{
				if (g.resources[i].type == 'image')
				{
					if (g.resources[i].use == 'hitbox')
					{
						g.loading.processhitbox(g.resources[i]);
					}
					else if (g.resources[i].use == 'background')
					{
						g.resources[i].width = img.width;
						g.resources[i].height = img.height;
						g.loading.processdata = false;
					}
					else if (g.resources[i].use == 'spritesheet')
					{
						if (g.resources[i].framewidth && g.resources[i].frameheight && g.resources[i].framex && g.resources[i].framey)
						{}
						else if (g.resources[i].framewidth && g.resources[i].frameheight)
						{
							g.resources[i].framex = Math.floor(img.width/g.resources[i].framewidth);
							g.resources[i].framey = Math.floor(img.height/g.resources[i].frameheight);
						}
						else if (g.resources[i].framex && g.resources[i].framey)
						{
							g.resources[i].framewidth = Math.floor(img.width/g.resources[i].framex);
							g.resources[i].frameheight = Math.floor(img.height/g.resources[i].framey);
						}
						else
						{
							g.resources[i].framewidth = 1;
							g.resources[i].frameheight = 1;
							g.resources[i].framex = img.width;
							g.resources[i].framey = img.height;
						}
						g.loading.processdata = false;
					}
				}
				else if (g.resources[i].type == 'text' && g.resources[i].use == 'dialog')
				{
					desync(function() {
						g.dialog.init(g.resources[i]);
						g.loading.processdata = false;
					});
				}
				else
				{
					g.loading.processdata = false; 
				}
			}
		}
	},
	processhitbox: function(rec) {
		var canvas = document.createElement('canvas');
		canvas.width = rec.data.width;
		canvas.height = rec.data.height;
		var cxt = canvas.getContext('2d');
		desync(function() {
			cxt.drawImage(rec.data, 0, 0);
			desync(function() {
				var cdata = cxt.getImageData(0,0,canvas.width, canvas.height).data;
				var pdata = [];
				var rndex = 0;
				var tnext = 2;
				desync(function() {
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
					if (!rec.scale)
						rec.scale = 1;
					var bits = [
						rec.offset?(rec.offset.x):('0'), 
						rec.offset?(rec.data.width+rec.offset.x):(rec.data.width), 
						rec.offset?(rec.offset.y):('0'), 
						rec.offset?(rec.data.height+rec.offset.y):(rec.data.height), 
						rec.offset?(rec.offset.x):('0'), 
						rec.offset?(rec.offset.y):('0')
					];
					eval('rec.getData = function(x,y) { if (x < '+bits[0]+' || x > '+bits[1]*rec.scale+' || y < '+bits[2]+' || y > '+bits[3]*rec.scale+') {return 1;} return this.data[Math.floor((x - '+bits[4]+')/'+rec.scale+') + Math.floor((y - '+bits[5]+')/'+rec.scale+')*'+rec.data.width+']; }');	//whyyyyy
					rec.data = pdata;
					g.loading.processdata = false;
				});
			});
		});
	},
	draw: function() {
		var total = 0;
		var loaded = 0;
		for (var j in g.loading.loadqueue)
		{
			var i = g.loading.loadqueue[j];
			total += g.resources[i].size;
		}
		for (var j in g.loading.processqueue)
		{
			var i = g.loading.processqueue[j];
			total += g.resources[i].size;
			loaded += g.resources[i].size;
		}
		total += g.loading.processout;
		loaded += g.loading.processout;
		total += g.loading.loaddata.size;
		loaded += g.loading.loaddata.loadedsize;
		percent = Math.floor(100 * loaded / total);
		if (total == 0)
			percent == 100;
		g.gfx.drawfunc( function() {
			g.c.drawImage(document.getElementById('loadimg'),0,0);
			g.c.fillstyle = g.loading.percent.color;
			g.c.font = g.loading.percent.font;
			g.c.fillText(percent+'%',g.loading.percent.x,g.loading.percent.y);
		}, 0);
		return percent;
	},
	error: function() {
		if (!g.loading.failqueue.length)
			return;
		g.gfx.drawfunc(function() {
			g.c.fillstyle = g.loading.percent.color;
			g.c.font = g.loading.percent.font;
			g.c.fillText('Error in loading the following assets:', 10, 10);
			for (var ii in g.loading.failqueue)
			{
				var i = g.loading.failqueue[ii];
				g.c.fillText(g.resources[i].filename, 10, 35+(ii*20));
			}
			g.c.fillText('Press anywhere to reload.', 200, 30);
			if (g.controls.istouch(new Rectangle(0,0,650,450)))
			{
				g.loading.add(g.loading.failqueue);
				g.loading.failqueue = [];
			}
		}, 1);
	}
		
		
		
		/*if (!g.loading.done)
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
			g.c.fillstyle = g.loading.percent.color;
			g.c.font = g.loading.percent.font;
			g.c.fillText(Math.floor(perc)+'%',g.loading.percent.x,g.loading.percent.y);
			g.loading.done = (total == loaded);
		}
		else if (!g.loading.processed)
		{
			g.c.drawImage(document.getElementById('loadimg'),0,0);
			g.c.fillstyle = g.loading.percent.color;
			g.c.font = g.loading.percent.font;
			g.c.fillText('100%',g.loading.percent.x,g.loading.percent.y);
			for (var i in g.loading.list)
			{
				var rec = g.resources[i];
				if (rec.type == 'text' && rec.use == 'dialog')
					g.dialog.init(rec);
				else if (rec.type == 'image' && rec.use == 'hitbox')
				{
					
					
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
				g.c.fillstyle = g.loading.percent.color;
				g.c.font = g.loading.percent.font;
				g.c.fillText('100%',g.loading.percent.x,g.loading.percent.y);
			}, g.gfx.layers.fading);
		}
	}*/
};