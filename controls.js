g.controls = 
{
	buttons: [],			//SETME
	keyset: 0,
	keysets: [],			//SETME
	process: function(keys, points) {
		if (!g.controls.keysets.length)
			return;
		g.p = points;
		var k = {};
		if (g.controls.keysets[g.controls.keyset].type == 'keyboard')
		{
			for (var i in g.controls.buttons)
				k[g.controls.buttons[i]] = keys[g.controls.keysets[g.controls.keyset][g.controls.buttons[i]]];
		}
		else if (g.controls.keysets[g.controls.keyset].type == 'touch')
		{
			var ks = g.controls.keysets[g.controls.keyset];
			for (var i in ks.controls)
			{
				var con = ks[ks.controls[i]];
				switch (con.type) {
					case 'button':
						con.pressed = g.controls.istouch(con.dim,!con.pressed);
						var frm = con.startframe;
						if (con.pressed)
							frm++;
						g.gfx.draw(con.sprite, con.x, con.y, frm, g.gfx.layers.ui, {x:false,y:false}, con.pressed?1:0.75);
						break;
					
					case 'slider':
						if (con.active)
						{
							if (g.p[con.finger])
							{
								var tx = g.p[con.finger].x - con.x;
								var cx = Math.round(tx/con.dist);
								if (cx < con.min)
									cx = con.min;
								if (cx > con.max)
									cx = con.max;
								con.current = cx;
							}
							else
							{
								con.active = false;
								if (con.snapback)
									con.current = con.normal;
							}
						}
						else
						{
							con.finger = g.controls.istouchfinger(con.x+(con.dist*con.current)-15,con.y,con.x+(con.dist*con.current)+33,con.y+80);
							con.active = con.finger >= 0;							
						}
						g.gfx.draw(con.tracksprite, con.x, con.y, 0, g.gfx.layers.ui, {x:false,y:false}, con.active?1:0.75);
						g.gfx.draw(con.dialsprite, con.x+(con.dist*con.current), con.y, 0, g.gfx.layers.ui, {x:false,y:false}, con.active?1:0.75);
				}	
			}
			for (var i in g.controls.buttons)
			{
				var ks = g.controls.keysets[g.controls.keyset];
				if (ks[g.controls.buttons[i]])
					k[g.controls.buttons[i]] = ks[g.controls.buttons[i]](ks);
			}
		}
		var f = {};
		for (var i in k)
		{
			f[i] = false;
			if (k[i])
				f[i] = !g.k[i];
		}
		g.k = k;
		g.k.frame = f;
	},
	endprocess: function() {
		for (var i in g.p)
		{
			if (typeof g.p[i] == 'object')
			{
				g.p[i].frame = false;
				g.p[i].used = false;
			}
		}
	},
	istouch: function(rect, isframe, finger)
	{
		if (typeof isframe != 'boolean')
			isframe = true;
		if (!finger)
			finger = false;
		var n = g.controls.istouchfinger(rect, isframe, finger);
		if (n >= 0)
			return true;
		return false;
	},
	istouchfinger: function(rect, isframe, finger)
	{
		if (typeof isframe != 'boolean')
			isframe = true;
		for (var i in g.p)
		{
			if (finger)
				i = finger;
			if (g.p[i] && !g.p[i].used && (!isframe || g.p[i].frame) && rect.hitPoint(g.p[i].x, g.p[i].y))
			{
				g.p[i].used = true;
				return i;
			}
			if (finger)
				return -1;
		}
		return -1;
	}
};