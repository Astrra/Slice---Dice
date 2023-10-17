const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.port || 3000;

app.use(bodyParser.json());

// In-memory data structure to store the dataset
const dataset=[];

// API to add a new record
app.post('/add_record', (req,res) =>{
    const payload = req.body;

    if(!validatePayload(payload, ['name', 'salary', 'currency', 'department', 'sub-department'])){
        return res.status(400).json({ error: 'Invalid payload'});
    }

    dataset.push(payload);
    res.status(201).json({ message: 'Record added successfully' });
});