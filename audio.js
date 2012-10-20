g.audio = {
	globalvol: 1,
	play: function(recnum) {
		var i = recnum;
		if (i >= 0 && g.resources[i].type != 'music')
		{
			console.log('warning: attempt to play nonmusic resources as music');
			return;
		}
		if (i < 0 || g.resources[i].use == 'bgm')
		{
			if (i == g.audio.currentbgm)
				return;
			if (i == -1)
			{
				g.resources[g.audio.currentbgm].data.pause();
				g.resources[g.audio.currentbgm].data.currentTime = 0;
				return;
			}
			g.resources[i].data.volume = g.audio.globalvol;
			g.resources[i].data.loop = true;
			if (g.audio.currentbgm >= 0)
			{
				g.resources[g.audio.currentbgm].data.pause();
				g.resources[g.audio.currentbgm].data.currentTime = 0;
			}
			g.resources[i].data.play();
			g.audio.currentbgm = i;
		}
		else if (g.resources[i].use == 'sfx')
		{
			g.resources[i].data.volume = g.audio.globalvol;
			g.resources[i].data.play();
		}
		else
			console.log('warning: music resource ' + i + ' improperly tagged');
	},
	setvol: function(vol) {
		g.audio.globalvol = vol;
		if (g.audio.currentbgm >= 0)
			g.resources[g.audio.currentbgm].data.volume = vol;
	}
};