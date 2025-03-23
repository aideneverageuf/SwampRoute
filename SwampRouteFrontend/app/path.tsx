import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';

const PathScreen = () => {
  const { start, end } = useLocalSearchParams();
  const [directions, setDirections] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const [totalDistance, setTotalDistance] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!start || !end) {
        setError('Missing start or end location.');
        setLoading(false);
        return;
      }

      try {
        setError(null);
        setLoading(true);

        const [coordinatesRes, directionsRes, totalDistanceRes, estimatedTimeRes] = await Promise.all([
          fetch(`http://192.168.200.88:5000/path/coordinates?start=${start}&end=${end}`),
          fetch(`http://192.168.200.88:5000/path/directions?start=${start}&end=${end}`),
          fetch(`http://192.168.200.88:5000/path/total_distance?start=${start}&end=${end}`),
          fetch(`http://192.168.200.88:5000/path/estimated_time?start=${start}&end=${end}`),
        ]);

        const coordinatesData = await coordinatesRes.json();
        const directionsData = await directionsRes.json();
        const totalDistanceData = await totalDistanceRes.json();
        const estimatedTimeData = await estimatedTimeRes.json();

        if (coordinatesData.coordinates) setCoordinates(coordinatesData.coordinates);
        if (directionsData.directions) setDirections(directionsData.directions);
        if (totalDistanceData.total_distance) setTotalDistance(totalDistanceData.total_distance);
        if (estimatedTimeData.estimated_time) setEstimatedTime(estimatedTimeData.estimated_time);

      } catch (error) {
        setError('Failed to fetch path data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [start, end]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading path...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}

      <ScrollView style={styles.directionsContainer}>
        {directions.length > 0 ? (
          directions.map((direction, index) => (
            <Text key={index} style={styles.directionText}>{direction}</Text>
          ))
        ) : (
          <Text>No directions available</Text>
        )}

        {totalDistance !== null && estimatedTime !== null && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailText}>Total Distance: {totalDistance} miles</Text>
            <Text style={styles.detailText}>Estimated Walking Time: {estimatedTime}</Text>
          </View>
        )}
      </ScrollView>

      {coordinates.length > 0 && (
        <View style={styles.mapContainer}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: coordinates[0].latitude,
              longitude: coordinates[0].longitude,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            }}
          >
            <Polyline coordinates={coordinates} strokeWidth={4} strokeColor="blue" />
            <Marker coordinate={coordinates[0]} title="Start" pinColor="green" />
            <Marker coordinate={coordinates[coordinates.length - 1]} title="Destination" pinColor="red" />
          </MapView>
        </View>
      )}
    </View>
  );
};

export default PathScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  directionsContainer: {
    flex: 1,
    marginTop: 20,
  },
  directionText: {
    marginBottom: 10,
  },
  detailsContainer: {
    marginTop: 20,
  },
  detailText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapContainer: {
    height: 300,
    marginTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});
