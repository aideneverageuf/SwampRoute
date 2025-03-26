import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import placesData from "../assets/uf_campus.json"; 

// Extract node names that are not empty
const placeNames = placesData.nodes
  .map((node) => node.name)
  .filter((name) => name.trim() !== ""); // Remove empty names

export default function HomeScreen() {
  const router = useRouter();
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [filteredStartSuggestions, setFilteredStartSuggestions] = useState([]);
  const [filteredEndSuggestions, setFilteredEndSuggestions] = useState([]);
  
  // Function to filter places based on user input
  const filterSuggestions = (text: string, setFilteredList: Function) => {
    if (text) {
      const filtered = placeNames.filter((place) =>
        place.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredList(filtered);
    } else {
      setFilteredList([]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SwampRoute</Text>

      {/* Start Location Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter starting location"
        value={startLocation}
        onChangeText={(text) => {
          setStartLocation(text);
          filterSuggestions(text, setFilteredStartSuggestions);
        }}
      />
      {filteredStartSuggestions.length > 0 && (
        <FlatList
          data={filteredStartSuggestions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => {
                setStartLocation(item);
                setFilteredStartSuggestions([]); // Hide suggestions after selection
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* End Location Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter destination"
        value={endLocation}
        onChangeText={(text) => {
          setEndLocation(text);
          filterSuggestions(text, setFilteredEndSuggestions);
        }}
      />
      {filteredEndSuggestions.length > 0 && (
        <FlatList
          data={filteredEndSuggestions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => {
                setEndLocation(item);
                setFilteredEndSuggestions([]);
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Button title="Find Path" onPress={() => {
        if (startLocation && endLocation) {
          router.push({
            pathname: "/path",
            params: { start: startLocation, end: endLocation },
          });
        }
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  suggestionItem: {
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    width: "80%",
    alignItems: "center",
  },
});
