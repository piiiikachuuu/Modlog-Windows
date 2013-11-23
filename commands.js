	modlog: function(target, room, user, connection) {
        if (!this.can('modlog')) {
                return this.sendReply('/modlog - Access denied.');
        }
        var lines = parseInt(target || 15, 10);
        if (lines > 100) lines = 100;
        var filename = 'logs/modlog.txt';
        if (!lines || lines < 0) {
                if (target.match(/^["'].+["']$/)) target = target.substring(1, target.length-1);
        }
        target = target.replace(/\\/g,'\\\\\\\\').replace(/["'`]/g,'\'\\$&\'').replace(/[\{\}\[\]\(\)\$\^\.\?\+\-\*]/g,'[$&]');
		var data = fs.readFileSync(filename, 'utf8');
		data = data.split("\n");
		var newArray = [];
		for (var i = 0; i < data.length; i++) {
			if (data[i].toLowerCase().indexOf(target.toLowerCase()) > -1) {
				newArray.push(data[i]);
			}
			if ((lines && newArray.length >= lines) || newArray.length >= 100) break;
		}
		stdout = newArray.join("\n");
		if (lines) {
			if (!stdout) {
				user.send('|popup|The modlog is empty. (Weird.)');
			} else {
				user.send('|popup|Displaying the last '+lines+' lines of the Moderator Log:\n\n' + sanitize(stdout));
			}
		} else {
			if (!stdout) {
				user.send('|popup|No moderator actions containing "'+target+'" were found.');
			} else {
				user.send('|popup|Displaying the last 100 logged actions containing "'+target+'":\n\n' + sanitize(stdout));
			}
		}
	}
