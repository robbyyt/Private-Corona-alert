import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import MapView, { MapEvent, Marker } from 'react-native-maps';
import { Text, View, IconButton, Button } from '../components/Themed';
import { getCurrentLocation } from "../services/location";
import { ILocation, IRegion } from '../models/location';

export default function TabOneScreen() {
  const [region, setRegion] = useState<IRegion>();
  const [location, setLocation] = useState<ILocation>();

  useEffect(() => {
    (async () => {
      const userLocation = await getCurrentLocation();
      Alert.alert(`${userLocation.latitude}
      ${userLocation.longitude}`)
      setLocation(userLocation);
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

  const crosshairBtnPress = async () => {
      const userLocation = await getCurrentLocation();
      setLocation(userLocation);
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} onPress={onMapPress} >
        {location &&
          <Marker coordinate ={location}/>
        }
      </MapView>
      <View style={styles.crosshairContainer}>
        <IconButton icon="crosshairs-gps"  onPress={crosshairBtnPress}/>

      </View>
      <View style={styles.checkSafetyContainer}>
        <Button>
          Check for 🦠
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
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
  }
});
