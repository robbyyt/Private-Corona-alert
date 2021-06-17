import * as Location from 'expo-location';
import { ILocation, ILocationInfo, ILocationGroup } from "../models/location";

const sectorPrecision = 2;
const privateLocationPrecision = 2;

const transferMaxValue = Math.pow(10, privateLocationPrecision);

export const getCurrentLocation = async (): Promise<ILocation> => {
  const location: Location.LocationObject = await Location.getCurrentPositionAsync({
    accuracy: 5,
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    timestamp: location.timestamp
  };
};

export const parseLocation = (latitude: number, longitude: number): ILocationInfo => {

  const latitudeValues = latitude.toString().split(".");
  const longitudeValues = longitude.toString().split(".");

  const sectorIdentifier = `${latitudeValues[0]}.${latitudeValues[1].substring(0, sectorPrecision)}/${longitudeValues[0]}.${longitudeValues[1].substring(0, sectorPrecision)}`;

  const privateLatitudeValue = parseInt(latitudeValues[1].substr(sectorPrecision, privateLocationPrecision), 10);
  const privateLongitudeValue = parseInt(longitudeValues[1].substr(sectorPrecision, privateLocationPrecision), 10);

  return {
    sectorIdentifier,
    positionValue: privateLatitudeValue * transferMaxValue + privateLongitudeValue,
  }
}

export const groupLocationsBySectorIdentifier = (locationArr: ILocation[]): ILocationGroup => {
  let result: ILocationGroup = {};

  for(const location of locationArr) {
    const { sectorIdentifier, positionValue } = parseLocation(location.latitude, location.longitude);
    if(!result[sectorIdentifier]) {
      result[sectorIdentifier] = {
        valueArr: [positionValue],
        locationArr: [location]
      };
    } else if(!result[sectorIdentifier].valueArr.includes(positionValue)) {
      result[sectorIdentifier] = {
        valueArr: [...result[sectorIdentifier].valueArr, positionValue],
        locationArr: [...result[sectorIdentifier].locationArr, location]
      };
    }
  };

  return result;
};
