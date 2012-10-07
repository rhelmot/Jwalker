var finLoad = true;	//needed for IE compatibility
function loadSpecs() {
	g.num = '0433';
	
	g.resources = [
	{	//0
		filename: 'bradsprite.png',
		type: 'image',
		use: 'spritesheet',
		size: 5,
		framex: 70,
		framey: 120,
		framewidth: 5,
		frameheight: 1
	},{	//1
		filename: 'BrodyQuest',
		extensions: ['mp3','ogg'],
		type: 'music',
		use: 'bgm',
		size: 5340
	},{	//2
		filename: 'SugarCubeCornerHitbox.png',
		type: 'image',
		use: 'background',
		size: 626
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
		filename: 'meenahDlg.png',
		type: 'image',
		use: 'spritesheet',
		size: 11.9,
		framex: 344,
		framey: 532,
		framewidth: 3,
		frameheight: 1
	},{	//6
		filename: 'aradiaDlg.png',
		type: 'image',
		use: 'spritesheet',
		size: 17.2,
		framex: 440,
		framey: 508,
		framewidth: 4,
		frameheight: 1
	},{	//7
		filename: 'SugarCubeCornerHitbox.png',
		type: 'image',
		use: 'hitbox',
		size: 31.3,
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
	}];
	
	g.sprites.brad =  {
		spritesheet: 0,
		playerprocess: function(inst) {
			if (!g.frozen)
			{
				inst.hit = {up:false,down:false,left:false,right:false};
				g.sprites.func.addGravity(inst);
				g.sprites.func.updPosBySpd(inst);
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
				/*if (--inst.frametimer == 0)
				{
					inst.frametimer = 19;
					inst.fauxframe = (inst.fauxframe+1)%4;
				}
				inst.frame = [0,1,0,2][inst.fauxframe];
				if (inst.faceright)
					inst.frame += 3;*/
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
				/*if (g.k.up)
					inst.y -= 5;
				else if (g.k.down)
					inst.y += 5;*/
				if (g.k.frame.jump && inst.hit.down)
					inst.yspd = -200;
				if (inst.frametimer != 0)
					inst.frametimer--;
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
			g.sprites.func.render(inst, {x:inst.faceleft,y:false});
		}
	};
	g.dialog.prefs = {
		Brad: {
			spritesheet: 5,
			color: '#56AAFF',
			states: {
				talk: { frames: [0, 1], timing: 30 },
				shrug: { frames: [2], timing: 60 }
			}
		},
		Dadsprite: {
			spritesheet: 6,
			color: '#3366FF',
			states: {
				mad: { frames: [1, 2, 3, 2], timing: 3 },
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
			x: 0,
			y: 0,
			reclist: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
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
					x: 500,
					y: 500,
					xspd: 0,
					yspd: 0,
					xsub: 0,
					ysub: 0,
					frame: 0,
					faceleft: false,
					frametimer: 0,
					fauxframe: 0,
					dim: {left:20, width:26, top:0, height:114}
				}
			],
			exits: [
				
			]
		}
	];
};

if (tload)
	window.onload();	//IE compatibility - will sometimes run onload before this file is properly loaded