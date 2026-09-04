const { execSync } = require('child_process');

// Gracefully release port 5000 before starting dev server
try {
  if (process.platform === 'win32') {
    const stdout = execSync('netstat -ano -p tcp | findstr :5000 | findstr LISTENING', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    const lines = stdout.trim().split('\n');
    const pids = new Set();
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && pid !== '0' && pid !== String(process.pid)) {
        pids.add(Number(pid));
      }
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
      } catch (_) {}
    }
  } else {
    try {
      execSync('fuser -k 5000/tcp', { stdio: 'ignore' });
    } catch (_) {}
  }
} catch (_) {
  // Port was not in use or netstat returned non-zero; safe to continue
}
