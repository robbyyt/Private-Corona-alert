import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import MapView, { MapEvent, Marker } from 'react-native-maps';
import { Text, View, IconButton, Button, TransparentBGText } from '../components/Themed';
import { getCurrentLocation } from "../services/location";
import { verifyLocations } from "../services/ot";
import { clearLocationData, updateLocationData } from '../services/storage';
import { ILocation } from '../models/location';

export default function TabOneScreen() {
  const [location, setLocation] = useState<ILocation>();
  const [riskyLocations, setRiskyLocations] = useState<ILocation[]>([]);
  const [loadingText, setLoadingText] = useState<string>("");

  useEffect(() => {
    (async () => {
      setLoadingText("Loading current location")
      const userLocation = await getCurrentLocation();
      setLocation(userLocation);
      setLoadingText("");
      await clearLocationData();
    })()
  }, []);

  const updateLocation = (longitude: number, latitude: number) => {
    setLocation({
      longitude,
      latitude,
      timestamp: new Date().valueOf()
    });
  };

  const onMapPress = (e: MapEvent<{}>) => {
    const { longitude, latitude } = e.nativeEvent.coordinate;
    updateLocation(longitude, latitude);
  };

  const onCheckClick = async () => {
    if(location) {
      const {data, error} = await updateLocationData(location);
      let riskyLocations: ILocation[];
      if(error) {
        riskyLocations = await verifyLocations([location]);
        setRiskyLocations(riskyLocations);
      } else if(data) {
        riskyLocations = await verifyLocations(data);
        setRiskyLocations(riskyLocations);
      }
    }
  };

  const crosshairBtnPress = async () => {
      setLoadingText("Loading current location");
      const userLocation = await getCurrentLocation();
      setLocation(userLocation);
      setLoadingText("");
  };

  const closeBtnPress = () => {
    setRiskyLocations([]);
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} onPress={onMapPress} >
        {(location && !riskyLocations.length) &&
          <Marker coordinate={location} pinColor={'green'}/>
        }
        {
          riskyLocations.length ?
            riskyLocations.map((loc) => {
              return (
                <Marker coordinate={loc} pinColor={'red'} key={loc.timestamp} />
              );
            }) : null

        }
      </MapView>
      <View style={styles.crosshairContainer}>
        {
          riskyLocations.length ?
          <IconButton icon="close-circle"  onPress={closeBtnPress} />
          :
          <IconButton icon="crosshairs-gps"  onPress={crosshairBtnPress} />
        }
      </View>
      <View style={[styles.checkSafetyContainer, loadingText? styles.transparentBackground: null]}>
        {loadingText ?
        <Text style={styles.loadingText}>{loadingText}</Text>
        :
        <Button onPress={onCheckClick}>
          Verify contact risk
        </Button>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  map: {
    width: '100%',
    height: '100%'
  },
  crosshairContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: '5%',
    left: '85%'
  },
  checkSafetyContainer: {
  position: 'absolute',
  alignSelf: 'center',
  top: '90%'
  },
  transparentBackground: {
    backgroundColor: "transparent"
  }
});
