import { ICompleteTransferBody, InitiateTransferResponse } from "../models/api";
import { ILocation, ILocationGroup } from "../models/location";
import { groupLocationsBySectorIdentifier } from "./location";
import { OTReceiver } from "../andos";
import { convertBigIntMatrixToString, convertStringMatrixToBigInt } from "./conversions";
const API_URL = "http://a949ac3b172d.ngrok.io/api";

export const initiateTransfer = async (sectorIdentifier: string) => {
  const apiResponse = await fetch(`${API_URL}/initiate-transfer?sectorIdentifier="${sectorIdentifier}"`);
  const jsonResponse = await apiResponse.json();
  return jsonResponse;
};

export const completeteTransfer = async (sectorIdentifier: string, body: ICompleteTransferBody) => {
  const apiResponse = await fetch(`${API_URL}/complete-transfer?sectorIdentifier="${sectorIdentifier}"`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const jsonResponse = await apiResponse.json();

  return jsonResponse;
};

const computeReceiverChoices = (choices: number[], sigma: number[]) => {
  const result = [];

  for(const choice of choices) {
    result.push(sigma[choice]);
  }

  return result;
}

export const verifyLocations = async (locations: ILocation[]) => {
  const locationGroup: ILocationGroup = groupLocationsBySectorIdentifier(locations);
  for(const sectorIdentifier of Object.keys(locationGroup)) {
    const { n, y, zArray } = await initiateTransfer(sectorIdentifier) as InitiateTransferResponse;
    const receiver = new OTReceiver(BigInt(n), BigInt(y), convertStringMatrixToBigInt(zArray));
    const sigmaPacket = receiver.preparePermutationValues();

    const { results } = await completeteTransfer(sectorIdentifier, {
      sigmaPacket: convertBigIntMatrixToString(sigmaPacket),
      receiverRequest: computeReceiverChoices(locationGroup[sectorIdentifier].valueArr, receiver.sigma)
    });

    console.log(results);
  }
};
