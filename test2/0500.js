g.resources = [
{		//0
	filename: 'dialogbox.png',
	type: 'image',
	use: 'spritesheet',
	framex: 537,
	framey: 270,
	framewidth: 1,
	frameheight: 1,
	size: 20.7
},{		//1
	filename: 'volume.png',
	type: 'image',
	use: 'spritesheet',
	size: .867,
	framex: 50,
	framey: 40,
	framewidth: 2,
	frameheight: 2
},{		//2
	filename: 'opt.png',
	type: 'image',
	use: 'spritesheet',
	size: .309,
	framex: 31,
	framey: 40,
	framewidth: 1,
	frameheight: 1
},{		//3
	filename: 'controls.png',
	type: 'image',
	use: 'spritesheet',
	size: 6.82,
	framex: 50,
	framey: 40,
	framewidth: 3,
	frameheight: 5
},{		//4
	filename: 'toucharrows.png',
	type: 'image',
	use: 'spritesheet',
	framex: 77,
	framey: 77,
	framewidth: 2,
	frameheight: 4,
	size: 11.6
},{		//5
	filename: 'red.png',
	type: 'image',
	use: 'spritesheet',
	framex: 100,
	framey: 100,
	framewidth: 1,
	frameheight: 1,
	size: 1
},{		//6
	filename: 'red.png',
	type: 'image',
	use: 'spritesheet',
	framex: 80,
	framey: 80,
	framewidth: 1,
	frameheight: 1,
	size: 1
}
];

var allrecs = [0,1,2,3,4,5,6];

g.dialog.boxrec = 0;
g.ui.volrec = 1;
g.ui.optrec = 2;
g.ui.controlsrec = 3;

g.ui.volrect = new Rectangle(20, 10, 50, 40, true);
g.ui.optrect = new Rectangle(530, 10, 31, 40, true);
g.ui.controlsrect = new Rectangle(580, 10, 50, 40, true);

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

g.area.areas = [
	{
		reclist: allrecs,
		player: 0,
		x: 0,
		y: 0,
		onLoad: function() {},
		onActivate: function() {},
		process: function() {},
		sprites: [
			{
				index: 0,
				name: 'red',
				dim: new Rectangle(100,100,100,100,true),
				sheet: 5
			},
			{
				index: 1,
				name: 'red',
				dim: new Rectangle(300,300,80,80,true),
				sheet: 6
			}
		]
	}
];

g.sprites.red = {
	process: function(inst) {
		g.gfx.draw(inst.sheet, inst.dim.x1, inst.dim.y1, 0, 0, {x:false,y:false}, 0.5);
		if (g.area.areas[g.area.currentarea].sprites[g.area.areas[g.area.currentarea].player].dim.hitRect(inst.dim))
		{
			g.gfx.draw(5, 600, 400, 0, 0);
		}
	},
	playerprocess: function(inst) {
		g.gfx.draw(inst.sheet, inst.dim.x1, inst.dim.y1, 0, 0, {x:false,y:false}, 0.5);
		if (g.k.left)
			inst.dim.translate(-5,0);
		else if (g.k.right)
			inst.dim.translate(5,0);
		if (g.k.up)
			inst.dim.translate(0,-5);
		else if (g.k.down)
			inst.dim.translate(0,5);
		if(g.k.frame.space)
			g.area.areas[g.area.currentarea].player = inst ^ 1;
	}
};

birth();