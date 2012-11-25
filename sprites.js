g.sprites = {
func: {
	updPosBySpd: function(inst, dox, doy)
	{
		if (typeof dox == 'undefined')
			var dox = true;
		if (typeof doy == 'undefined')
			var doy = true;
		var fy = 0;
		var fx = 0;
		if (dox)
		{
			inst.xsub += inst.xspd;
			while (inst.xsub >= 20)
			{
				inst.xsub -= 20;
				fx++;
			}
			while (inst.xsub <= -20)
			{
				inst.xsub += 20;
				fx--;
			}
		}
		if (doy)
		{
			inst.ysub += inst.yspd;
			while (inst.ysub >= 20)
			{
				inst.ysub -= 20;
				fy++;
			}
			while (inst.ysub <= -20)
			{
				inst.ysub += 20;
				fy--;
			}
		}
		inst.x += fx;
		inst.y += fy;
	},
	addGravity: function(inst)
	{
		if (inst.yspd > 500)	//terminal velocity
			return;
		if (typeof inst.climbing != 'undefined' && inst.climbing != 0)	//climbing or weightless
			return;
		if (g.area.areas[g.area.currentarea].player == inst.index && g.k.jump)
			inst.yspd += 6;		//player accelerates slower if holding jump
		else
			inst.yspd += 12;
		
	},
	render: function(inst, flip) {
		g.gfx.draw(g.sprites[inst.name].spritesheet, inst.dim.x1-g.area.areas[g.area.currentarea].x, inst.dim.y1-g.area.areas[g.area.currentarea].y, inst.frame, g.gfx.layers.sprites, flip);
	},
	hit: function(inst, point, offset) {
		if (typeof offset != 'object')
			var offset = {x:0,y:0};
		offset.x += inst.dim.x1 + inst.x;
		offset.y += inst.dim.y1 + inst.y;
		switch(point) {
			case 'center':
				offset.y += inst.dim.height/2;
			case 'top':
				offset.x += inst.dim.width/2;
				break;
			case 'bottom':
				offset.x += inst.dim.width/2;
				offset.y += inst.dim.height;
				break;
			case 'bottomright':
				offset.x += inst.dim.width;
			case 'bottomleft':
				offset.y += inst.dim.height;
				break;
			case 'right':
				offset.x += inst.dim.width;
			case 'left':
				offset.y += inst.dim.height/2;
				break;
			case 'righttop':
				offset.x += inst.dim.width;
			case 'lefttop':
				offset.y += 20;
				break;
			case 'rightbottom':
				offset.x += inst.dim.width;
			case 'leftbottom':
				offset.y += inst.dim.height - 20;
				break;
		}
		if (g.resources[g.area.areas[g.area.currentarea].hitbox].type != 'image' || g.resources[g.area.areas[g.area.currentarea].hitbox].use != 'hitbox')
		{
			console.log('Warning: attempting to use asset without type:image/hitbox as hitbox!');
			return;
		}
		return g.resources[g.area.areas[g.area.currentarea].hitbox].getData(offset.x,offset.y);
	},
	hitsprite: function(spr1, spr2) {
		if (typeof spr1 == 'number')
			var inst1 = g.area.areas[g.area.currentarea].sprites[spr1];
		else
			var inst1 = spr1;
		if (typeof spr2 == 'number')
			var inst2 = g.area.areas[g.area.currentarea].sprites[spr2];
		else
			var inst2 = spr2;
		return inst1.dim.translate(inst1.x, inst1.y).hitRect(inst2.dim.translate(inst2.x, inst2.y));
		/*var d1 = {x1: inst1.x+inst1.dim.left, x2: inst1.x+inst1.dim.left+inst1.dim.width, y1: inst1.y+inst1.dim.top, y2: inst1.y+inst1.dim.top+inst1.dim.height};
		var d2 = {x1: inst2.x+inst2.dim.left, x2: inst2.x+inst2.dim.left+inst2.dim.width, y1: inst2.y+inst2.dim.top, y2: inst2.y+inst2.dim.top+inst2.dim.height};
		var w = d1.x2-d1.x1 + d2.x2-d2.x1;
		var h = d1.x2-d1.x1 + d2.y2-d2.y1;
		//return ((d2.x2-d1.x1 <= w)&&(d2.y2-d1.y1 <= h));
		return ((
			((d1.x1 >= d2.x1)&&(d1.x1 <= d2.x2)) ||
			((d1.x2 >= d2.x1)&&(d1.x2 <= d2.x2)) ||
			((d1.x1 <= d2.x1)&&(d1.x2 >= d2.x2))
		) && (
			((d1.y1 >= d2.y1)&&(d1.y1 <= d2.y2)) ||
			((d1.y2 >= d2.y1)&&(d1.y2 <= d2.y2))|| 
			((d1.y1 <= d2.y1)&&(d1.y2 >= d2.y2))
		));*/
	},
	hitgen: function(inst, points, callback) {
		for (var i in points)
		{
			if (callback(g.sprites.func.hit(inst, points[i]), i, points[i]) == 'stop')
				return 'stopped';
		}
	},
	hitbg: function(inst) {
		inst.hit = {up:false,down:false,left:false,right:false};
		if (inst.xspd >= 0 && g.sprites.func.hit(inst, 'right') == 0)
		{
			inst.hit.right = true;
			inst.xspd = 0;
			for (var i = 0; i <= 25; i++)
			{
				if (g.sprites.func.hit(inst, 'right', {x:-i, y:0}) != 0)	
				{
					inst.x -= i;
					break;
				}
			}
		}
		if (inst.xspd >= 0 && g.sprites.func.hit(inst, 'rightbottom') == 0)
		{
			inst.hit.right = true;
			inst.xspd = 0;
			for (var i = 0; i <= 25; i++)
			{
				if (g.sprites.func.hit(inst, 'rightbottom', {x:-i, y:0}) != 0)
				{
					inst.x -= i;
					break;
				}
			}
		}
		if (inst.xspd <= 0 && g.sprites.func.hit(inst, 'left') == 0)
		{
			inst.hit.left = true;
			inst.xspd = 0;
			for (var i = 0; i <= 25; i++)
			{
				if (g.sprites.func.hit(inst, 'left', {x:i, y:0}) != 0)
				{
					inst.x += i;
					break;
				}
			}
		}
		if (inst.xspd <= 0 && g.sprites.func.hit(inst, 'leftbottom') == 0)
		{
			inst.hit.left = true;
			inst.xspd = 0;
			for (var i = 0; i <= 25; i++)
			{
				if (g.sprites.func.hit(inst, 'leftbottom', {x:i, y:0}) != 0)
				{
					inst.x += i;
					break;
				}
			}
		}
		if (inst.yspd <= 0 && g.sprites.func.hit(inst,'top') == 0)
		{
			inst.hit.up = true;
			inst.yspd = 20;
		}
		if (inst.yspd >= 0 && g.sprites.func.hit(inst, 'bottomleft') == 0)
		{
			inst.hit.down = true;
			inst.yspd = 70;
			for (var i = 0; i <= 25; i++)
			{
				if (g.sprites.func.hit(inst, 'bottomleft', {x:0, y:-i-1}) != 0)
				{
					inst.y -= i;
					break;
				}
			}
		}
		if (inst.yspd >= 0 && g.sprites.func.hit(inst, 'bottomright') == 0)
		{
			inst.hit.down = true;
			inst.yspd = 70;
			for (var i = 0; i <= 25; i++)
			{
				if (g.sprites.func.hit(inst, 'bottomright', {x:0, y:-i-1}) != 0)
				{
					inst.y -= i;
					break;
				}
			}
		}
	},
	getSlot: function() {
		for (var i in g.area.areas[g.area.currentarea].sprites)
		{
			if (g.area.areas[g.area.currentarea].sprites[i] == null)
				return i;
		}
		return g.area.areas[g.area.currentarea].sprites.length;
	},
	isTouched: function(inst, frame) {
		if (typeof frame != 'boolean')
			frame = true;
		var are = g.area.areas[g.area.currentarea];
		return g.controls.istouch(inst.dim.translate(inst.x-g.area.areas[g.area.currentarea].x,inst.y-g.area.areas[g.area.currentarea].y), frame);
	}
},
area: {
	process: function(inst) {
		if (!g.frozen && g.sprites.func.hitsprite(inst,g.area.areas[g.area.currentarea].player) && (g.k.frame.space || g.sprites.func.isTouched(inst)))
			g.query.queueoption(inst.option, inst.callback);
	}
},
examine: {
	process: function(inst) {
		if (!inst.iprocessed)
		{
			inst.option = 'Examine '+inst.object;
			if (inst.object.substr(0,1) == '!')
				inst.option = inst.object.substr(1);
			eval('inst.callback = function() {g.dialog.show("'+inst.dialog+'") };');
			inst.iprocessed = true;
		}
		g.sprites.area.process(inst);
	}
}
};