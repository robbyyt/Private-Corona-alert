export interface IRegion {
  longitude: number,
  latitude: number,
}

export interface ILocation extends IRegion{
  timestamp: number
};

export interface ILocationInfo {
  sectorIdentifier: string,
  positionValue: number,
}

export interface ILocationGroupValue {
  locationArr: ILocation[]
  valueArr: number[]
}

export interface ILocationGroup {
  [key: string]: ILocationGroupValue
}
