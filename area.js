g.area = {
	currentarea: 0,
	areas: [],			//SETME
	process: function() {
		var ca = g.area.areas[g.area.currentarea];
		if (g.loading.add(ca.reclist, function() {
			g.timeouts.addtimeout(60,function(timer) {
				g.area.loadarea(g.area.currentarea, 'inout', 'white', 'start');
				g.timeouts.addtimeout(30,function() { g.loading.active = false; }, false);
			}, false);
		}))
		{
			return;
		}
		for (var i in ca.sprites)
		{
			if (ca.sprites[i] == null)
				continue;
			if (g.sprites[ca.sprites[i].name] == null)
			{
				console.log('Warning: no such sprite "'+ca.sprites[i].name+'". Sprite instance deleted.');
				ca.sprites[i] = null;
				continue;
			}
			
			if (g.debug.enabled && ca.sprites[i].dim)
				ca.sprites[i].dim.translate(ca.sprites[i].x, ca.sprites[i].y).draw();
			if (i == ca.player && g.sprites[ca.sprites[i].name].process)
				g.sprites[ca.sprites[i].name].playerprocess(ca.sprites[i]);
			else if (g.sprites[ca.sprites[i].name].process)
				g.sprites[ca.sprites[i].name].process(ca.sprites[i]);
		}
		if (!g.frozen)
		{
			for (var i in ca.exits)
			{
				if (g.sprites.func.hitsprite(ca.player, ca.exits[i]))
				{
					ca.exits[i].check(ca.sprites[ca.player]);
					break;
				}
			}
		}
		ca.process(ca);
	},
	loadarea: function(num, fade, color, loc) {
		g.frozen = true;
		if (!fade || fade == 'none')
		{
			g.area.areas[num].onLoad(loc, g.area.currentarea);
			g.area.currentarea = num;
			g.frozen = false;
			g.area.areas[num].onActivate();
		}
		else if (fade == 'in')
		{
			g.area.currentarea = num;
			g.area.areas[num].onLoad(loc);
			g.timeouts.addtimeout(25,function(timer) {
				g.gfx.drawfunc( function() {
					g.c.globalAlpha = timer/25;
					g.c.fillStyle = color;
					g.c.fillRect(0,0,650,450);
					g.c.globalAlpha = 1;
				}, g.gfx.layers.fading);
				if (timer == 0)
				{
					g.frozen = false;
					g.area.areas[num].onActivate();
				}
			}, true);
		}
		else if (fade == 'inout')
		{
			g.timeouts.addtimeout(60,function(timer) {
				var fillalpha = 1;
				if (timer > 35)
					fillalpha = (60-timer)/25;
				else if (timer == 30)
				{
					g.area.currentarea = num;
					g.area.areas[num].onLoad(loc);
				}
				else if (timer == 0)
				{
					g.frozen = false;
					g.area.areas[num].onActivate();
					fillalpha = 0;
				}
				else if (timer < 25)
					fillalpha = timer/25;
				g.gfx.drawfunc( function() {
					g.c.globalAlpha = fillalpha;
					g.c.fillStyle = color;
					g.c.fillRect(0,0,650,450);
					g.c.globalAlpha = 1;
				}, g.gfx.layers.fading);
			}, true);
		}
		else if (fade == 'out')
		{
			g.timeouts.addtimeout(25,function(timer) {
				g.gfx.drawfunc( function() {
					g.c.globalAlpha = 1-(timer/25);
					g.c.fillStyle = color;
					g.c.fillRect(0,0,650,450);
					g.c.globalAlpha = 1;
				}, g.gfx.layers.fading);
				if (timer == 0)
				{
					g.area.currentarea = num;
					g.area.areas[num].onLoad(loc);
					g.frozen = false;
					g.area.areas[num].onActivate();
				}
			}, true);
		}
	}
};