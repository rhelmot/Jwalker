Jwalker
=======

A flexible platform for Homestuck Games in HTML5/Javascript. Coded by Andrew Dutcher (http://andrewdutcher.com), primarily for Thoughtstuck (http://andrewdutcher.com/MSPA/)

Use instructions
----------------

* In an HTML file, have the following: 
    * A preloading image with `id="loadimg"` - this will be displayed before the JS kicks in and whenever resources are loading
    * A deployment div: `<div id="jwalker-deploy"></div>`
    * A bit of inline JS setting the following paths, relative to the HTML file:
        * `jwRoot`, to the directory the Jwalker sources are kept in
        * `recRoot`, to the directory the game assets are kept in
        * `srcPath`, to the game definition file (more on this later)
    * A script tag sourced to `jwalker.js` and its cronies, or just `jwalker-min.js`
* In the game definition file (javascript), set attributes of the `g` object to design your game. More on this later.
* If you're trying to run it locally, don't forget to tell your browser to allow file access from the file:/// schema. (`--allow-file-access-from-files` from command line in chrome)

Code Structure
--------------

All of Jwalker is packed into a single JSON object, called `g`. In the main jwalker.js, you can see the base for the object, as well as the loading of a number of peripheries and the keyboard/mouse capture. The function `g.tick()` is called at 60FPS, and that will call everything else, which is defined in pieces throughout the project files.

Assets are handled through and array of resources, containing a filename and a bit of metadata for the asset. (size, type, usage, etc.)

The base level of gameplay in Jwalker is something called an area. An area is a set of functions regarding how to handle gameplay (i.e. a gameplay engine), a list of requred assets, and some state data. When an area is loaded, its requred assets are checked to be sure they are loaded, and if they are not a loading screen comes up, loads them, and processes them if need be.

The base level of interactivity in Jwalker is called a sprite. A sprite is essentially two functions: one if the sprite is currently the player, and one for otherwise. In each area is a list of currently active sprites, each of which is called an instance. An instance contains state data such as position, speed, etc. To process each instance, the code for its defining sprite is run.

API
---

### Resources

`g.resources` is the list, and eventually all the data too, of all the assets to be used in the game. It takes the format of an array, with each item being a JSON object with the following properties:

* `filename` - Required - the filename of the resource to be loaded, found in the directory defined in the HTML file (for audio assets, leave the extension off)
* `size` - Required - the filesize of the asset. Can be in whatever units you like, provided the units are the same for all assets.
* `type` - Required - the media type of the asset. Valid values are `image`, `music`, and `text`, but may be set to `null` (the string, not the constant) if loading fails for some reason.
* `use` - Required - the way in which the asset will be used. Valid values vary depending on the value of `type`:
    * for `type:image`, valid values are `background`, `spritesheet`, `hitbox`, `quiltdata` (*Not implimented*), and `quiltpatch` (*Not implimented*).
    * for `type:audio`, valid values are `bgm` and `sfx`.
    * for `type:text`, currently, the only valid value is `dialog`.
    * for `type:null`, this should contain some kind of error message about why it failed to load.
* `extensions` - Required for audio files. An array of valid file extensions for the file, in order of preference. Currently, the only supported values are `mp3` and `ogg`.
* For spritesheets, four more values are required:
    * `framex` is the number of horizontal pixels in a single frame of the spritesheet.
    * `framey` is the number of vertical pixels in a single frame of the spritesheet.
    * `framewidth` is the number of frames horizontally across the file.
    * `frameheight` is the number of frames vertically across the file.
* `offset` is optional, and can be used to offset a hitbox a number of pixels from the origin. `g.offset = {x:0, y:200};` would make the hitbox extend 200 pixels above the visible area.

The above area all values that should be set in the definition file. Below are a number of values set at runtime:

* `data` contains the actual loaded data for each resource. For different kinds of assets, it will be a different object type:
    * for `type:image/hitbox` and `type:image/quiltdata` it will be an array.
    * for all other `image` types, it will be an Image object.
    * for all `music` types, it will be an Audio object.
    * for all `text` types, it will be a String.
* `loaded` is a boolean for whether or not the object has been loaded.
* `client` is the XmlHttpRequest object responsible for fetching text assets.
* `getData(x,y)` is a function defined in the loading process for types `image/hitbox` and `image/quiltdata`. Can be called to retrieve pieces of that image.

### Loading

`g.loading` (in `loading.js`) contains all the functions and data related to the loading of resources. In general, you shouldn't need to touch this, as everything is handled by `g.area`.

* `g.loading.active` is a boolean for whether or not the loading process is underway.
* `g.loading.load(list)` is the function called with a list of resource IDs to load. It starts the loading process for each of those resources not already loaded and sets `g.loading.active` to true.
* This section is due for an overhaul and will get one when I have time.

### Input

Jwalker condenses user input into two variables, `g.k` and `g.p`.

`g.k` is the keyboard input. It has a property for each key, valid values being `left`, `right`, `up`, `down`, `space`, `jump`, and `accl`. These will be `true` if the user has any key that is mapped to those values pressed. For the time being, if you want to change that mapping, you will have to manually edit the source, found in `jwalker.js`. In additions, `g.k.frame` has all the same properties as `g.k` (sans `frame` of course), except they are only `true` if the key was not pressed during the previous frame.

`g.p` is the pointer input. This can mean either mouse or multitouches on a touch-enabled device. Is an array of objects, each on with properties `x`, `y`, `frame` (is `g.m.x` and `g.m.y` are the x and y position of the mouse relative to the canvas. `g.m.down` is `true` if the user has any mouse button depressed. `g.m.click` is true if the user has any mouse depressed, but did not during the previous frame.

HOWEVER you should not usually have to read from `g.p` manually. See the Controls section.

### Timeouts

The concept of a timeout in Jwalker is fairly simple. You can set a function to be called after a number of frames elapse, or to be called every frame for a specified number of frames.

To set up a timeout, call `g.timeouts.addtimeout(frames, func [, eachframe])`.

* `eachframe` is a boolean determining if the function should be called each frame until it expires (`true`), or if it should only be called when the number of frames elapses (`false`). Defaults to `false`.
* `func` is the function to be executed. If the function is to be called continuously, this can take one argument, which will be filled with the number of frames remaining.
* `frames` is the number of frames the timeout should last. Pretty simple.

For the curious, `g.timeouts.list` is the list of timeouts, and `g.timeouts.process` is the function used to process the timeouts. All this is found in `timeout.js`.

### Drawing

`g.gfx` contains all drawing related things. It essentially works by maintaining a queue of things to draw, assigned to a "layer". At the end of each frame, everything is "painted" from the bottom up.

`g.gfx.draw(redic, x, y, frame, layer [, flip, alpha])` is what you should call if you want to draw something to the screen.
* `recid` is the index of the image resource you would like to draw from `g.resources`.
* `x` and `y` are the x and y position of the top-left corner of whatever you would like to draw, relative to the top-left corner of the canvas.
* `frame` changes depending on the type of image you are drawing.
    * for images of type `image/spritesheet`, `frame` is the number of the frame you would like to draw.
    * for images of type `image/background`, `frame` is a JSON object with the following properties:
        * `left`: clipping x offset from left
        * `top`: clipping y offset from top
        * `width`: clipping x width
        * `height`: clipping y height
* `layer` is a number representing the layer upon which the image will be drawn. See `g.gfx.layers`.
* `flip` is and optional JSON object containing the following properties:
    * `x`: a boolean for whether or not to horizonally flip the image
    * `y`: a boolean for whether or not to vertically flip the image
    * If `flip` is omitted, it will default to {x:false, y:false}
* `alpha` is an optional number between 0 and 1 that sets the opacity of the image you are drawing.

`g.gfx.drawfunc(func, layer)` is for when you need to manually draw to the screen with custom code.
* `func` is the function to do the drawing. Takes no arguments.
* `layer` is a number representing the layer upon which the code will be drawing. See `g.gfx.layers`
* In the function, the object `g.c` refers to the canvas' drawing context.

`g.gfx.paint()` unloads the queue onto the screen. Do not call; is called by `g.tick()`.


`g.gfx.layers` is a reference for drawing onto layers. It is a JSON object with a number of drawing uses assigned to keys. Useful such that if you decide you need an extra drawing layer, you can change the `layers` definition instead of tweaking a hundred calls to `g.gfx.draw()`.
Common use would be `g.gfx.draw(3, 100, 200, 0, g,layers.sprites);`.
Default value is `{fading: 6, dialog: 5, ui: 4, prioritysprites: 3, prioritybg: 3, sprites: 1, bg: 0}`

### Dialog

Dialog information and functions in Jwalker are stored in `g.dialog`.

Actual data for the dialogs is parsed out of resources with type `text/dialog` by the function `g.dialog.init(recnum)` and stored in `g.dialog.data`. The `data` format is a bit lengthy to explain here, so I have it documented in the source. Formatting for the dialog text files is explained elsewhere. I haven't written that yet, actually. But it will be explained elsewhere.

To call a dialog, run `g.dialog.show(name [, callback])`. `name` is the name of the conversation as named in the dialog text file. `callback` is an optional function that will be run when the user finishes the dialog -- *not* closes it with `> Close conversation`.

You can also make up your own simple dialog by calling `g.dialog.notice(text [, callback])`. `text` is either a string or an array of strings to show, and `callback` is a callback function like the one of `g.dialog.show`.

`g.dialog.prefs` is a SETME, so it needs to be set with the setting for your characters, such as their poses, colors, etc.

A couple of additional values that may be important:
* `g.dialog.active` is true when there is a dialog running, but not during the fly in/out animations of the textbox.
* `g.dialog.num` is the name of the currently running dialog.
* `g.dialog.part`, `g.dialog.state`, `g.dialog.line`, and `g.dialog.char` all control various granularities of the state of the dialog. You shouldn't be messing with them.
* `g.dialog.boxgoal` and `g.dialog.boxcur` are the target and current x positions of the textbox, used to animate it in conjunction with `g.dialog.spriteframetimer`.
* `g.dialog.drawsprite`, `drawtext`, and `drawbox` are functions that draw their eponymous objects to the screen.

### Queries

A query, for which all data is stored in `g.query`, is a little yellow-and-orange popup prompting the user to make a choice.

Pose a query by calling `g.query.show(options, x, y [, callback])`. `options` is an array of strings that the user can chose from, `x` and `y` are the x and y position of the query box, and `callback` is a function that will be called when the user makes their choice. It should take one argument, which will be set to the zero-based index of the user's choice.

That's pretty much all there is to it. Code for `g.query` is stored in `dialog.js`.

### Audio

Call `g.audio.play(recnum)` with the resource identifier of a music asset, and it will be played. If it is background music, it will loop, and if it is a sound effect, it will not. Use a resource number of `-1` to stop the current BGM.

Call `g.audio.setvol(vol)` with a number between 0 and 1 to set the global volume to that level. The current background music volume will be adjusted, but sound effects will continue to play unchecked.

### UI

The user interface has a couple of setmes:

* `g.ui.volrec` is the resource number of the spritesheet to use for volume control. Should have four sprites, one for each volume level: 0, 1/3, 2/3, and full.
* `g.ui.optrec` is the resource number of the spritesheet to use for the options buttons.
* `g.ui.controlsrec` is the resource number of the spritesheet to use for the controls button. Should be a spritesheet that will be animated one frame per frame before the user clicks on it once, and will stop animating and sit on frame 0 once the user clicks it.
* `g.ui.aboutdlg` is the dialog name to use for the `> About` text in the options menu.
* `g.ui.controlsdlg` is the dialog name to use for the controls button. The first line of this will be overwritten by the description for the currently selected controls. (see the controls section)

### Controls

### Areas

### Sprites

### Debug

Call `g.debug` or set `g.debugEnabled` to true to enable debugging. As of now, that just means that a bunch of staistics and data are drawn to the screen.

In case of emergency, you can execute `kill()` to clear the timeout calling `g.tick`. If you really want to restart the loop without reloading the page for some reason, you can call `window.onload()` to this end, but this may have some screwy effects.