import { Schema, model } from 'mongoose';

interface ISectorInformation {
  sectorIdentifier: string;
  locationInformation: string[],
  locationZArray: string[][]
}

const SectorInformationSchema = new Schema<ISectorInformation>({
    sectorIdentifier: {
      type: String,
      required: true,
      default: null,
    },
    locationInformation: {
      type: Array,
      required: true,
      default: []
    },
    locationZArray: {
      type: Array,
      required: true,
      default: []
    }
  }
);

const SectorInformation = model<ISectorInformation>("sectors", SectorInformationSchema);

export default SectorInformation;
