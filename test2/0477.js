g.resources = [
{		//0
	filename: 'dialogbox.png',
	type: 'image',
	use: 'spritesheet',
	size: 20.7
},{		//1
	filename: 'volume.png',
	type: 'image',
	use: 'spritesheet',
	size: .867,
	framex: 50,
	framey: 40
},{		//2
	filename: 'opt.png',
	type: 'image',
	use: 'spritesheet',
	size: .309
},{		//3
	filename: 'controls.png',
	type: 'image',
	use: 'spritesheet',
	size: 6.82,
	framex: 50,
	framey: 40
},{		//4
	filename: 'toucharrows.png',
	type: 'image',
	use: 'spritesheet',
	framewidth: 2,
	frameheight: 4,
	size: 11.6
},{		//5
	filename: 'tony.png',
	type: 'image',
	use: 'spritesheet',
	framex: 173,
	framey: 250,
	size: 12.6
},{		//6
	filename: 'room1/front_bg.png',
	type: 'image',
	use: 'background',
	size: 197
},
{		//7
	filename: 'room1/front_bed.png',
	type: 'image',
	use: 'spritesheet',
	size: 7.8
},
{		//8
	filename: 'room1/front_desk.png',
	type: 'image',
	use: 'spritesheet',
	size: 7.1
},
{		//9
	filename: 'room1/front_hitbox.png',
	type: 'image',
	use: 'hitbox',
	size: 11.2
},
{		//10
	filename: 'psyche.png',
	type: 'image',
	use: 'spritesheet',
	framewidth: 2,
	frameheight: 2,
	size: 8
},
{		//11
	filename: 'dialog.txt',
	type: 'text',
	use: 'dialog',
	size: 20
},
{		//12
	filename: 'room1/rear_hitbox.png',
	type: 'image',
	use: 'hitbox',
	size: 12
},
{		//13
	filename: 'room1/rear_bg.png',
	type: 'image',
	use: 'background',
	size: 26.2
},
{		//14
	filename: 'swap.png',
	type: 'image',
	use: 'spritesheet',
	framewidth: 2,
	frameheight: 1,
	size: 5
},
{		//15
	filename: 'computer/bg.png',
	type: 'image',
	use: 'background',
	size: 10
},
{		//16
	filename: 'computer/frame.png',
	type: 'image',
	use: 'background',
	size: 10
},
{		//17
	filename: 'computer/apps.png',
	type: 'image',
	use: 'spritesheet',
	size: 10,
	framewidth: 3,
	frameheight: 2
},
{		//18
	filename: 'room1/door.png',
	type: 'image',
	use: 'spritesheet',
	size: 4.1
},
{		//19
	type: 'meta',
	use: 'quiltdata',
	width: 500,
	height: 500
},
,,,,,,,,,,,
,,,,,,,,,,,
,,,,,,,,,,,
,,,,,,,,,,,
,,,,,,,,,,,		//20-118
,,,,,,,,,,,
,,,,,,,,,,,
,,,,,,,,,,,
,,,,,,,,,,,
{		//119
	filename: 'outside/hitbox.png',
	type: 'image',
	use: 'hitbox',
	scale: 4,
	size: 11.1
},
{		//120
	filename: 'outside/house.png',
	type: 'image',
	use: 'background',
	size: 146
}
];


var allrecs = [];
for (var i = 0; i < g.resources.length; i++)
{
	allrecs[i] = i;
}
	
	
function qdata(name, start, width, height, except) {
	var out = [];
	for (var i = 0; i < height; i++)
	{
		var inout = [];
		for (var j = 0; j < width; j++)
		{
			var n = i*width+j;
			var h = n + start + 1;
			if (typeof except[n] == 'number')
				n = except[n];
			else
				g.resources[h] = {filename:name+(n+1)+'.png', type:'image', use: 'background', size: 20};
			inout[j] = n+start+1;
		}
		out[i] = inout;
	}
	g.resources[start].data = out;
}

qdata('outside/quilt/bg_',19, 11, 9, {96:0,97:0,98:0});

g.globalstate = {};

g.dialog.boxrec = 0;
g.dialog.prefs = {
	'_': {
		color: 'black',
		states: {'_':{frames: []}}
	}
};

g.ui.volrec = 1;
g.ui.optrec = 2;
g.ui.controlsrec = 3;

