var fs = require('fs');

function listDir(dir, fileCallback) {

	fs.readdir(dir, function (err,files) {
		files.forEach( function(f) {
		
			var subdir = dir + '/' + f;
			
			fs.stat(subdir, function(err, stats) {
				console.log('dir: [%s]', subdir);
				if (stats.isDirectory() ) {
					listDir(subdir);
				}
				else {
					fileCallback(subdir, stats);
				}
			});
		});
	});
}

listDir('c:/temp', function(filename, stats) {
	if ( stats.mtime > new Date('') ) {
		console.log(stats.mtime + " | " + filename);
	}
});