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
        case '/socials':
            eventEmitter.emit('log', 'Socials page accessed');
            serveHTML(res, 'socials.html');
            break;
        default:
            eventEmitter.emit('log', 'Page not found');
            serveHTML(res, 'notfound.html');
    }

    // After serving a response, emit an event based on the HTTP status code
    res.on('finish', () => {
        const statusCode = res.statusCode;
        if (statusCode >= 200 && statusCode < 300) {
            eventEmitter.emit('success', `Request for ${pathName} - Status Code: ${statusCode}`);
        } else if (statusCode >= 400 && statusCode < 500) {
            eventEmitter.emit('clientError', `Client Error for ${pathName} - Status Code: ${statusCode}`);
        } else if (statusCode >= 500) {
            eventEmitter.emit('serverError', `Server Error for ${pathName} - Status Code: ${statusCode}`);
        }
    });
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

// Usage of eventEmitter.on() method for custom events
eventEmitter.on('success', (message) => {
    console.log(`Success: ${message}`);
});

eventEmitter.on('clientError', (message) => {
    console.error(`Client Error: ${message}`);
});

eventEmitter.on('serverError', (message) => {
    console.error(`Server Error: ${message}`);
});

const PORT = 3002;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
