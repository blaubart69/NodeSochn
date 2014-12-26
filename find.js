"use strict";

var fs 		= require('fs');
var path 	= require('path');

function walkDir(dir,callback) {

	fs.readdir(dir, function (err,files) {
		files.forEach( function(filename) {
			
			var afile = dir + path.sep + filename;
			
			fs.stat(afile, function(err, stats) {
				//console.log('dir: [%s]', subdir);
				if (stats.isDirectory() ) {
					walkDir(afile,callback);
				}
				else {
					callback(afile, stats);
				}
			});
		});
	});
}

if ( process.argv.length < 3 ) {
	console.log("usage: node.exe find.js {dir}");
	process.exit(1);
}

walkDir(process.argv[2], function(filename,stats) {
	console.log("%s | %d | %s", stats.mtime.toISOString(), stats.size, filename);
}); 