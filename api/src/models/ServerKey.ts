import { ISafePrime } from "../andos/models";
import { Schema, model } from 'mongoose';

interface IServerKey {
  p: string;
  q: string;
  y: string;
  n: string
}

const ServerKeySchema = new Schema<IServerKey>({
  p: String,
  q: String,
  n: String,
  y: String,
});

const ServerKey = model<IServerKey>("serverKey", ServerKeySchema);

export default ServerKey;
