# Soap 🧼

Your new server 💾
Simple, quick and light 🤏

📂 Zipped under 5kb with updates.

![](https://img.shields.io/bundlephobia/min/@hikyu/soap?style=flat-square)
![](https://img.shields.io/npm/dw/@hikyu/soap?style=flat-square)
![](https://img.shields.io/github/last-commit/jhikyu/-hikyu.soap?style=flat-square)

## Install

```bash
npm i @hikyu/soap
```

## Init

I will use the simple 🐣 require for demonstration
```js
const soap = require('@hikyu/soap');

// Run once if the server is started
soap.once('started', function(data) {
    console.log(`Server running on port ${data.port} (Listener)`);
});

// Add GET route to render index.html
soap.get('/', (req, res) => {
    res.render('index.html');
});

// Start the server on port 3000
soap.init(3000);
```

<!-- ## Functions
- [Numbers 🔢](#numbers)

### Numbers 🔢

#### Digit

```js
// Random number from 0 to 9
digit(); // > 8

// Random number from 0 to 4
digit(4); // > 1
``` -->