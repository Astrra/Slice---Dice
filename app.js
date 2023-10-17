const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;
const secretKey = 'my-secret-key';


app.use(bodyParser.json());

// In-memory data structure to store the dataset
const dataset=[];

// Dummy user for authentication
const dummyUser= { username: 'Akshay', password: 'Akshay@123' };

// Function to generate a JWT token
function generateToken(user){
    return jwt.sign(user, secretKey, { expiresIn: '1h'});
}

// Middleware to check if a request has a valid token
function authenticateToken(req, res, next){
    const token = req.headers['authorization'];

    if(!token){
        return res.status(401).json({ error: 'Unauthorized'});
    }

    jwt.verify(token, secretKey, (err,user) => {
        if(err){
            return res.status(403).json({ error: 'Forbidden'});
        }
        req.user = user;
        next();
    });
}
// API to add a new record
app.post('/add_record', (req,res) =>{
    const payload = req.body;

    if(!validatePayload(payload, ['name', 'salary', 'currency', 'department', 'sub-department'])){
        return res.status(400).json({ error: 'Invalid payload'});
    }

    dataset.push(payload);
    res.status(201).json({ message: 'Record added successfully' });
});


// API to delete a record by name, department, and sub-department
app.delete('/delete_record/:name/:department/:sub_department', authenticateToken, (req, res) => {
    const { name, department, sub_department } = req.params;

    const index = dataset.findIndex(record => (
        record.name === name &&
        record.department === department &&
        record.sub_department === sub_department
    ));

    if (index === -1) {
        return res.status(404).json({ error: 'Record not found' });
    }

    dataset.splice(index, 1);
    res.json({ message: 'Record deleted successfully' });
});

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});

