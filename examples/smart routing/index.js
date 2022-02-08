const soap = require('@hikyu/soap');

// Enable smartRouting and set options
soap.smartRouting({
    viewEngine: 'pug',
    defaultPage: 'landing' // localhost/ => ./views/landing.pug
});

soap.init(3000);