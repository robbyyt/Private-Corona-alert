import { Schema, model } from 'mongoose';

interface ISectorInformation {
  sectorIdentifier: string;
  locationInformation: Array<string>
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
    }
  }
);

const SectorInformation = model<ISectorInformation>("sectors", SectorInformationSchema);

export default SectorInformation;
