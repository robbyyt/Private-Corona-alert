import * as React from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, ScrollView, IconButton, View } from '../components/Themed';

export default function TabTwoScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        General Information
      </Text>
      <Text style={styles.content}>
        The application uses a cryptographic primitive called Oblivious Transfer to assure location privacy.
        In the current version, the server only gets a general area of the user, accurate to only 1km.
      </Text>
      <Text style={styles.title}>
        Usage guide
      </Text>
      <Text style={styles.content}>
        By default, the device location will be selected. If unavailable, the user can
        still press anywhere on the map to change the current location.
        The currently selected location is shown using a <Text style={styles.green}>green</Text> marker.
        The user can
        reselect his current location by pressing:
      </Text>
      <IconButton icon="crosshairs-gps" />
      <Text style={styles.content}>
        After pressing the "Verify contact risk" button, if there are any risky locations, they will
        be shown on the map using a <Text style={styles.red}>red</Text> marker. To return to the normal
        application view, a user can simply press:
      </Text>
      <IconButton icon="close-circle" />
      <Text style={styles.title}>
        How can I see the locations of risk without revealing my position?
      </Text>
      <Text style={styles.content}>
        Locations verified in the last 72 hours are stored locally on the device, and when
        the "Verify contact risk" button is pressed, those locations are recovered from memory,
        hidden when communicating to the server by using Oblivious Transfer, and the server response
        is then correlated to the initial location.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  green: {
    color: "green"
  },
  red: {
    color: "red"
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
    textAlign: 'center'
  },
  content: {
    fontSize: 14,
    alignSelf: 'center',
    textAlign: 'center'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
