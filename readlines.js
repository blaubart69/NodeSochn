/*
 *	2014-03-06 Spindler Bernhard - initial
 */
//
//
//
var inputfilename = WScript.Arguments(0);
//
//
// process lines
//
eachLine( inputfilename, function(line) {
	WScript.StdOut.WriteLine(line);
});

out.close();

// ----------------------------------------------------------------------------
// utils
// ----------------------------------------------------------------------------
//
// process textfile line by line
//
function eachLine(filename, callbackForALine) {
	var oFso = WScript.CreateObject("Scripting.FileSystemObject");
	var file = oFso.OpenTextFile( filename );
	while ( !file.AtEndOfStream ) {
		callbackForALine( file.ReadLine() );
	}
	file.Close();
}
