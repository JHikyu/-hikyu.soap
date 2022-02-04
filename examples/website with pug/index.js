const soap = require('@hikyu/soap');

//* Event listeners
soap.once('started', (data) => console.log(`Server started on port ${data.port}`));
soap.on('get', (data) => console.log(`GET ${data.path}`));
soap.on('render', (data) => console.log(`Rendering ${data.path}`));

//* Routes
soap.get('/', (req, res) => res.render('landing.pug', { title: 'Soap 🧼' }));

//* Start server
soap.init(3000);