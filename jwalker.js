//jwalker.js - javascript walkaround wrapper code
//coded by Andrew Dutcher (http://andrewdutcher.com) for Thoughstuck (http://andrewdutcher.com/MSPA/)
//reuse is allowed and encouraged, but give credit.

var tkeys;
var tmouse;
var killcode;

var tload = false;

window.onload = function()
{
	if (typeof finLoad == 'undefined')	//IE will sometimes fire the onload function before everything is actuall loaded.
	{									//screw you, microsoft!
		tload = true;
		return;							//tell def file to fire window.onload();
	}
	loadSpecs();
	tkeys = [];
	tmouse = {x:0,y:0,down:false};
	var can = document.getElementById('drawCanvas');
	var cantext = can.getContext('2d');
	can.onkeydown = capkeydown;
	can.onkeyup = capkeyup;
	can.onmousemove = capmousemove;
	can.onmousedown = capmousedown;
	can.onmouseup = capmouseup;
	killcode = setInterval(function() {
		g.tick(tkeys, tmouse, cantext);
	}, 16.6667);
};

function capkeydown(e) {
	tkeys[e.keyCode] = true;
	switch(e.keyCode){			//do not scroll page
		case 37: case 39: case 38:  case 40: // Arrow keys
		case 32: e.preventDefault(); break; // Space
		default: break; // do not block other keys
	}
}
function capkeyup(e) {
	tkeys[e.keyCode] = false;
}
function capmousemove(e) {
	tmouse.x = e.pageX-e.target.offsetLeft;
	tmouse.y = e.pageY-e.target.offsetTop;
}
function capmousedown(e) {
	tmouse.down = true;
}
function capmouseup(e) {
	tmouse.down = false;
}

function loadscripts(list, abs) {
	if (typeof abs == 'undefined')
		var abs = false;
	for (var i in list)
	{
		var js = document.createElement('script');
		js.type = 'text/javascript';
		js.src = (abs?'':jwRoot) + list[i];
		document.body.appendChild(js);
	}
}

loadscripts(['gfx.js','ui.js','timeout.js','loading.js','debug.js','area.js','sprites.js','dialog.js','audio.js']);
loadscripts([srcPath], true);

function kill() {
	clearInterval(killcode);
}

var g = {
	recRoot: recRoot,
	m: {},
	frozen: false,
	tick: function (keys, mouse, context) {
		if (g.debugEnabled)
			g.tstart = new Date();
		mouse.click = false;
		if (mouse.down)
			mouse.click = !g.m.down;
		var k = {left: keys[37] || keys[65], right: keys[39] || keys[68], up: keys[38] || keys[87], down: keys[40] || keys[83], space: keys[32], jump: keys[90] || keys[76], accl: keys[88] || keys[186]};
		var f = {};
		for (var i in k)
		{
			f[i] = false;
			if (k[i])
				f[i] = !g.k[i];
		}
		g.k = k;
		g.k.frame = f;
		g.m = {x:mouse.x,y:mouse.y,down:mouse.down,click:mouse.click};
		g.c = context;
		g.c.clearRect(0,0,650,450);
		if (g.dialog.active)
			g.dialog.process();
		if (g.query.active)
			g.query.process();
		g.area.process();
		if (!g.loading.active)
			g.ui.process();
		g.timeouts.process();
		g.gfx.paint();
		if (g.debugEnabled)
			g.debug();
	},
	sprites: {},
	area: {},
	dialog: {}
};