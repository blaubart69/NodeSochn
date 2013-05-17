var dgram 	= require("dgram");
var net		= require("net");

var UdpSrv = dgram.createSocket("udp4");
var TcpSrv = net.createServer();

var UdpPort = 14444;
var TcpPort = 14444;

var millisecondsToMeasure = 1000;
var PerfCount = {
	UdpAllBytes 	: 0,
	UdpBytes 		: 0,
	TcpAllBytes		: 0,
	TcpBytes 		: 0,
	TcpConns 		: 0
};
//
// UDP
//
UdpSrv.on("message", function (buf, rinfo) {
	PerfCount.UdpBytes 		+= buf.length;
	PerfCount.UdpAllBytes 	+= buf.length;
});
UdpSrv.on("listening", function() {
	var addr = UdpSrv.address();
	console.log("Udp is listening on " + addr.address + ":" + addr.port);
});
UdpSrv.bind(UdpPort);
//
// TCP
// 
TcpSrv.on("listening", function() {
	var addr = TcpSrv.address();
	console.log("Tcp is listening on " + addr.address + ":" + addr.port);
});
TcpSrv.on("connection", function (socket) {

	var MySockAddr = socket.remoteAddress;
	var MySockPort = socket.remotePort;
	
	console.log("Tcp connect from [%s:%d]", socket.remoteAddress, socket.remotePort);
	PerfCount.TcpConns += 1;
	
	socket.on("close", function() {
		console.log("Tcp disconnect from [%s:%d]", MySockAddr, MySockPort);
		PerfCount.TcpConns -= 1;
	});
	socket.on("data", function (buf) {
		PerfCount.TcpBytes 		+= buf.length;
		PerfCount.TcpAllBytes 	+= buf.length;
	});
});
TcpSrv.listen(TcpPort);
//
// status line
//
setInterval(function() {

	var udpcount = PerfCount.UdpBytes;
	var tcpcount = PerfCount.TcpBytes;
	PerfCount.UdpBytes = 0;
	PerfCount.TcpBytes = 0;

	process.stdout.write("UDP: [" + bytesToSize(udpcount) + "]/s | TCP: [" 
		+ bytesToSize(tcpcount) + "]/s | Tcp connections: "
		+ PerfCount.TcpConns + "                \r");
		
}, millisecondsToMeasure);
//
// tools
//
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};