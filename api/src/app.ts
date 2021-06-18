'use strict';

import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import StatusCodes from "http-status-codes";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from "helmet";

import { SectorInformation, ServerKey } from "./models";
import { generateSafePrime, generateQNRModRSA } from "./andos/utils/primes";
import { serializeSafePrime } from "./utils/conversions";
import { IRSAModulus } from "./andos/models";
import router from "./routes";

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
app.use(bodyParser.json({limit: '50MB'}));

// router
app.use('/api', router);

// 404
app.use((req, res, next) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .send({ message: `Route ${req.url} Not found.` });
});

// 500 - Any server error
app.use((error, req, res, next) => {
  console.log(error);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error });
});

(async () => {
  await mongoose.connect(env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log("Connected to DB"))
  .catch(err => console.log(`DB connection error: ${err}`));

  const serverKeyInfo = await ServerKey.find();
  if(!serverKeyInfo.length) {
    console.log("Generating server key...");
    const p = await generateSafePrime(1024);
    const q = await generateSafePrime(1024);
    const n: IRSAModulus = {
      p,
      q,
      value: p.value * q.value
    };

    const y = generateQNRModRSA(n);
    console.log(
      `Generated server key:
      p = ${p.value}
      q = ${q.value}
      y = ${y}
      `);

    const key = new ServerKey({
      p: serializeSafePrime(p),
      q: serializeSafePrime(q),
      n: (p.value * q.value).toString(),
      y: y.toString()
    });

    key.save();

  }
})()


app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));

