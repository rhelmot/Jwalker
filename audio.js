g.audio = {
	globalvol: 1,
	play: function(recnum) {
		var i = recnum;
		if (i >= 0 && g.resources[i].type != 'music')
		{
			if (g.resources[i].type != 'null')
				console.log('Warning: attempting to play nonmusic resource as music!');
			return;
		}
		if (i < 0 || g.resources[i].use == 'bgm')
		{
			if (i == g.audio.currentbgm)
				return;
			if (i == -1)
			{
				if (g.audio.currentbgm >= 0)
				{
					g.resources[g.audio.currentbgm].data.pause();
					g.resources[g.audio.currentbgm].data.currentTime = 0;
				}
				return;
			}
			g.resources[i].data.volume = g.audio.globalvol;
			g.resources[i].data.loop = true;
			if (g.audio.currentbgm >= 0)
			{
				g.resources[g.audio.currentbgm].data.pause();
				g.resources[g.audio.currentbgm].data.currentTime = 0;
			}
			if (g.mobile)
			{
				g.list.add('Play music track',function() {g.resources[recnum].data.play(); g.audio.currentbgm = recnum;});
				return;
			}
			g.resources[i].data.play();
			g.audio.currentbgm = i;
		}
		else if (g.resources[i].use == 'sfx')
		{
			g.resources[i].data.volume = g.audio.globalvol;
			if (g.mobile)
			{
				g.list.add('Play sound effect',function() {g.resources[recnum].data.play();});
				return;
			}
			g.resources[i].data.play();
		}
		else
			console.log('Warning: music resource ' + i + ' improperly tagged!');
	},
	setvol: function(vol) {
		g.audio.globalvol = vol;
		if (g.audio.currentbgm >= 0)
			g.resources[g.audio.currentbgm].data.volume = vol;
	}
};