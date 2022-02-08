# Soap 🧼

Your new server 💾
Simple, quick and light 🤏

![](https://img.shields.io/bundlephobia/min/@hikyu/soap?style=flat-square)
![](https://img.shields.io/npm/dw/@hikyu/soap?style=flat-square)
![](https://img.shields.io/github/last-commit/jhikyu/-hikyu.soap?style=flat-square)

## Install 🗃
You may have to install a view engine of your choice too 📌
```bash
npm i @hikyu/soap
```

## Usage

I will use the simple 🐣 require for demonstration

```js
const soap =  require('@hikyu/soap');

// Run once if the server is started
soap.once('started', (data) => {
	console.log(`Server running on port ${data.port} (Listener)`);
});

// Start the server on port 3000 ⚙
soap.init(3000);
```

## Content
- [Routes](#routes)
	- [Smart-Routing](#smart-routing)
	- [Render](#render)
    - [Send](#send)
    - [JSON](#json)
- [Parameters](#parameters)
    - [Query](#query)
    - [Post body](#body)
- [Folders](#folders)
	-[Views](#views)
	-[Public](#public)
- [Events](#events)


## Routes

```js
soap.get('path', callback);

soap.post('path', callback);
```

### Smart-Routing
Automatically renders pages from the views folder.
Depends on the requested path
[Example](https://github.com/JHikyu/-hikyu.soap/tree/master/examples/smart%20routing)

```js
// Enable smartRouting and set options
soap.smartRouting({
    // enabled: true,
    viewEngine: 'pug',
    defaultPage: 'landing' // localhost/ => ./views/landing.pug
});

// localhost/        => ./views/landing.pug
// localhost/page    => ./views/page.pug
// localhost/tasks/1 => ./views/tasks/1.pug
```

### Render
It's pretty simple to use  view engines 👀 in Soap 🧼
Just add the extention to the path and render it!
Avaiable view engines:
- HTML
- EJS
- Pug

```js
soap.get('/', (req, res) => {
	// HTML
	res.render('index.html');

	// EJS
	res.render('index.ejs', { siteName: "Soap 🧼" });

	// Pug
	res.render('index.pug', { siteName: "Soap 🧼" });
});
```

### Send
Just want to show simple text 📃?
So use send

```js
soap.get('/', (req, res) => {
	res.send('Hey there, this is sent via Soap 🧼!');
});
```

### JSON
Same with send there's JSON rendering aswell 🔡

```js
soap.get('/', (req, res) => {
	res.json([
		{ name: "Dog", emoji: "🐕" },
		{ name: "Cat", emoji: "🐈" },
		{ name: "Llama", emoji: "🦙" }
	]);
});
```

## Parameters

### Query
```js
// Get query parameters is simple:
soap.get('/', (req, res) => {
	const query = req.query;
	res.send(`Your query: ${query}`);
});
```

### Body
```js
// For the body of post:
soap.post('/', async (req, res) => {
	// It's required to wait a bit
	const post = await req.post;
	res.send(`Your post body: ${post}`);
});
```

## Folders

### Views
Every file that will be rendered, should be in the ./views folder.

### Public
Files that have to be user-reachable, should be in the ./public folder.



## Events

```js
// Run once if the server has started
soap.once('started', (data) => {
	console.log(`Server running on port ${data.port} (Listener)`);
});

// Run every time when a client requests a route
soap.on('request', (data) => {
	console.log(`Client requests on path ${data.path} (Listener)`);
});

// Run every time a file is sent to the client
soap.on('load', (data) => {
	console.log(`File ${data.path} loaded (Listener)`);
});

// Run every time a file is rendered
soap.on('render', (data) => {
	console.log(`File ${data.file} rendered on path ${data.path} (Listener)`);
});

// Run every time, json is sent
soap.on('json', (data) => {
	console.log(`Sent json data from ${data.path} (Listener)`);
});

// Run every time, pain text is sent
soap.on('send', (data) => {
	console.log(`Sent plaint text from ${data.path} (Listener)`);
});

// Run every time a path is not found
soap.on('404', (data) => {
	console.log(`Path ${data.path} not found (Listener)`);
});

// GET
soap.on('get', (data) => {
	console.log(`GET ${data.path}`);
});

// POST
soap.on('post', (data) => {
	console.log(`POST ${data.path}`);
});
```