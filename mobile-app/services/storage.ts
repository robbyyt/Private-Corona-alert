import AsyncStorage from '@react-native-async-storage/async-storage';
import { ILocation } from "../models/location";
import { differenceInHours } from 'date-fns';

export interface UpdateStorageReturn {
  data: ILocation[] | null,
  error: boolean
};

export const updateLocationData = async (locationData: ILocation): Promise<UpdateStorageReturn> => {
  try {
    const locations: string | null = await AsyncStorage.getItem('@location_data');
    let locationArr: ILocation[] = [locationData];

    if(locations) {
      let storageLocations = JSON.parse(locations) as ILocation[];
      storageLocations = filterLocationArray(storageLocations);
      locationArr = [...locationArr, ...storageLocations];
    }
    await AsyncStorage.setItem('@location_data', JSON.stringify(locationArr));
    return {
      data: locationArr,
      error: false,
    };
  } catch (e) {
    return {
      data: null,
      error: true,
    }
  }
};

export const clearLocationData = async () => {
      try {
        await AsyncStorage.removeItem('@location_data');
        return true;
    }
    catch(exception) {
        return false;
    }
};

const filterLocationArray = (locationArr: ILocation[]): ILocation[] => {
  return locationArr.filter(location => differenceInHours(new Date(location.timestamp), new Date()) < 72);
};
