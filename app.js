require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const setErrors = require('./middlewares/setErrors');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

const options = {
  origin: [
    'http://localhost:3000',
    'http://lastproject.students.nomoredomains.club',
    'https://lastproject.students.nomoredomains.club',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options));

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(setErrors);

mongoose.connect('mongodb://127.0.0.1/diplomDB')
  .then(app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  }))
  .catch((err) => console.log(err));
