import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AutocompleteInput from '../components/AutocompleteInput';
import { findNodeByName } from '../utils/pathUtils';
import { globalStyles } from '../styles/globalStyles';

const InputScreen = ({ navigation }) => {
  const [startBuilding, setStartBuilding] = useState(null);
  const [destinationBuilding, setDestinationBuilding] = useState(null);

  const handleFindPath = () => {
    if (startBuilding && destinationBuilding) {
      navigation.navigate('Map', {
        start: startBuilding.title,
        destination: destinationBuilding.title,
      });
    } else {
      alert('Please select both starting and destination buildings.');
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.label}>Starting Building</Text>
      <AutocompleteInput
        data={nodes.map((node) => ({ id: node.id, title: node.name }))}
        placeholder="Search for a building..."
        onSelectItem={(item) => setStartBuilding(item)}
      />
      <Text style={globalStyles.label}>Destination Building</Text>
      <AutocompleteInput
        data={nodes.map((node) => ({ id: node.id, title: node.name }))}
        placeholder="Search for a building..."
        onSelectItem={(item) => setDestinationBuilding(item)}
      />
      <Button title="Find Path" onPress={handleFindPath} />
    </View>
  );
};

export default InputScreen;