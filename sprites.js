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
	}
};