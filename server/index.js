const express = require('express');
const app = express();
const cors = require('cors')
app.use(express.json());
app.use(cors());

app.use('/auth', require('./auth'));
app.use('/vacations', require('./vacations'));



app.listen(1000, console.log('server connected port 1000'));
