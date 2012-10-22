g.num = '0433';

g.resources = [
{	//0
	filename: 'bradsprite.png',
	type: 'image',
	use: 'spritesheet',
	size: 4.5,
	framex: 70,
	framey: 120,
	framewidth: 9,
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
	size: 10
},{	//4
	filename: 'dialogbox.png',
	type: 'image',
	use: 'background',
	size: 20.7
},{	//5
	filename: 'braddialogout.png',
	type: 'image',
	use: 'spritesheet',
	size: 28.6,
	framex: 240,
	framey: 400,
	framewidth: 5,
	frameheight: 3
},{	//6
	filename: 'daddialogout.png',
	type: 'image',
	use: 'spritesheet',
	size: 20.3,
	framex: 260,
	framey: 400,
	framewidth: 5,
	frameheight: 2
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
},{ //12
	filename: 'area2bg.png',
	type: 'image',
	use: 'background',
	size: 38.8
},{ //13
	filename: 'area2hitbox.png',
	type: 'image',
	use: 'hitbox',
	offset: {x:0,y:-200},
	size: 5.5
},{ //14
	filename: 'area3bg.png',
	type: 'image',
	use: 'background',
	size: 35.7
},{ //15
	filename: 'area3hitbox.png',
	type: 'image',
	use: 'hitbox',
	size: 5.3
},{ //16
	filename: 'impsprite.png',
	type: 'image',
	use: 'spritesheet',
	size: 2.7,
	framex: 80,
	framey: 82,
	framewidth: 3,
	frameheight: 1
},{	//17
	filename: 'dink',
	extensions: ['ogg','mp3'],
	type: 'music',
	use: 'sfx',
	size: 33
},{	//18
	filename: 'floatingpoints.png',
	type: 'image',
	use: 'spritesheet',
	framex: 12,
	framey: 40,
	framewidth: 2,
	frameheight: 1,
	size: 2.8
},{ //19
	filename: 'dadroom.png',
	type: 'image',
	use: 'background',
	size: 15
},{ //20
	filename: 'punchline',
	extensions: ['mp3','ogg'],
	type: 'music',
	use: 'sfx',
	size: 150
},{ //21
	filename: 'toucharrows.png',
	type: 'image',
	use: 'spritesheet',
	framex: 77,
	framey: 77,
	framewidth: 2,
	frameheight: 4,
	size: 11.6
},{ //22
	filename: 'slider.png',
	type: 'image',
	use: 'spritesheet',
	framex: 208,
	framey: 46,
	framewidth: 1,
	frameheight: 1,
	size: 0.7
},{ //23
	filename: 'sliderdot.png',
	type: 'image',
	use: 'spritesheet',
	framex: 18,
	framey: 46,
	framewidth: 1,
	frameheight: 1,
	size: 0.4
},{ //24
	filename: 'jumpbtn.png',
	type: 'image',
	use: 'spritesheet',
	framex: 94,
	framey: 42,
	framewidth: 2,
	frameheight: 1,
	size: 2
}];

g.ui.volrec = 8;
g.ui.optrec = 9;
g.ui.controlsrec = 10;

g.dialog.prefs = {
	Brad: {
		spritesheet: 5,
		color: '#56AAFF',
		states: {
			neutral: { frames: [0], timing: 60 },
			talk: { frames: [0, 1], timing: 20 },
			sad: { frames: [2], timing: 60 },
			question: { frames: [3, 4], timing: 20 },
			argh: { frames: [12], timing: 60 },
			disgust: { frames: [13], timing: 60 },
			disgusttalk: { frames: [13, 6], timing: 20 },
			panic: { frames: [10, 11], timing: 5},
			nervous: { frames: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 8], timing: 5 },
			mad: { frames: [5], timing: 60 }
		}
	},
	Dadsprite: {
		spritesheet: 6,
		color: '#3366FF',
		states: {
			eyebrows: { frames: [0, 1, 2, 1], timing: 3 },
			neutral: { frames: [0], timing: 60 },
			sad: { frames: [3], timing: 60 },
			finger: { frames: [4], timing: 60 },
			shine: { frames: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 7, 8], timing: 5 },
			mad: { frames: [9], timing: 60 }
			//rage: { frames:
		}
	},
	'_': {
		color: 'black',
		states: {'_':{frames: []}}
	}
};

