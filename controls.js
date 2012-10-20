g.controls = 
{
	buttons: ['left','right','up','down','space','jump','accl'],
	keyset: 0,
	keysets: [
		{
			type: 'keyboard/mouse',
			left: 37,
			right: 39,
			up: 38,
			down: 40,
			space: 32,
			jump: 90,
			accl: 88
		},
		{
			type: 'keyboard/mouse',
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
			controls: ['leftright', 'jumpbtn'],
			left: function() {return this.leftright.current < 2;},
			right: function() {return this.leftright.current > 2;},
			accl: function() {return this.leftright.current == 0 || this.leftright.current == 4;},
			jump: function() {return this.jumpbtn.pressed;},
			jumpbtn: {
				type: 'button',
				active: false,
				pressed: false,
				sprite: 24,
				startframe: 0,
				x: 50,
				y: 400
			},
			leftright: {
				type: 'slider',
				active: false,
				default: 2,
				current: 2,
				orientation: 'left/right',
				max: 4,
				min: 0,
				inc: 1,
				dist: 25,
				snapback: true,
				tracksprite: 22,
				dialsprite: 23,
				x: 450,
				y: 550
			}
			
		}
	],
	process: function(keys, mouse) {
		var k = {};
		if (g.controls.keysets[g.controls.keyset].type == 'keyboard/mouse')
		{
			for (var i in g.controls.buttons)
				k[g.controls.buttons[i]] = keys[g.controls.keysets[g.controls.keyset][g.controls.buttons[i]]];
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
		if (g.controls.keysets[g.controls.keyset].type == 'keyboard/mouse')
		{
			mouse.click = false;
			if (mouse.down)
				mouse.click = !g.m.down;
			g.m = {x:mouse.x,y:mouse.y,down:mouse.down,click:mouse.click};
		}
	}
};