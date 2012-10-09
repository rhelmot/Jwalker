var finLoad = true;	//needed for IE compatibility
function loadSpecs() {
	g.num = '0433';
	
	g.resources = [
	{	//0
		filename: 'bradsprite.png',
		type: 'image',
		use: 'spritesheet',
		size: 2.8,
		framex: 70,
		framey: 120,
		framewidth: 6,
		frameheight: 1
	},{	//1
		filename: 'TribalEbonpyre',
		extensions: ['mp3','ogg'],
		type: 'music',
		use: 'bgm',
		size: 5340
	},{	//2
		filename: 'area1bg.png',
		type: 'image',
		use: 'background',
		size: 11
	},{	//3
		filename: 'dialog.txt',
		type: 'text',
		use: 'dialog',
		size: 0.433
	},{	//4
		filename: 'dialogbox.png',
		type: 'image',
		use: 'background',
		size: 20.7
	},{	//5
		filename: 'braddialogout.png',
		type: 'image',
		use: 'spritesheet',
		size: 7,
		framex: 230,
		framey: 400,
		framewidth: 3,
		frameheight: 1
	},{	//6
		filename: 'daddialogout.png',
		type: 'image',
		use: 'spritesheet',
		size: 6.3,
		framex: 260,
		framey: 400,
		framewidth: 3,
		frameheight: 1
	},{	//7
		filename: 'area1hitbox.png',
		type: 'image',
		use: 'hitbox',
		size: 4.5,
		scale: 1
	},{	//8
		filename: 'volume.png',
		type: 'image',
		use: 'spritesheet',
		size: .867,
		framex: 50,
		framey: 40,
		framewidth: 2,
		frameheight: 2
	},{	//9
		filename: 'save.png',
		type: 'image',
		use: 'spritesheet',
		size: .309,
		framex: 31,
		framey: 40,
		framewidth: 1,
		frameheight: 1
	},{	//10
		filename: 'controls.png',
		type: 'image',
		use: 'spritesheet',
		size: 6.82,
		framex: 50,
		framey: 40,
		framewidth: 3,
		frameheight: 5
	},{ //11
		filename: 'dadspritesprite.png',
		type: 'image',
		use: 'spritesheet',
		size: 3.45,
		framex: 44,
		framey: 128,
		framewidth: 1,
		frameheight: 1
	}];
	
	
	g.dialog.prefs = {
		Brad: {
			spritesheet: 5,
			color: '#56AAFF',
			states: {
				neutral: { frames: [0], timing: 60 },
				talk: { frames: [0, 1], timing: 20 },
				sad: { frames: [2], timing: 60 }
			}
		},
		Dadsprite: {
			spritesheet: 6,
			color: '#3366FF',
			states: {
				eyebrows: { frames: [0, 1, 2, 1], timing: 3 },
				neutral: {frames: [0], timing: 60}
			}
		},
		'_': {
			color: 'black',
			states: {'_':{frames: []}}
		}
	};
	g.area.areas = [
		{
			background: 2,
			hitbox: 7,
			player: 0,
			x: 700,
			y: 0,
			reclist: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			onLoad: function(entrance) {
				g.audio.play(1);
			},
			onActivate: function() {
				
			},
			process: function(area) {
				var sprrec = g.resources[area.background];
				if (area.sprites[area.player].x-area.x > 400)
					area.x = area.sprites[area.player].x - 400;
				else if (area.sprites[area.player].x-area.x < 100)
					area.x = area.sprites[area.player].x - 100;
				if (area.sprites[area.player].y-area.y > 300)
					area.y = area.sprites[area.player].y - 300;
				else if (area.sprites[area.player].y-area.y < 75)
					area.y = area.sprites[area.player].y - 75;
				if (area.x < 0)
					area.x = 0;
				else if (area.x > (sprrec.data.width - 650))
					area.x = sprrec.data.width - 650;
				if (area.y < 0)
					area.y = 0;
				else if (area.y > (sprrec.data.height - 450))
					area.y = sprrec.data.height - 450;
				if (sprrec.type != 'image' || sprrec.use != 'background')
				{
					console.log('warning: attempting to draw resources without type:image/background as background');
					return;
				}
				g.gfx.draw(area.background, 0, 0, {left: area.x, top: area.y, width: 650, height: 450}, g.gfx.layers.bg);
			},
			sprites: [
				{
					index: 0,			//necissary when only the instance is passed to a function
					name: 'brad',
					x: 850,
					y: 300,
					xspd: 0,
					yspd: 0,
					xsub: 0,
					ysub: 0,
					frame: 0,
					faceleft: false,
					climbing: 0,
					climbtimer: 0,
					frametimer: 0,
					fauxframe: 0,
					dim: {left:20, width:26, top:0, height:114}
				},
				{
					index: 1,
					name: 'dadsprite',
					x: 1050,
					y: 250,
					xsub: 0,
					ysub: 0,
					xspd: 0,
					yspd: 0,
					basey: 250,
					yoffset: 0,
					yospd: 0,
					yaccl: 1,
					spdtimer: 0,
					follow: false,
					faceleft: false,
					dim: {left:0, width:44, top:0, height:128}
				}
			],
			exits: [
				
			]
		}
	];
	//pixels: black-0 white-1 red-2 green-3 blue-4 cyan-5
	g.sprites.brad =  {
		spritesheet: 0,
		playerprocess: function(inst) {
			if (!g.frozen)
			{
				g.sprites.func.addGravity(inst);
				g.sprites.func.updPosBySpd(inst);
				//g.sprites.func.hitbg(inst);
				inst.hit = {up:false,down:false,left:false,right:false};
				inst.climbing &= 1;			//0		1			2			3		4			5				6			7
				g.sprites.func.hitgen(inst, ['top','lefttop','righttop','center','leftbottom','rightbottom','bottomleft','bottomright'], function(px, i, point) {
					//console.log(i);
					var horzsign = 0;	//other points = 0;
					if (i==1||i==4)
						horzsign = 1;	//left side = 1
					else if (i==2||i==5)
						horzsign = -1;	//right side = -1
					if (inst.climbing != 0)	// -----vhc Vertical top, Horizontal edge (no vertical motion), Climbing
					{
						if ((i==4||i==5) && px != 3 && px != 5)	//if left or right point
							inst.climbing |= 2;
						else if (i==0 && px != 3 && px != 5)
							inst.climbing |= 4;
						else if (i==3 && px != 3 && px != 5)
							inst.climbing = 0;
						else if ((i==6 || i==7) && (px==0||px==4))
							inst.climbing = 0;
					}
					if (inst.climbing == 0)
					{
						if ((i==6||i==7)&&(px==0||px==4||px==5)&&inst.yspd>=0)
						{
							inst.hit.down = true;
							inst.yspd = 70;
							for (var i = 0; i <= 25; i++)
							{
								if (g.sprites.func.hit(inst, point, {x:0, y:-i-1}) != px)
								{
									inst.y -= i;
									break;
								}
							}
						}
						else if ((i==1||i==4||i==2||i==5)&&px==0&&((inst.xspd<=0&&horzsign==1)||(inst.xspd>=0&&horzsign==-1)))
						{
							if (horzsign == 1)
								inst.hit.left = true;
							else if (horzsign == -1)
								inst.hit.right = true;
							inst.xspd = 0;
							for (var i = 0; i <= 25; i++)
							{
								if (g.sprites.func.hit(inst, point, {x:i*horzsign, y:0}) != px)
								{
									inst.x += i*horzsign;
									break;
								}
							}
						}
						else if (i==0&&px==0&&inst.xspd<=0)
						{
							inst.hit.top = true;
							inst.yspd = 20;
						}
						else if (i==3&&(px==3||px==5)&&(g.k.up||g.k.down))
						{
							inst.climbing = 1;
						}
					}
				});
				/*if (--inst.frametimer == 0)
				{
					inst.frametimer = 19;
					inst.fauxframe = (inst.fauxframe+1)%4;
				}
				inst.frame = [0,1,0,2][inst.fauxframe];
				if (inst.faceright)
					inst.frame += 3;*/
				if (inst.climbing == 0)
				{
					var maxx = (g.k.accl?200:100);
					if (g.k.left && inst.xspd > -maxx)
					{
						inst.xspd -= 5;
						inst.faceleft = true;
					}
					else if (g.k.right && inst.xspd < maxx)
					{
						inst.xspd += 5;
						inst.faceleft = false;
					}
					if (inst.hit.down)
					{
						if (inst.xspd > 0)
						{
							if (inst.xspd > maxx)
								inst.xspd -= 5;
							else if (!g.k.right && inst.xspd > 5)
								inst.xspd -= 5;
							else if (!g.k.right)
								inst.xspd = 0;
						}
						else if (inst.xspd < 0)
						{
							if (inst.xspd < -maxx)
								inst.xspd += 5;
							else if (!g.k.left && inst.xspd < -5)
								inst.xspd += 5;
							else if (!g.k.left)
								inst.xspd = 0;
						}
					}
				} else {
					inst.xspd = 0;
					inst.yspd = 0;
					var didclimb = false;
					if (g.k.up && inst.climbing == 1)
						{inst.y -= 3; didclimb = true;}
					else if (g.k.down && (inst.climbing&2)==0)
						{inst.y += 3; didclimb = true;}
					if (g.k.left)
						{inst.x -= 3; didclimb = true;}
					else if (g.k.right)
						{inst.x += 3; didclimb = true;}
					if (didclimb)
					{
						if (--inst.climbtimer < 0)
						{
							inst.faceleft = !inst.faceleft;
							inst.climbtimer = 10;
						}
					}
				}
				/*if (g.k.up)
					inst.y -= 5;
				else if (g.k.down)
					inst.y += 5;*/
				if (g.k.frame.jump && (inst.hit.down||inst.climbing!=0))
				{
					inst.yspd = -200;
					inst.climbing = 0;
				}
				if (inst.frametimer != 0)
					inst.frametimer--;
				if (inst.climbing != 0)
					inst.frame = 5;
				else
				{
					if (!inst.hit.down)
					{
						if (inst.yspd < 0)
							inst.frame = 3;
						else
							inst.frame = 4;
					}
					else
					{
						if (inst.xspd == 0)
							inst.frame = 0;
						else
						{
							if (inst.frametimer == 0)
							{
								inst.frametimer = [10,9,8,7,6,5,4,3,2][Math.floor(Math.abs(inst.xspd)/25)];
								if (++inst.fauxframe == 4)
								{
									inst.fauxframe = 0;
								}
							}
							else if (inst.frame != 0 && inst.frame != 1 && inst.frame != 2)
							{
								inst.fauxframe = 1;
								inst.frametimer = [10,9,8,7,6,5,4,3,2][Math.floor(Math.abs(inst.xspd)/25)];
							}
							inst.frame = [0,1,0,2][inst.fauxframe];
						}
					}
				}
			}
			g.sprites.func.render(inst, {x:inst.faceleft,y:false});
		},
		process: function(inst) {
			inst.dim = {left:20, width:26, top:0, height:114};
			if (inst.yspd < 0)
				inst.yspd = 0;
			inst.xspd = 0;
			g.sprites.func.addGravity(inst);
			g.sprites.func.updPosBySpd(inst);
			g.sprites.func.hitbg(inst);
			inst.frame = 0;
			if (!inst.hit.down)
				inst.frame = 4;
			g.sprites.func.render(inst);
		}
	};
	g.sprites.dadsprite = {
		spritesheet: 11,
		process: function(inst) {
			inst.frame = 0;
			if (!g.frozen)
			{
				inst.y = inst.basey;
				g.sprites.func.updPosBySpd(inst);
				inst.basey = inst.y;
				if (g.k.frame.space && g.sprites.func.hitsprite(inst, g.area.areas[g.area.currentarea].player))
				{
					var dstemp = inst.index;
					g.query.show(['Talk to Dadsprite','Ask Dadsprite to join','Cancel'], inst.x-30-g.area.areas[g.area.currentarea].x, inst.y-100-g.area.areas[g.area.currentarea].y, function(num) {
						if (num == 2)
							return;
						g.dialog.show(num + 1, (num!=1?function() {}:function() { g.area.areas[g.area.currentarea].sprites[dstemp].follow = true; }));
					});
				}
				inst.y += inst.yoffset;
				inst.yoffset += inst.yospd;
				if (++inst.spdtimer == 3)
				{
					inst.spdtimer = 0;
					inst.yospd += inst.yaccl;
					if (Math.abs(inst.yospd) >= 3)
						inst.yaccl *= -1;
				}
				var player = g.area.areas[g.area.currentarea].sprites[g.area.areas[g.area.currentarea].player];
				inst.faceleft = (player.x < inst.x);
				if (inst.follow)
				{
					var accl = 0;
					if (player.x > inst.x - 100 && player.x < inst.x + 100)
					{
						if (inst.xspd != 0)
						{
							if (inst.xspd > -2 && inst.xspd < 2)
								inst.xspd = 0;
							else
								accl = -2*inst.xspd/Math.abs(inst.xspd);
						}
					}
					else if (Math.abs(inst.xspd) < 50)
					{
						accl = inst.faceleft?-1:1;
					}
					inst.xspd += accl;
				}
			}
			g.sprites.func.render(inst, {x:inst.faceleft, y:false});
		}
	};
}

if (tload)
	window.onload();	//IE compatibility - will sometimes run onload before this file is properly loaded