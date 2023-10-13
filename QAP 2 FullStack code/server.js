const http = require('http');
const url = require('url');
const fs = require('fs');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;

    switch (pathName) {
        case '/about':
            eventEmitter.emit('log', 'About page accessed');
            handleResponse(res, 'About Us Page');
            break;
        case '/contact':
            eventEmitter.emit('log', 'Contact page accessed');
            handleResponse(res, 'Contact Us Page');
            break;
        case '/products':
            eventEmitter.emit('log', 'Products page accessed');
            handleResponse(res, 'Our Products');
            break;
        case '/subscribe':
            eventEmitter.emit('log', 'Subscribe page accessed');
            handleResponse(res, 'Subscribe Now');
            break;
        case '/services':
            eventEmitter.emit('log', 'Services page accessed');
            handleResponse(res, 'Our Services');
            break;
        case '/blog':
            eventEmitter.emit('log', 'Blog page accessed');
            handleResponse(res, 'Latest Blog Posts');
            break;
        default:
            eventEmitter.emit('log', 'Page not found');
            handleResponse(res, 'Page Not Found');
    }
});

function handleResponse(res, content) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`<h1>${content}</h1>`);
    res.end();
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
