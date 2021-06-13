
const minuteInMs = 60000;

import * as Location from 'expo-location';
import { ILocation } from "../models/location";

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
