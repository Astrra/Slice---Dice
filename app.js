const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.port || 3000;

app.use(bodyParser.json());

// In-memory data structure to store the dataset
const dataset=[];

// Function to validate payload schema
