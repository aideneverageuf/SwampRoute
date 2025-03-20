import osmnx as ox
import pandas as pd #handle NaN
from shapely.geometry import Point
import json
print(ox.__version__)

#define location
place_name = "University of Florida, Gainesville, Florida, USA"

#download graph
print("Downloading graph data...")
graph = ox.graph.graph_from_place(place_name, network_type="walk")

#download building data
print("Downloading building data...")
buildings = ox.features_from_place(place_name, tags={"building": True})

#convert graph to dict for processing
nodes = {}
for node, data in graph.nodes(data=True):
    nodes[node] = {
        "id": node,
        "x": data["x"],
        "y": data["y"],
        "name": data.get("name", "")
    }
    print("node extracted" )

edges = []
for u, v, data in graph.edges(data=True):
    edge = {
        "from": u,
        "to": v,
        "weight": data["length"], #use length as weight(dist)
        "road_name": data.get("name", "") #extract road name, default to empty
    }
    edges.append(edge)
    print("edge extracted")

#assign building names to nearest graph node
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
            nodes[nearest_node]["name"] = building_name

#save data to JSON
data = {
    "nodes": list(nodes.values()),
    "edges": edges
}

with open("data/uf_campus.json", "w") as f:
    json.dump(data, f, indent=2)

print("Data saved to uf_campus.json")
