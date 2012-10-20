//jwalker.js - javascript walkaround wrapper code
//coded by Andrew Dutcher (http://andrewdutcher.com) for Thoughstuck (http://andrewdutcher.com/MSPA/)
//reuse is allowed and encouraged, but give credit.

//note that the above isn't actually a real license, so I don't really care at the moment about all those
//license-y things. Yeah, you can metaphorically run around nude shouting "WHEEEEE LOOK AT ME NO LICENSES 
//TO RESTRAIN THIS ONE!" but at the end of the day stealing code makes you a douche, and that's that.

//yes there will be a license some time in the future when I actually care.

var tkeys;
var tmouse;
var killcode;

var tload = false;

window.onload = function()
{
	if (typeof finLoad == 'undefined')	//IE will sometimes fire the onload function before everything is actually loaded.
	{									//screw you, microsoft!
		tload = true;
		return;							//tell def file to fire window.onload();
	}
	loadSpecs();
	tkeys = [];
	tmouse = {x:0,y:0,down:false,click:false,t:[],lt:0};
	var can = document.getElementById('drawCanvas');
	var cantext = can.getContext('2d');
	can.onkeydown = capkeydown;
	can.onkeyup = capkeyup;
	can.onmousemove = capmousemove;
	can.onmousedown = capmousedown;
	can.onmouseup = capmouseup;
	can.addEventListener('touchstart', captouchstart, false);
	can.addEventListener('touchmove', captouchmove, false);
	can.addEventListener('touchend', captouchend, false);
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
function captouchstart(e) {
	e.preventDefault();
	for (var i in e.changedTouches)
	{
		tmouse.t[e.changedTouches[i].identifier] = true;
	}
}
function captouchmove(e) {
	e.preventDefault();
	for (var i in e.changedTouches)
	{
		tmouse.t[e.changedTouches[i].identifier] = true;
	}
}
function captouchend(e) {
	e.preventDefault();
	for (var i in e.changedTouches)
	{
		tmouse.t[e.changedTouches[i].identifier] = false;
	}
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

loadscripts(['gfx.js','ui.js','timeout.js','loading.js','debug.js','area.js','sprites.js','dialog.js','audio.js','controls.js']);
loadscripts([srcPath], true);

function kill() {
	clearInterval(killcode);
}

var g = {
	recRoot: recRoot,
	m: {},
	frozen: false,
	tick: function (keys, mouse, context) {
		if (g.debug.enabled)
			g.tstart = new Date();
		g.c = context;
		g.c.clearRect(0,0,650,450);
		g.controls.process(keys, mouse);
		if (g.dialog.active)
			g.dialog.process();
		if (g.query.active)
			g.query.process();
		g.area.process();
		if (!g.loading.active)
			g.ui.process();
		g.timeouts.process();
		g.gfx.paint();
		if (g.debug.enabled)
			g.debug.process();
	},
	sprites: {},
	area: {},
	dialog: {},
	controls: {}
};