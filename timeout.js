g.timeouts = {
	addtimeout: function(frames, func, meanwhile)
	{
		if (typeof meanwhile == 'undefined')
			meanwhile = false;
		var i;
		for (i = 0; typeof g.timeouts.list[i] != 'undefined' && g.timeouts.list[i]; i++) { }
		g.timeouts.list[i] = {timeremains: frames, 'func': func, runduringcount: meanwhile};
	},
	list: [],
	process: function() {
		for (var i in g.timeouts.list)
		{
			if (g.timeouts.list[i])
			{
				if (g.timeouts.list[i].runduringcount)
				{
					if (--g.timeouts.list[i].timeremains >= 0)
						g.timeouts.list[i].func(g.timeouts.list[i].timeremains);
					else
						g.timeouts.list[i] = false;
				}
				else
				{
					if (--g.timeouts.list[i].timeremains <= 0)
					{
						g.timeouts.list[i].func(g.timeouts.list[i].timeremains);
						g.timeouts.list[i] = false;
					}
				}
			}
		}
	}
};
/* just an example
timeouts: [
	{
		timeremains: 5,
		runduringcount: false,
		func: function(timer)
		{
			//blah
		}
	}
],
steers 115-123 feeder cattle 
slaughter lambs: steady
feeder lambs: steady
choice prime 
130.00 150.00
60-70 lbs 
*/
