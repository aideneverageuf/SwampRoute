import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import MapDirections from '../components/MapDirections';
import { calculatePath } from '../utils/pathUtils';

const MapScreen = ({ route }) => {
  const { start, destination } = route.params;
  const startNode = findNodeByName(start);
  const destinationNode = findNodeByName(destination);
  const { path, directions } = calculatePath(startNode, destinationNode);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: startNode.y,
          longitude: startNode.x,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Polyline
          coordinates={path.map((node) => ({
            latitude: node.y,
            longitude: node.x,
          }))}
          strokeColor="#0000FF"
          strokeWidth={3}
        />
        <Marker
          coordinate={{ latitude: startNode.y, longitude: startNode.x }}
          title="Start"
        />
        <Marker
          coordinate={{
            latitude: destinationNode.y,
            longitude: destinationNode.x,
          }}
          title="Destination"
        />
      </MapView>
      <MapDirections directions={directions} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;