g.ui.controlsdlg = 'controls';
g.ui.aboutdlg = 'about';

g.ui.volrect = new Rectangle(20, 10, 50, 40, true);
g.ui.optrect = new Rectangle(530, 10, 31, 40, true);
g.ui.controlsrect = new Rectangle(580, 10, 50, 40, true);

g.area.currentarea = 4;

g.gfx.pixels = {
	0x000000: 0,
	0xFFFFFF: 1
};

g.controls.buttons = ['left','right','up','down','space'];
g.controls.keysets = [
	{
		name: 'Arrow Keys',
		description: 'Arrow keys to move. Spacebar (or click, assuing space would work also) to interact with things.',
		type: 'keyboard',
		left: 37,
		right: 39,
		up: 38,
		down: 40,
		space: 32
	},
	{
		name: 'WASD Keys',
		description: 'WASD keys to move. Spacebar (or click, assuming space would work also) to interact with things.',
		type: 'keyboard',
		left: 65,
		right: 68,
		up: 87,
		down: 83,
		space: 32
	},
	{
		name: 'Touch input',
		description: 'Use the onscreen keys move around. Tap on things to interact with them, assuming your character is in range to do so.',
		type: 'touch',
		controls: ['leftbtn', 'rightbtn', 'upbtn', 'downbtn'],
		left: function(ks) {return ks.leftbtn.pressed;},
		right: function(ks) {return ks.rightbtn.pressed;},
		up: function(ks) {return ks.upbtn.pressed;},
		down: function(ks) {return ks.downbtn.pressed;},
		upbtn: {
			type: 'button',
			active: false,
			pressed: false,
			sprite: 4,
			startframe: 0,
			x: 300,
			y: 0,
			dim: new Rectangle(300, 22, 77, 35, true)
		},
		downbtn: {
			type: 'button',
			active: false,
			pressed: false,
			sprite: 4,
			startframe: 6,
			x: 300,
			y: 373,
			dim: new Rectangle(300, 395, 77, 35, true)
		},
		leftbtn: {
			type: 'button',
			active: false,
			pressed: false,
			sprite: 4,
			startframe: 2,
			x: 0,
			y: 190,
			dim: new Rectangle(23, 190, 35, 77, true)
		},
		rightbtn: {
			type: 'button',
			active: false,
			pressed: false,
			sprite: 4,
			startframe: 4,
			x: 573,
			y: 190,
			dim: new Rectangle(596, 190, 35, 77, true)
		},
		
	}
];

g.area.funcs = {
	hswalk: function(ca) {
		var sen = false;
		if (ca.twin)
			sen = g.area.funcs.canswap(ca, g.area.areas[ca.twin]);
		g.gfx.draw(14, 100, 15, (sen?0:1), g.gfx.layers.ui);
		if (sen && g.controls.istouch(new Rectangle(100, 15, 30, 30, true)))
			g.area.currentarea = g.area.areas[g.area.currentarea].twin;		//god help us
		g.gfx.draw(ca.bg, ca.x, ca.y, 0, g.gfx.layers.bg);
		for (var i in ca.objects)
		{
			var j = ca.objects[i];
			if (!j.aopt && !j.a)
				j.a = 100;
			else if (j.aopt == 'fadebehind')
			{
				var p = ca.sprites[0].y + 206;
				if (p > j.p && j.a < 100)
					j.a += 2;
				else if (p < j.p && j.a > 0)
					j.a -= 2;
			}
			g.gfx.fbdraw(j.recid, j.x, j.y, 0, j.p, {x:false,y:false}, j.a/100);		//draw each 'object'
		}
		var p = ca.sprites[ca.player];
		t = p.x-ca.x;
		if (t < 100)			//scroll left
			ca.x = p.x - 100;
		else if (t > 400)		//scroll right
			ca.x = p.x - 400;
		t = p.y-ca.y;
		if (t < 25)				//scroll up
			ca.y = p.y - 25;
		else if (t > 200)		//scroll down
			ca.y = p.y - 200;
	},
	canswap: function(ca, ta) {
		var t = g.area.currentarea;
		g.area.currentarea = ca.twin;
		ta.onSwap(ca, ta);
		if (g.sprites.func.hitgen(ta.sprites[0], ['top','bottom','left','right'], function(px, num, name) {
			if (px == 0)
				return 'stop';
		}) == 'stopped')
		{
			g.area.currentarea = t;
			return false;
		}
		g.area.currentarea = t;
		return true;
	}
};

