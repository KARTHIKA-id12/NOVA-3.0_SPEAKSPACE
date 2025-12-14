const net = require('net');
const host = 'smtp.gmail.com';

function check(port) {
    return new Promise(r => {
        const s = new net.Socket();
        s.setTimeout(5000);
        s.connect(port, host, () => { console.log(`PORT ${port}: OPEN`); s.destroy(); r(true); });
        s.on('error', (e) => { console.log(`PORT ${port}: ERROR ${e.message}`); r(false); });
        s.on('timeout', () => { console.log(`PORT ${port}: TIMEOUT`); s.destroy(); r(false); });
    });
}

(async () => {
    await check(465);
    await check(587);
})();
