import { ISafePrime } from "../andos/models";
import { Schema, model } from 'mongoose';

interface IServerKey {
  p: ISafePrime;
  q: ISafePrime;
}

const ServerKeySchema = new Schema<IServerKey>({
  p: String,
  q: String,
  y: String,
});

const ServerKey = model<IServerKey>("serverKey", ServerKeySchema);

export default ServerKey;
