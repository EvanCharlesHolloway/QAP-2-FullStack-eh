const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const events = require('events');

const eventEmitter = new events.EventEmitter();

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;

    switch (pathName) {
        case '/about':
            eventEmitter.emit('log', 'About page accessed');
            serveHTML(res, 'about.html');
            break;
        case '/contact':
            eventEmitter.emit('log', 'Contact page accessed');
            serveHTML(res, 'contact.html');
            break;
        case '/products':
            eventEmitter.emit('log', 'Products page accessed');
            serveHTML(res, 'products.html');
            break;
        case '/subscribe':
            eventEmitter.emit('log', 'Subscribe page accessed');
            serveHTML(res, 'subscribe.html');
            break;
        case '/services':
            eventEmitter.emit('log', 'Services page accessed');
            serveHTML(res, 'services.html');
            break;
        case '/blog':
            eventEmitter.emit('log', 'Blog page accessed');
            serveHTML(res, 'blog.html');
            break;
        default:
            eventEmitter.emit('log', 'Page not found');
            serveHTML(res, 'notfound.html');
    }
});

function serveHTML(res, fileName) {
    const filePath = path.join(__dirname, 'views', fileName);

    // Determine the file extension
    const fileExtension = path.extname(filePath).toLowerCase();

    // Define content types based on file extensions
    const contentTypeMap = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
    };

    // Set the Content-Type header based on the file extension
    const contentType = contentTypeMap[fileExtension] || 'application/octet-stream';

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            eventEmitter.emit('log', `File not found: ${filePath}`);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
        } else {
            eventEmitter.emit('log', `File served: ${filePath}`);
            res.writeHead(200, { 'Content-Type': contentType });
            res.write(data);
            res.end();
        }
    });
}

eventEmitter.on('log', (message) => {
    console.log(message);
    fs.appendFile('server.log', message + '\n', (err) => {
        if (err) throw err;
        console.log('Log has been saved to server.log');
    });
});

const PORT = 3002;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