g.controls.buttons = ['left','right','up','down','space','jump','accl'];
g.controls.keysets = [
	{
		name: 'Arrow Keys/Z/X',
		description: 'Arrow keys to move, look up, and duck, Z to jump, X to speed up. Spacebar (or click, assuing space would work also) to interact with things.',
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
		name: 'Arrow Keys/L/;',
		description: 'WASD keys to move, look up, and duck, L to jump, Semicolon to speed up. Spacebar (or click, assuming space would work also) to interact with things.',
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
		name: 'Touch input',
		description: 'Use the onscreen keys to jump, duck, and look up. Move around by pulling the slider left and right. Different speed levels are available by pulling the slider different distances. Tap on things to interact with them, assuming your character is in range to do so.',
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
];

g.areaprocess = function(area) {
	var sprrec = g.resources[area.background];
	var player = area.sprites[area.player];
	if (player.x+player.dim.left+player.dim.width-area.x > 550)
		area.x = player.x+player.dim.left+player.dim.width - 550;
	else if (player.x+player.dim.left-area.x < 100)
		area.x = player.x+player.dim.left - 100;
	if (player.y+player.dim.top+player.dim.height-area.y > 350)
		area.y = player.y+player.dim.top+player.dim.height - 350;
	else if (player.y+player.dim.top-area.y < 100)
		area.y = player.y+player.dim.top - 100;
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
};
var allrecs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
g.area.areas = [
	{	
		background: 2,
		hitbox: 7,
		player: 0,
		x: 700,
		y: 0,
		reclist: allrecs,
		onLoad: function(entrance, from) {
			g.audio.play(1);
		},
		onActivate: function() {
			
		},
		process: function(area)
		{
			g.areaprocess(area);
			if (area.sprites[area.player].y > 650)
			{
				g.area.loadarea(0,'inout','white');
				g.timeouts.addtimeout(30, function() {
					g.area.areas[0].sprites[0] = {
						index: 0,
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
					};
					g.area.areas[0].sprites[1].x = 1050;
					g.area.areas[0].sprites[1].y = 250;
					g.area.areas[0].sprites[1].basey = 250;
					g.area.areas[0].sprites[1].faceleft = true;
					g.area.areas[0].sprites[1].xspd = 0;
					g.area.areas[0].x = 700;
				});
			}
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
				faceleft: true,
				dim: {left:0, width:60, top:0, height:128}
			},
			{
				name: 'examine',
				x:606,
				y:300,
				dim: {left:0,top:0,
				width:212,
				height:100},
				object: 'cacti',
				dialog: 'examinecacti'
			},
			{
				name: 'examine',
				x:736,
				y:0,
				dim: {left:0,top:0,
				width:70,
				height:68},
				object: 'chimney',
				dialog: 'examinechimney'
			},
			{
				name: 'examine',
				x:854,
				y:31,
				dim: {left:0,top:0,
				width:153,
				height:45},
				object: 'hole in roof',
				dialog: 'examinehole'
			}
			
		],
		exits: [
		{
			x: 900,
			y: 180,
			dim: {left:0,top:0,
			width: 250,
			height: 240 },
			check: function(player)
			{
				if (g.k.frame.space || g.sprites.func.isTouched(g.area.areas[0].exits[0]))
				{
					g.k.frame.space = false;
					if (g.area.areas[g.area.currentarea].sprites[1].follow)
					{
						g.query.show(['Enter house','Cancel'],200,200,function(num) { if (num == 1) {return;} g.area.loadarea(1, 'inout', 'black'); });
					}
					else
					{
						g.dialog.show('cantenter');
					}
				}
			},
			enterat: 0
		}
		]
	},
	{						//area 2 - kitchen/living room
		background: 12,
		hitbox: 13,
		player: 0,
		x: 400,
		y: 0,
		reclist: allrecs,
		onLoad: function(entrance, from)
		{
			g.audio.play(1);
		},
		onActivate: function()
		{
			g.frozen = true;
			g.timeouts.addtimeout(20, function() {	g.area.areas[1].sprites[2].state = 0; g.area.areas[1].sprites[3].state = 0; g.audio.play(17);});
			g.timeouts.addtimeout(200, function() { g.dialog.show('braddadsprite3'); });
		},
		process: g.areaprocess,
		sprites: [
			{
				index: 0,
				name: 'brad',
				x: 694,
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
				x: 625,
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
				follow: true,
				faceleft: false,
				dim: {left:0, width:60, top:0, height:128}
			},
			{
				index: 2,
				name: 'imp',
				state: -1,
				timer: 20,
				frame: 0,
				frametimer: 0,
				faceleft: true,
				x: 800,
				y: 360,
				xspd: 0,
				yspd: 0,
				xsub: 0,
				ysub: 0
			},
			{
				index: 3,
				name: 'imp',
				state: -1,
				timer: 10,
				frame: 0,
				frametimer: 0,
				faceleft: true,
				x: 850,
				y: 360,
				xspd: 0,
				yspd: 0,
				xsub: 0,
				ysub: 0
			},
			{
				name: 'examine',
				x:0,
				y:97,
				dim: {left:0,top:0,
				width:50,
				height:333},
				object: 'television',
				dialog: 'examinetv'
			},
			{
				name: 'examine',
				x:113,
				y:284,
				dim: {left:0,top:0,
				width:251,
				height:121},
				object: 'hole in wall/floor',
				dialog: 'examinefloorhole'
			},
			{
				name: 'examine',
				x:350,
				y:250,
				dim: {left:0,top:0,
				width:125,
				height:164},
				object: 'couch',
				dialog: 'examinecouch'
			},
			{
				name: 'examine',
				x:867,
				y:339,
				dim: {left:0,top:0,
				width:300,
				height:95},
				object: 'bananas',
				dialog: 'examinebananas'
			},
			{
				name: 'examine',
				x:842,
				y:68,
				dim: {left:0,top:0,
				width:221,
				height:153},
				object: 'freezer',
				dialog: 'examinefreezer'
			}
		],
		exits: [
		{
			x: 490,
			y: 110,
			dim: {left:0,top:0,
			width: 261,
			height: 300 },
			check: function(player)
			{
				if (g.k.frame.space || g.sprites.func.isTouched(g.area.areas[1].exits[0]))
				{
					g.k.frame.space = false;
					g.query.show(['Enter hallway','Cancel'],200,200,function(num) { if (num == 1) {return;} g.area.loadarea(2, 'inout', 'black'); });
				}
			},
			enterat: 0
		}
		]
		
	},
	{
		background: 14,
		hitbox: 15,
		player: 0,
		reclist: allrecs,
		x:466,
		y:0,
		onLoad: function(entrance, from)
		{
			g.audio.play(1);
		},
		onActivate: function() {},
		process: g.areaprocess,
		sprites: [
			{
				index: 0,
				name: 'brad',
				x: 700,
				y: 254,
				xspd: 0,
				yspd: 0,
				xsub: 0,
				ysub: 0,
				frame: 0,
				faceleft: true,
				climbing: 0,
				climbtimer: 0,
				frametimer: 0,
				fauxframe: 0,
				dim: {left:20, width:26, top:0, height:114}
			},
			{
				index: 1,
				name: 'dadsprite',
				x: 794,
				y: 200,
				xsub: 0,
				ysub: 0,
				xspd: 0,
				yspd: 0,
				basey: 200,
				yoffset: 0,
				yospd: 0,
				yaccl: 1,
				spdtimer: 0,
				follow: true,
				faceleft: true,
				dim: {left:0, width:60, top:0, height:128}
			},
			{
				name: 'examine',
				x:117,
				y:115,
				dim: {left:0,top:0,
				width:60,
				height:219},
				object: 'trophy',
				dialog: 'startrophy'
			},
			{
				name: 'examine',
				x:196,
				y:119,
				dim: {left:0,top:0,
				width:124,
				height:250},
				object: '!Enter bedroom',
				dialog: 'enterbedroom'
			},
			{
				name: 'examine',
				x:346,
				y:180,
				dim: {left:0,top:0,
				width:58,
				height:187},
				object: 'medal',
				dialog: 'redmedal'
			},
			{
				name: 'examine',
				x:448,
				y:175,
				dim: {left:0,top:0,
				width:80,
				height:200},
				object: 'certificate',
				dialog: 'examinecertificate'
			},
			{
				name: 'examine',
				x:582,
				y:170,
				dim: {left:0,top:0,
				width:58,
				height:196},
				object: 'medal',
				dialog: 'bluemedal'
			},
			{
				name: 'examine',
				x:667,
				y:113,
				dim: {left:0,top:0,
				width:83,
				height:258},
				object: 'big trophy',
				dialog: 'bigtrophy'
			},
			{
				name: 'examine',
				x:767,
				y:127,
				dim: {left:0,top:0,
				width:252,
				height:243},
				object: 'ribbons',
				dialog: 'examineribbons'
			},
			{
				name: 'examine',
				x:1090,
				y:88,
				dim: {left:0,top:0,
				width:88,
				height:287},
				object: 'huge trophy',
				dialog: 'hugetrophy'
			},
			{
				name: 'examine',
				x:1210,
				y:116,
				dim: {left:0,top:0,
				width:174,
				height:256},
				object: 'Charlie Sheen',
				dialog: 'examinesheen'
			},
			{
				name: 'examine',
				x:1406,
				y:40,
				dim: {left:0,top:0,
				width:54,
				height:360},
				object: '!Exit',
				dialog: 'braddadsprite6'
			}
		],
		exits: [
			{
				x: 0,
				y: 50,
				dim: {left:0,top:0,
				width: 50,
				height: 350 },
				alreadytried: false,
				check: function(player)
				{
					if (g.k.frame.space || g.sprites.func.isTouched(g.area.areas[2].exits[0]))
					{
						g.k.frame.space = false;
						if (g.area.areas[2].exits[0].alreadytried)
							g.query.show(['Enter Dad\'s room','Cancel'],200,200,function(num) { if (num == 1) {return;} g.area.loadarea(3, 'inout', 'black'); });
						else {
							g.area.areas[2].exits[0].alreadytried = true;
							g.dialog.show('braddadsprite5', function() { 
								g.dialog.show('enterroom', function() { 
									g.query.show(['Yes','No'],200,200,function(num) {
										if (num==0)
											g.area.loadarea(3, 'inout', 'black');
									});
								});
							});
						}
					}
				},
				enterat: 0
			}
		]
	},
	{
		reclist: allrecs,
		onLoad: function() {
			g.audio.play(-1);
		},
		onActivate: function() {
			g.audio.play(20);
		},
		process: function(ca) {
			g.gfx.draw(19,0,0,{diy:true},g.gfx.layers.bg);
			
		}
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
					else if ((i==6 || i==7) && px==0 && g.k.down)
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
				inst.duck = false;
				inst.look = false;
				if (inst.hit.down)
				{
					if (g.k.down)
					{
						inst.duck = true;
						maxx = 0;
					}
					else if (g.k.up && inst.xspd == 0)
						inst.look = true;
				}
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
			else if (inst.duck)
				inst.frame = 7;
			else if (inst.look)
				inst.frame = 8;
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
					else if (inst.faceleft?(inst.xspd > 0):(inst.xspd < 0))
						inst.frame = 6;
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
			if (g.sprites.func.hitsprite(inst, g.area.areas[g.area.currentarea].player) && (g.k.frame.space || g.sprites.func.isTouched(inst)))
			{
				var dstemp = inst;
				if (!inst.follow)
				{
					g.query.show(['Accept quest','Cancel'], 200,200, function(num) {
						if (num == 1)
							return;
						g.dialog.show('braddadsprite1', function() { dstemp.follow = true; g.sprites[dstemp.name].dstate = 1;});
					});
				}
				else if (g.sprites[inst.name].dstate == 1 || g.area.currentarea == 0)
				{
					g.query.show(['Ask about quest','Cancel'], 200,200, function(num) {
						if (num == 1)
							return;
						g.dialog.show('braddadsprite2', function() { g.sprites[dstemp.name].dstate = 2;});
					});
				}
				else
				{
					g.query.show(['Talk to Dadsprite','Cancel'], 200,200, function(num) {
						if (num == 1)
							return;
						g.dialog.show('braddadsprite4');
					});
				}
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
g.sprites.imp = {
	spritesheet: 16,
	process: function(inst) {
		switch (inst.state)
		{
			case -1:
			break;
			
			case 0:
			if (--inst.timer == 0)
				inst.state++;
			break;
			
			case 1:
			var sprs = g.area.areas[g.area.currentarea].sprites;
			var slot = g.sprites.func.getSlot();
			sprs[slot] = {
				name: 'float',
				index: slot,
				x: inst.x + 10,
				y: inst.y - 20,
				yspd: -20,
				ysub: 0,
				frame: 0,
				frametimer: 3
			};
			//g.audio.play(17);
			inst.timer = 30;
			inst.state++;
			break;
			
			case 2:
			if (--inst.timer == 0)
			{
				inst.state++;
				inst.timer = 30;
				inst.xspd = 100;
			}
			break;
			
			case 3:
			inst.faceleft = false;
			g.sprites.func.updPosBySpd(inst);
			if (inst.frametimer-- == 0)
			{
				inst.frametimer = 5;
				if (++inst.frame > 2)
					inst.frame = 1;
			}
			if (--inst.timer == 0)
			{
				inst.state++;
				inst.timer = 30;
				inst.yspd = -400;
			}
			break;
			
			case 4:
			g.sprites.func.addGravity(inst);
			g.sprites.func.updPosBySpd(inst);
			inst.frame = 1;
			if (--inst.timer == 0)
			{
				g.area.areas[g.area.currentarea].sprites[inst.index] = null;
				return;
			}
		}
		g.sprites.func.render(inst, {x:inst.faceleft, y:false});
	}
}
g.sprites.float = {
	spritesheet: 18,
	process: function(inst) {
		if (inst.yspd++ == 0)
		{
			g.area.areas[g.area.currentarea].sprites[inst.index] = null;
			return;
		}
		g.sprites.func.updPosBySpd(inst, false, true);
		if (inst.frametimer-- == 0)
		{
			inst.frametimer = 3;
			if (++inst.frame > 1)
				inst.frame = 0;
		}
		g.sprites.func.render(inst);
	}
};
g.gfx.pixels = {
	0x000000: 0,
	0xFFFFFF: 1,
	0xFF0000: 2,
	0x00FF00: 3,
	0x0000FF: 4,
	0x00FFFF: 5,
};
g.ui.aboutdlg = 'about';
g.ui.controlsdlg = 'controls';
birth();