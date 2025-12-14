const net = require('net');

const host = 'smtp.gmail.com';
const ports = [465, 587];

async function checkPort(port) {
    return new Promise((resolve) => {
        console.log(`Checking connection to ${host}:${port}...`);
        const socket = new net.Socket();
        let status = 'closed';

        // Set a timeout of 5 seconds
        const timeout = setTimeout(() => {
            console.log(`[TIMEOUT] ${host}:${port} timed out after 5000ms`);
            socket.destroy();
            resolve(false);
        }, 5000);

        socket.connect(port, host, () => {
            console.log(`[SUCCESS] Connected to ${host}:${port}`);
            clearTimeout(timeout);
            socket.end();
            resolve(true);
        });

        socket.on('error', (err) => {
            console.log(`[ERROR] Connection to ${host}:${port} failed: ${err.message}`);
            clearTimeout(timeout);
            resolve(false);
        });
    });
}

(async () => {
    console.log("Starting network diagnostic...");
    let results = { 465: false, 587: false };

    for (const port of ports) {
        results[port] = await checkPort(port);
    }

    console.log("\nDiagnostic Results:");
    console.table(results);

    if (!results[465] && results[587]) {
        console.log("\nRECOMMENDATION: Switch to port 587 (STARTTLS). Port 465 seems blocked.");
    } else if (results[465]) {
        console.log("\nRECOMMENDATION: Port 465 is open. The issue might be intermittent or related to SSL handshake settings.");
    } else {
        console.log("\nRECOMMENDATION: Both ports seem blocked. Check firewall or outgoing network restrictions.");
    }
})();
