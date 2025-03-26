import osmnx as ox
import pandas as pd  # Handle NaN
import json

print(ox.__version__)

# Define location
place_name = "University of Florida, Gainesville, Florida, USA"

# Download graph
print("Downloading graph data...")
graph = ox.graph.graph_from_place(place_name, network_type="walk")

# Download building data
print("Downloading building data...")
buildings = ox.features_from_place(place_name, tags={"building": True})

# Convert graph to dict for processing
nodes = {}
for node, data in graph.nodes(data=True):
    nodes[node] = {
        "id": node,
        "x": data["x"],
        "y": data["y"],
        "name": data.get("name", "")
    }
    print("Node extracted")

edges = []
for u, v, data in graph.edges(data=True):
    edge = {
        "from": u,
        "to": v,
        "weight": data["length"],  # Use length as weight (distance)
        "road_name": data.get("name", "")  # Extract road name, default to empty
    }
    edges.append(edge)
    print("Edge extracted")

# Dictionary to track name occurrences
name_counts = {}

# Assign building names to nearest graph node
print("Assigning building names...")
for _, building in buildings.iterrows():
    # Replace NaN with an empty string
    building_name = building.get("name", "")
    if pd.isna(building_name):  # Check if the name is NaN
        building_name = ""

    if building_name:  # Only proceed if the name is not empty
        building_point = building.geometry.centroid

        # Find the nearest graph node to the building
        nearest_node = ox.distance.nearest_nodes(graph, building_point.x, building_point.y)

        if nearest_node in nodes:
            # Check if the name already exists
            if building_name in name_counts:
                name_counts[building_name] += 1
                new_name = f"{building_name} {name_counts[building_name]}"
            else:
                name_counts[building_name] = 1
                new_name = building_name

            nodes[nearest_node]["name"] = new_name

# Save data to JSON
data = {
    "nodes": list(nodes.values()),
    "edges": edges
}

output_path_backend = "C:/Users/aiden/vscode/Personal/SwampRoute/backend/data/uf_campus.json"
output_path_frontend = "C:/Users/aiden/vscode/Personal/SwampRoute/SwampRouteFrontend/assets/uf_campus.json"

with open(output_path_backend, "w") as f:
    json.dump(data, f, indent=2)

with open(output_path_frontend, "w") as f:
    json.dump(data, f, indent=2)

print(f"Data saved to {output_path_backend} and {output_path_frontend}")
