var sav = [];
if (typeof g.area.areas != 'undefined')
	sav = g.area.areas;
g.area = {
	currentarea: 0,
	process: function() {
		if (g.loading.active)
		{
			g.loading.process();
			return;
		}
		var ca = g.area.areas[g.area.currentarea];
		for (var i in ca.reclist)
		{
			if (!g.resources[i].loaded)
			{
				g.loading.load(ca.reclist);
				return;
			}
		}
		ca.process(ca);
		for (var i in ca.sprites)
		{
			if (i == ca.player)
				g.sprites[ca.sprites[i].name].playerprocess(ca.sprites[i]);
			else
				g.sprites[ca.sprites[i].name].process(ca.sprites[i]);
		}
	},
	loadarea: function(num, fade, color, loc) {
		g.frozen = true;
		if (!fade || fade == 'none')
		{
			g.area.currentarea = num;
			g.area.areas[num].onLoad(loc);
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
	},
	areas: sav
};