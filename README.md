Jwalker
=======

A flexible platform for Homestuck Games in HTML5/Javascript
Coded by Andrew Dutcher (http://andrewdutcher.com), primarily for Thoughtstuck (http://andrewdutcher.com/MSPA/)

Use instructions:

* In an HTML file, have the following: 
* * A canvas: &lt;canvas id="drawCanvas" width="650" height="450" tabindex="1" style="outline:none" onselectstart="return false;">
* * A preloading image with style="display:none;" and id="loadimg"
* * A bit of inline JS setting the following variables:
* * * jwRoot, to the directory the Jwalker sources are kept in
* * * recRoot, to the directory the game assets are kept in
* * * srcPath, to the game definition file (more on this later)
* * A script tag sourced to jwalker.js
* In the game definition file (javascript), set attributes of the g object to design your game. More on this later.
* If you're trying to run it locally, don't forget to tell your browser to allow file access from the file:/// schema. (--allow-file-access-from-files in chrome)