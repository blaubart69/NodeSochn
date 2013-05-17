var dgram 	= require("dgram");
var net		= require("net");

var UdpSrv = dgram.createSocket("udp4");
var TcpSrv = net.createServer();

var UdpPort = 14444;
var TcpPort = 14444;

var millisecondsToMeasure = 1000;
var PerfCount = {
	All : { 
		UdpBytes 	: 0,
		TcpBytes 	: 0,
		TcpConns	: 0
	},
	Second : {
		UdpBytes 	: 0,
		UdpPackets	: 0,
		TcpBytes 	: 0,
		TcpPackets	: 0
	}
};
//
// CTRL-C
//
process.on( 'SIGINT', function() {
  console.log("\ngracefully shutting down from SIGINT (Crtl-C)" )
  console.log("closing UDP port");
  UdpSrv.close();
  console.log("closing TCP port");
  TcpSrv.close();
  process.exit( )
})
//
// UDP
//
UdpSrv.on("message", function (buf, rinfo) {
	PerfCount.Second.UdpBytes 		+= buf.length;
	PerfCount.Second.UdpPackets		+= 1;
	PerfCount.All.UdpBytes 			+= buf.length;
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
	PerfCount.All.TcpConns += 1;
	
	socket.on("close", function() {
		console.log("Tcp disconnect from [%s:%d]", MySockAddr, MySockPort);
		PerfCount.All.TcpConns -= 1;
	});
	socket.on("data", function (buf) {
		PerfCount.Second.TcpBytes 		+= buf.length;
		PerfCount.Second.TcpPackets		+= 1;
		PerfCount.All.TcpBytes 			+= buf.length;
	});
});
TcpSrv.listen(TcpPort);
//
// status line
//
setInterval(function() {

	console.log("UDP: [%s]/s [%d] pkt/s | TCP: [%s]/s [%d] pkt/s [%d] connections open",
		bytesToSize(PerfCount.Second.UdpBytes),
		PerfCount.Second.UdpPackets,
		bytesToSize(PerfCount.Second.TcpBytes),
		PerfCount.Second.TcpPackets,
		PerfCount.All.TcpConns);
		
	resetCounters();
		
}, millisecondsToMeasure);
//
function resetCounters() {
	PerfCount.Second.TcpBytes 	= 0;
	PerfCount.Second.TcpPackets = 0;
	PerfCount.Second.UdpBytes 	= 0;
	PerfCount.Second.UdpPackets = 0;
}
//
// tools
//
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};