g.sprites.func = {
	updPosBySpd: function(inst, dox, doy)
	{
		if (typeof dox == 'undefined')
			var dox = true;
		if (typeof doy == 'undefined')
			var doy = true;
		if (dox)
		{
			inst.xsub += inst.xspd;
			while (inst.xsub >= 20)
			{
				inst.xsub -= 20;
				inst.x++;
			}
			while (inst.xsub <= -20)
			{
				inst.xsub += 20;
				inst.x--;
			}
		}
		if (doy)
		{
			inst.ysub += inst.yspd;
			while (inst.ysub >= 20)
			{
				inst.ysub -= 20;
				inst.y++;
			}
			while (inst.ysub <= -20)
			{
				inst.ysub += 20;
				inst.y--;
			}
		}
	},
	addGravity: function(inst)
	{
		if (inst.yspd > 500)	//terminal velocity
			return;
		if (g.area.areas[g.area.currentarea].player == inst.index && g.k.jump)
			inst.yspd += 6;		//player accelerates slower if holding jump
		else
			inst.yspd += 12;
		
	},
	render: function(inst, flip) {
		g.gfx.draw(g.sprites[inst.name].spritesheet, inst.x-g.area.areas[g.area.currentarea].x, inst.y-g.area.areas[g.area.currentarea].y, inst.frame, g.gfx.layers.sprites, flip);
	},
	hit: function(inst, point, offset) {
		if (typeof offset != 'object')
			var offset = {x:0,y:0};
		offset.x += inst.x + inst.dim.left;
		offset.y += inst.y + inst.dim.top;
		switch(point) {
			case 'top':
				offset.x += inst.dim.width/2;
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
		var d1 = {x1: inst1.x+inst1.dim.left, x2: inst1.x+inst1.dim.left+inst1.dim.width, y1: inst1.y+inst1.dim.top, y2: inst1.y+inst1.dim.top+inst1.dim.height};
		var d2 = {x1: inst2.x+inst2.dim.left, x2: inst2.x+inst2.dim.left+inst2.dim.width, y1: inst2.y+inst2.dim.top, y2: inst2.y+inst2.dim.top+inst2.dim.height};
		return ((((d1.x1 <= d2.x1)&&(d1.x2 >= d2.x1))||((d1.x1 <= d2.x2)&&(d1.x2 >= d2.x2)))&&(((d1.y1 <= d2.y1)&&(d1.y2 >= d2.y1))||((d1.y1 <= d2.y2)&&(d1.y2 >= d2.y2))));
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
	}
};