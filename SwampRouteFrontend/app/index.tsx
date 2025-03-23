import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");

  const handleFindPath = () => {
    if (startLocation && endLocation) {
      router.push({
        pathname: "/path",
        params: { start: startLocation, end: endLocation },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SwampRoute</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter starting location"
        value={startLocation}
        onChangeText={setStartLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter destination"
        value={endLocation}
        onChangeText={setEndLocation}
      />

      <Button title="Find Path" onPress={handleFindPath} />
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
});
