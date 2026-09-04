// Compatibility preflight: never terminate another process to claim a port.
const net = require('net');
const port = Number(process.env.PORT || 5000);
const probe = net.createServer();
probe.once('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? 'Port ' + port + ' is occupied. Stop your existing server or choose another PORT.'
    : 'Cannot check port ' + port + ': ' + error.code);
  process.exitCode = 1;
});
probe.listen(port, () => probe.close());
