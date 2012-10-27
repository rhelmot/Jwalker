//jwalker.js - javascript walkaround wrapper code
//coded by Andrew Dutcher (http://andrewdutcher.com) for Thoughstuck (http://andrewdutcher.com/MSPA/)
//reuse is allowed and encouraged, but give credit.

//note that the above isn't actually a real license, so I don't really care at the moment about all those
//license-y things. Yeah, you can metaphorically run around nude shouting "WHEEEEE LOOK AT ME NO LICENSES 
//TO RESTRAIN THIS ONE!" but at the end of the day stealing code makes you a douche, and that's that.

//yes there will be a license some time in the future when I actually care.

var tkeys = [];
var tpoints = {};	//iPad uses redonk indexes for its touches, so object, not array.
var killcode = -1;

function birth() {
	if (killcode >= 0)
		return;
	killcode = setInterval(function() {
		g.tick(tkeys, tpoints);
	}, 16.6667);
}
function kill() {
	if (killcode < 0)
		return;
	clearInterval(killcode);
	killcode = -1;
}

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

function capmousedown(e) {
	tpoints[0] = {x: e.pageX-e.target.offsetLeft, y: e.pageY-e.target.offsetTop, frame: true};
}
function capmousemove(e) {
	if (tpoints[0])
		tpoints[0] = {x: e.pageX-e.target.offsetLeft, y: e.pageY-e.target.offsetTop, frame: false};
}
function capmouseup(e) {
	tpoints[0] = false;
}

function captouchstart(e) {
	e.preventDefault();
	for (var i = 0; i < e.changedTouches.length; i++)
	{
		var t = e.changedTouches[i];
		tpoints[t.identifier+1] = {x:t.pageX-e.target.offsetLeft, y:t.pageY-e.target.offsetTop, frame:true};
	}
}
function captouchmove(e) {
	e.preventDefault();
	for (var i = 0; i < e.changedTouches.length; i++)
	{
		var t = e.changedTouches[i];
		tpoints[t.identifier+1] = {x:t.pageX-e.target.offsetLeft, y:t.pageY-e.target.offsetTop, frame:false};
	}
}
function captouchend(e) {
	e.preventDefault();
	for (var i = 0; i < e.changedTouches.length; i++)
	{
		tpoints[e.changedTouches[i].identifier+1] = false;
	}
}

window.onload = function()
{
	var deploy = document.getElementById('jwalker-deploy');
	if (!deploy)
	{
		console.log('Error: Malformed webpage; no deployment pad! Canceling load.');
		return;
	}
	document.getElementById('loadimg').style.display = 'none';
	deploy.innerHTML = '<canvas id="drawCanvas" width="650" height="450" tabindex="1" style="outline:none" onselectstart="return false;">Your browser does not support canvases. You must pick a different one if you would like to view this content. May I recommend Google Chrome?</canvas><div style="display:none;" id="messagediv"><p>Because you are on a mobile device, your browser needs your express permission to do the following actions:</p><p style="text-align:left;"><ul id="itemlist"></ul></p><p><button onClick="g.list.accept();">Accept</button></p></div>';
	var can = document.getElementById('drawCanvas');
	g.c = can.getContext('2d');
	can.onkeydown = capkeydown;
	can.onkeyup = capkeyup;
	can.onmousemove = capmousemove;
	can.onmousedown = capmousedown;
	can.onmouseup = capmouseup;
	can.addEventListener('touchstart', captouchstart, false);
	can.addEventListener('touchmove', captouchmove, false);
	can.addEventListener('touchend', captouchend, false);
	g.mobile = navigator.userAgent.match(/Android|Blackberry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);
	loadscripts([srcPath], true);
};

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

//loadscripts(['gfx.js','ui.js','timeout.js','loading.js','debug.js','area.js','sprites.js','dialog.js','audio.js','controls.js']);

function Rectangle(x1, y1, x2, y2, usesizes) {
	this.x1 = x1;
	this.y1 = y1;
	if (usesizes)
	{
		this.width = x2;
		this.height = y2;
		this.x2 = x1 + x2;
		this.y2 = y1 + y2;
	}
	else
	{
		this.x2 = x2;
		this.y2 = y2;
		this.width = x2 - x1;
		this.height = y2 - y1;
	}
	this.hitPoint = function(x,y) {
		return x >= this.x1 && x <= this.x2 && y >= this.y1 && y <= this.y2;
	}
	this.hitRect = function(rect) {
		var mx = this.width + rect.width;
		var my = this.height + rect.height;
		var dx = this.x2 - rect.x1;
		var dy = this.y2 - rect.y1;
		return 0 <= dx && dx <= mx && 0 <= dy && dy <= my;
	}
	this.translate = function(x,y) {
		this.x1 += x;
		this.x2 += x;
		this.y1 += y;
		this.y2 += y;
	}
	this.moveTo = function(x,y) {
		this.x1 = x;
		this.y1 = y;
		this.x2 = x + this.width;
		this.y2 = y + this.height;
	}
	this.sizeTo = function(w,h) {
		this.width = w;
		this.height = h;
		this.x2 = this.x1 + w;
		this.y2 = this.y1 + h;
	}
}

var g = {
	recRoot: recRoot,
	frozen: false,
	tick: function (keys, points) {
		if (g.debug.enabled)
			g.tstart = new Date();
		g.c.clearRect(0,0,650,450);
		g.controls.process(keys, points);
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
		g.controls.endprocess();
		g.list.check();
	}
};