g.area.areas = [
	{
		reclist: allrecs,
		onLoad: function() {},
		onActivate: function() {
			g.timeouts.addtimeout(300, function(timer) {
				var frame = 0;
				if (timer > 260)
					frame = Math.floor((timer%6)/3);
				else if (timer > 180)
					frame = 1;
				else if (timer > 140)
					frame = Math.floor((timer%6)/3)+2;
				else
					frame = 3;
				if (timer == 30)
					g.area.loadarea(1, 'inout', 'white', 'start');
				g.gfx.draw(10, 107, 150, frame, 0);
				if (timer == 0)
					g.ui.enabled = true;
			}, true);
		},
		process: function() {
			g.ui.enabled = false;
		}
	},
	
	{
		reclist: allrecs,
		player: 0,
		x: 100,
		y: 304,
		bg: 6,
		hitbox: 9,
		
		onLoad: function() {},
		onActivate: function() {
			if (!g.globalstate.start)
			{
				g.globalstate.start = true;
				g.frozen = true;
				g.dialog.notice('You are now Tony.');
			}
		},
		process: function(ca) {
			g.area.funcs.hswalk(ca);
		},
		twin: 2,
		onSwap: function(ca, ta) {
			ta.sprites[0].y = 450 + 980 - (ca.sprites[0].y + 206) - 206;
			ta.sprites[0].x = 20 + 1230 - (ca.sprites[0].x + 85) - 85;
			ta.sprites[0].faceleft = !ca.sprites[0].faceleft;
			ta.sprites[0].faceback = !ca.sprites[0].faceback;
			ta.sprites[0].frametimer = ca.sprites[0].frametimer;
			ta.sprites[0].xspd = -ca.sprites[0].xspd;
			ta.sprites[0].yspd = -ca.sprites[0].yspd;
			ta.x = ca.x + ta.sprites[0].x - ca.sprites[0].x;
			ta.y = ca.y + ta.sprites[0].y - ca.sprites[0].y;
		},
		objects: [
			{	//bed
				recid: 7,
				x: 38,
				y: 581,
				p: 779
			},
			{	//desk
				recid: 8,
				x: 809,
				y: 385,
				p: 621
			}
		],
		sprites: [
			{
				index: 0,
				name: 'tony',
				dim: new Rectangle(30,180,110,53,true),
				x: 368,
				y: 439,
				xspd: 0,
				yspd: 0,
				xsub: 0,
				ysub: 0,
				faceleft: false,
				faceback: false,
				sheet: 5,
				frame: 0,
				frametimer: 0
			},
			{
				name: 'examine',
				x: 421,
				y: 280,
				dim: new Rectangle(0,0,260,303,true),
				object: 'bookshelf',
				dialog: 'examinebookshelf'
			},
			{
				name: 'examine',
				x: 83,
				y: 661,
				dim: new Rectangle(0,0,490,202,true),
				object: 'bed',
				dialog: 'examinebed'
			},
			{
				name: 'examine',
				x: 232,
				y: 326,
				dim: new Rectangle(0,0,211,313,true),
				object: 'posters',
				dialog: 'examineposters'
			},
			{
				name: 'examine',
				x: 1018,
				y: 465,
				dim: new Rectangle(0,0,198,272,true),
				object: 'gifts',
				dialog: 'examinegifts'
			},
			{
				name: 'area',
				x: 926,
				y: 380,
				dim: new Rectangle (0,0,143,336,true),
				option: 'Examine computer',
				callback: function() {
					g.area.currentarea = 3;
					g.area.areas[3].last = 1;
					g.ui.enabled = false;
				}
			},
			{
				name: 'area',
				x: 656,
				y: 280,
				dim: new Rectangle(0,0,180,265,true),
				option: 'Exit',
				callback: function() {
					if (!g.globalstate.gina1)
						g.dialog.notice('Nope! You still have more screwing around in here to do before you can proceed! :D');
					else
						g.area.loadarea(4, 'inout', 'white', 'door');
				}
			}
		]
	},
	{
		reclist: allrecs,
		player: 0,
		x: 0,
		y: 0,
		bg: 13,
		hitbox: 12,
		onLoad: function() {},
		onActivate: function() {},
		process: function(ca) {
			g.area.funcs.hswalk(ca);
		},
		twin: 1,
		onSwap: function(ca, ta) {
			ta.sprites[0].y = 450 + 980 - (ca.sprites[0].y + 206) - 206;
			ta.sprites[0].x = 20 + 1230 - (ca.sprites[0].x + 85) - 85;
			ta.sprites[0].faceleft = !ca.sprites[0].faceleft;
			ta.sprites[0].faceback = !ca.sprites[0].faceback;
			ta.sprites[0].frametimer = ca.sprites[0].frametimer;
			ta.sprites[0].xspd = -ca.sprites[0].xspd;
			ta.sprites[0].yspd = -ca.sprites[0].yspd;
			ta.x = ca.x + ta.sprites[0].x - ca.sprites[0].x;
			ta.y = ca.y + ta.sprites[0].y - ca.sprites[0].y;
		},
		sprites: [
			{
				index: 0,
				name: 'tony',
				dim: new Rectangle(30,180,110,53,true),
				x: 368,
				y: 439,
				xspd: 0,
				yspd: 0,
				xsub: 0,
				ysub: 0,
				faceleft: false,
				faceback: false,
				sheet: 5,
				frame: 0,
				frametimer: 0
			},
			{
				name: 'area',
				x: 326,
				y: 857,
				dim: new Rectangle(0,0,247,87,true),
				option: 'Exit',
				callback: function() {
					if (!g.globalstate.gina1)
						g.dialog.notice('Nope! You still have more screwing around in here to do before you can proceed! :D');
					else
						g.area.loadarea(4, 'inout', 'white', 'door');
				}
			}
		],
		objects: [
			{		//door
				recid: 18,
				x: 377,
				y: 515,
				p: 1000,
				a: 50
			}
		]
	},
	{
		process: function(ca)
		{
			g.gfx.draw(15, 0, 0, 0, g.gfx.layers.bg);
			g.gfx.draw(16, 0, 0, 0, g.gfx.layers.ui);
			switch (ca.state) {
				case 0:				//boot up
				ca.timer++;
				if (ca.timer < 60)
				{
					var a = 1;
					if (ca.timer > 30)
						a = (60 - ca.timer)/30;
					g.gfx.drawfunc(function() {
						g.c.fillStyle = 'black';
						g.c.globalAlpha = a;
						g.c.fillRect(0,0,650,450);
						g.c.globalAlpha = 1;
					}, g.gfx.layers.prioritysprites);
				}
				if (ca.timer > 80)
				{
					for (var i = 0; i < 5; i++)
						g.gfx.draw(17, Math.ceil(ca.xps[i] - Math.pow(2, -(ca.timer-ca.sts[i]-10))), ca.yps[i], i, g.gfx.layers.sprites);
				}
				if (ca.timer == 120)
				{
					ca.state++;
					ca.timer = 0;
					if (!ca.init)
					{
						ca.init = true;
						g.globalstate.gina1 = true;
						g.dialog.show('computerintro');
					}
				}
				default:
				break;
				case 1:
				for (var i = 0; i < 5; i++)
					g.gfx.draw(17, ca.xps[i], ca.yps[i], i, g.gfx.layers.sprites);
				if (!g.frozen && g.controls.istouch(new Rectangle(614, 414, 30, 30, true)))
					ca.exiting = true;
				break;
			}
			if (ca.exiting)
				ca.exit(ca);
		},
		timer: 0,
		init: false,
		state: 0,
		x:0,
		y:0,
		xps: [77, 247, 417, 77, 247],
		yps: [85, 85, 85, 255, 255],
		sts: [80, 85, 90, 95, 100],
		sprites: [
		
		],
		last: 1,
		exiting: false,
		exittimer: 0,
		exit: function(ca) {
			ca.exittimer++;
			var a = 1;
			if (ca.exittimer < 30)
				a = ca.exittimer/30;
			g.gfx.drawfunc(function() {
				g.c.fillStyle = 'black';
				g.c.globalAlpha = a;
				g.c.fillRect(0,0,650,450);
				g.c.globalAlpha = 1;
			}, g.gfx.layers.prioritysprites);
			if(ca.exittimer == 60)
			{
				ca.exiting = false;
				ca.exittimer = 0;
				ca.state = 0;
				ca.timer = 0;
				g.area.currentarea = ca.last;
				g.ui.enabled = true;
			}
		}
	},
	{												//area 4 - outside
		bg: 19,
		hitbox: 119,
		reclist: allrecs,
		x: 2000,
		y: 2000,
		player: 0,
		onLoad: function() {},
		onActivate: function() {},
		process: function(ca) {
			g.area.funcs.hswalk(ca);
		},
		sprites: [
			{
				index: 0,
				name: 'tony',
				dim: new Rectangle(30,180,110,53,true),
				x: 2300,
				y: 2100,
				xspd: 0,
				yspd: 0,
				xsub: 0,
				ysub: 0,
				faceleft: false,
				faceback: false,
				sheet: 5,
				frame: 0,
				frametimer: 0
			}
		],
		objects: [
			{
				recid: 120,
				x: 706,
				y: 958,
				p: 2795
			}
		]
	}
];

