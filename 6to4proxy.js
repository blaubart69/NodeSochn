var net = require('net');

var portToForward = 8881;

var server6 = net.createServer(function(sock6) { //'connection' listener
	console.log('sock6 connected');
	
	var conn4 = net.connect({port: portToForward}, function() { 
		console.log('connected to ipv4 port');
		
		conn4.pipe(sock6);
		server6.pipe(conn4);
		
	}); 
	
	sock6.on('end', function() {
		conn4.end();
	});
});

server6.listen(portToForward, '::', function() { //'listening' listener
  console.log('server6 is listening');
  console.dir( server6.address() );
});