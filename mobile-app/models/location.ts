export interface IRegion {
  longitude: number,
  latitude: number,
}

export interface ILocation extends IRegion{
  timestamp: number
};