g.sprites.tony = {
	process: function(inst) {
		g.gfx.draw(5, inst.dim.x1, inst.dim.y1, 0, 0, {x:false,y:false}, 0.5);
	},
	playerprocess: function(inst) {
		if (!g.frozen)
		{
			var sign = g.k.left?-1:1;
			if (g.k.left || g.k.right)
			{
				var s = inst.xspd*sign;
				var c = 0;
				if (s < -100)
					c = 30;
				else if (s < -50)
					c = 15;
				else if (s < 0)
					c = 8;
				else if (s < 50)
					c = 7;
				else if (s < 100)
					c = 5;
				inst.xspd += c*sign;
			}
			else
			{
				if (inst.xspd > 5)
					inst.xspd -= 5;
				else if (inst.xspd < -5)
					inst.xspd += 5;
				else
					inst.xspd = 0;
			}
			sign = g.k.up?-1:1;
			if (g.k.up || g.k.down)
			{
				var s = inst.yspd*sign;
				var c = 0;
				if (s < -80)
					c = 25;
				else if (s < -40)
					c = 10;
				else if (s < 0)
					c = 8;
				else if (s < 40)
					c = 6;
				else if (s < 80)
					c = 4;
				inst.yspd += c*sign;
			}
			else
			{
				if (inst.yspd > 5)
					inst.yspd -= 5;
				else if (inst.yspd < -5)
					inst.yspd += 5;
				else
					inst.yspd = 0;
			}
			if (!(inst.xspd == 0 && inst.yspd == 0))
			{
				if (--inst.frametimer < 0)
				{
					inst.frametimer = 8;
					if (++inst.frame > 3)
						inst.frame = 0;
				}
			}
			else
			{
				inst.frame = 0;
				inst.frametimer = 0;
			}
			if (inst.xspd != 0)
				inst.faceleft = (inst.xspd < 0);
			if (inst.yspd != 0)
				inst.faceback = (inst.yspd < 0);
			g.sprites.func.updPosBySpd(inst);
			g.sprites.func.hitgen(inst, ['top', 'left', 'bottom', 'right'], function(px, num, name) {
				if (px != 0)
					return;
				var sign;
				if (num == 0 || num == 2)
				{
					sign = num - 1;		//top: -1, bottom: 1
					for (var i = 1; i < 25; i++)
					{
						if (g.sprites.func.hit(inst, name, {x:0, y:-i*sign}) != 0)
						{
							inst.y -= (i-1)*sign;
							inst.yspd = 0;
							break;
						}
					}
				}
				else
				{
					sign = num - 2;		//left: -1, right: 1
					for (var i = 1; i < 25; i++)
					{
						if (g.sprites.func.hit(inst, name, {x:-i*sign, y:0}) != 0)
						{
							inst.x -= (i-1)*sign;
							inst.xspd = 0;
							break;
						}
					}
				}
			});
		}
		g.gfx.fbdraw(inst.sheet, inst.x, inst.y, [0,1,0,2][inst.frame] + (inst.faceback?3:0), inst.y+inst.dim.y1+(inst.dim.height/2), {x:inst.faceleft,y:false});
		
		/*if(g.k.frame.space)
			g.area.areas[g.area.currentarea].player = inst ^ 1;*/
	}
};

birth();