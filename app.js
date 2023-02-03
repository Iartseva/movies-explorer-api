require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const setErrors = require('./middlewares/setErrors');
// const limiter = require('./middlewares/limiter');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { BASEADRESS_DEV } = require('./utils/constants');

const { NODE_ENV, BASEADRESS, PORT = 3000 } = process.env;
const app = express();

const options = {
  origin: [
    'http://localhost:3000',
    'http://diploma.iartseva.nomoredomains.club',
    'https://diploma.iartseva.nomoredomains.club',
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
// app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(setErrors);

mongoose.connect('mongodb://127.0.0.1/bitfilmsdb'/* NODE_ENV === 'production' ? BASEADRESS : BASEADRESS_DEV */, { useNewUrlParser: true })
  .then(app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  }))
  .catch((err) => console.log(err));
