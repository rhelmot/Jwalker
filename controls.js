g.controls = 
{
	buttons: ['left','right','up','down','space','jump','accl'],
	keyset: 0,
	keysets: [
		{
			type: 'keyboard',
			left: 37,
			right: 39,
			up: 38,
			down: 40,
			space: 32,
			jump: 90,
			accl: 88
		},
		{
			type: 'keyboard',
			left: 65,
			right: 68,
			up: 87,
			down: 83,
			space: 32,
			jump: 76,
			accl: 186
		},
		{
			type: 'touch',
			controls: ['leftright', 'jumpbtn', 'upbtn', 'downbtn'],
			left: function(ks) {return ks.leftright.current < 2;},
			right: function(ks) {return ks.leftright.current > 2;},
			accl: function(ks) {return ks.leftright.current == 0 || ks.leftright.current == 4;},
			jump: function(ks) {return ks.jumpbtn.pressed;},
			up: function(ks) {return ks.upbtn.pressed;},
			down: function(ks) {return ks.downbtn.pressed;},
			jumpbtn: {
				type: 'button',
				active: false,
				pressed: false,
				sprite: 24,
				startframe: 0,
				x: 50,
				y: 375,
				dim: {left:0,top:0,width:94,height:42}
			},
			upbtn: {
				type: 'button',
				active: false,
				pressed: false,
				sprite: 21,
				startframe: 0,
				x: 540,
				y: 260,
				dim: {left:0,top:22,width:77,height:35}
			},
			downbtn: {
				type: 'button',
				active: false,
				pressed: false,
				sprite: 21,
				startframe: 6,
				x: 540,
				y: 300,
				dim: {left:0,top:22,width:77,height:35}
			},
			leftright: {
				type: 'slider',
				active: false,
				finger: -1,
				normal: 2,
				current: 2,
				orientation: 'left/right',
				max: 4,
				min: 0,
				inc: 1,
				dist: 50,
				snapback: true,
				tracksprite: 22,
				dialsprite: 23,
				x: 400,
				y: 375
			}
			
		}
	],
	process: function(keys, points) {
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
						con.pressed = g.controls.istouch(con.x+con.dim.left,con.y+con.dim.top,con.x+con.dim.left+con.dim.width,con.y+con.dim.top+con.dim.height,!con.pressed);
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
	istouch: function(x1,y1,x2,y2,isframe, finger)
	{
		if (typeof isframe != 'boolean')
			isframe = true;
		if (!finger)
			finger = false;
		var n = g.controls.istouchfinger(x1,y1,x2,y2,isframe,finger);
		if (n >= 0)
			return true;
		return false;
	},
	istouchfinger: function(x1,y1,x2,y2,isframe, finger)
	{
		if (typeof isframe != 'boolean')
			isframe = true;
		for (var i in g.p)
		{
			if (finger)
				i = finger;
			if (g.p[i] && !g.p[i].used && (!isframe || g.p[i].frame) && g.p[i].x >= x1 && g.p[i].x <= x2 && g.p[i].y >= y1 && g.p[i].y <= y2)
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