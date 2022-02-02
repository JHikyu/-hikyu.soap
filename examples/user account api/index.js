const soap = require('@hikyu/soap');
const fs = require('fs');

//* Event listeners
soap.on('started', (data) => console.log(`Running on port ${data.port}`));
soap.on('json', (data) => console.log(`Sent JSON data at ${data.path}`));

// Load in user list
let users = JSON.parse(fs.readFileSync('./users.json', 'utf8'));

//* Routes
// Get all users
soap.get('/users', (req, res) => res.json(users));

// Get user by any id
soap.get('/user', (req, res) => {
    // Get id
    const id = req.query.id;
    if(!id) return res.json({ error: 'No id provided' });

    // Find user by query
    const user = users.find(user => user.id === parseInt(id));

    // Return users
    res.json(user || { error: 'User not found' });
});

// Add user
soap.post('/user', async (req, res) => {
    // Get post body
    const post = await req.post;

    // Check if body is correct
    if(!post.name || !post.age) {
        return res.json({ error: 'Missing name or age' });
    }

    // Add user to list
    users.push({
        id: users[users.length - 1].id + 1, // Get last id and add one
        name: post.name,
        age: post.age
    });

    // Save list
    fs.writeFileSync('./users.json', JSON.stringify(users));

    // Return user
    res.json(users[users.length - 1]);
});

// Listen on port 3000
soap.init(3000);