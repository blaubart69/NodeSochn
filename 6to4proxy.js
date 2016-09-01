var net = require('net');

var portToForward = 18888;

var server6 = net.createServer(function(sock6) { //'connection' listener
	console.log('connection from: ' + sock6.remoteAddress);
	
	var conn4 = net.connect({port: portToForward}, function() { 
		//console.log('connected to ipv4 port');
		
		conn4.pipe(sock6);
		sock6.pipe(conn4);
		
	}); 
	
	sock6.on('end', function() {
		conn4.end();
	});
});

//var ip6toListen = '::0'; // should be all v6 interfaces
var ip6toListen = process.argv[2];

server6.listen(portToForward, ip6toListen, function() { //'listening' listener
  console.log('6to4 server is listening on nterface ' + ip6toListen + " port: " + portToForward);
  console.dir( server6.address() );
});
