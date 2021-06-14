'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const StatusCodes = require('http-status-codes');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');

// environment variables
const config = dotenv.config();

if (config.error) {
  throw config.error
};

const env = config.parsed

// port
const PORT = env.APP_PORT || 5000;

const app = express();

// middlewares
app.use(cors());
app.use(helmet())
app.use(bodyParser.json());
app.use(morgan('tiny'));

// 404
app.use((req, res, next) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .send({ message: `Route ${req.url} Not found.` });
});

// 500 - Any server error
app.use((error, req, res, next) => {
  req.log.error(error);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error });
});

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));

