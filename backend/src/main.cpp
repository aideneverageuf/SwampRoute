#include <iostream>
#include <fstream>
#include <vector>
#include <unordered_map>
#include <queue>
#include <sstream>
#include <cmath>
#include <algorithm>
#include <iomanip>
#include "json.hpp"
#include <math.h>
#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

using json = nlohmann::json;
using namespace std;

// Node structure
struct Node {
    int id;
    double x, y;
    string name;
};

// Edge structure
struct Edge {
    int to;
    double weight;
    string roadName;
};

// Graph representation
using Graph = unordered_map<int, vector<Edge>>;

// Heuristic function (Euclidean distance)
double heuristic(const Node& a, const Node& b) {
    return sqrt(pow(a.x - b.x, 2) + pow(a.y - b.y, 2));
}

// A* algorithm implementation
vector<int> aStar(const Graph& graph, const unordered_map<int, Node>& nodes, int start, int goal) {
    priority_queue<pair<double, int>, vector<pair<double, int>>, greater<pair<double, int>>> pq;
    unordered_map<int, double> costSoFar;
    unordered_map<int, int> cameFrom;

    pq.push({0, start});
    cameFrom[start] = -1;
    costSoFar[start] = 0;

    while (!pq.empty()) {
        int current = pq.top().second;
        pq.pop();

        if (current == goal) break;

        for (const auto& edge : graph.at(current)) {
            int next = edge.to;
            double newCost = costSoFar[current] + edge.weight;
            if (!costSoFar.count(next) || newCost < costSoFar[next]) {
                costSoFar[next] = newCost;
                double priority = newCost + heuristic(nodes.at(next), nodes.at(goal));
                pq.push({priority, next});
                cameFrom[next] = current;
            }
        }
    }

    // Reconstruct path
    vector<int> path;
    for (int node = goal; node != -1; node = cameFrom[node]) {
        path.push_back(node);
    }
    reverse(path.begin(), path.end());
    return path;
}

// Convert a string to lowercase
string toLowercase(const string& str) {
    string lowerStr = str;
    transform(lowerStr.begin(), lowerStr.end(), lowerStr.begin(), ::tolower);
    return lowerStr;
}

// Calculate the angle between two points (in radians)
double calculateAngle(double x1, double y1, double x2, double y2) {
    return atan2(y2 - y1, x2 - x1);
}

// Get the direction between two consecutive nodes
string getDirection(const Node& prev, const Node& curr, const Node& next, const string& roadName, double distance) {
    double angle1 = calculateAngle(prev.x, prev.y, curr.x, curr.y);
    double angle2 = calculateAngle(curr.x, curr.y, next.x, next.y);
    double angleDiff = angle2 - angle1;

    // Normalize the angle difference to [-π, π]
    if (angleDiff > M_PI) angleDiff -= 2 * M_PI;
    if (angleDiff < -M_PI) angleDiff += 2 * M_PI;

    // Convert distance from meters to miles
    double distanceMiles = distance * 0.000621371;

    // Format distance based on its value
    string distanceStr;
    if (distanceMiles < 0.1) {
        // Convert to feet (1 mile = 5280 feet)
        int distanceFeet = static_cast<int>(distanceMiles * 5280);
        distanceStr = to_string(distanceFeet) + " feet";
    } else {
        // Round to two decimal places for miles
        stringstream distanceStream;
        distanceStream << fixed << setprecision(2) << distanceMiles;
        distanceStr = distanceStream.str() + " miles";
    }

    // Determine the direction
    if (abs(angleDiff) < M_PI / 8) {
        if (roadName.empty()) {
            return "Continue straight for " + distanceStr;
        } else {
            return "Continue straight on " + roadName + " for " + distanceStr;
        }
    } else if (angleDiff > 0) {
        if (roadName.empty()) {
            return "Turn right for " + distanceStr;
        } else {
            return "Turn right onto " + roadName + " for " + distanceStr;
        }
    } else {
        if (roadName.empty()) {
            return "Turn left for " + distanceStr;
        } else {
            return "Turn left onto " + roadName + " for " + distanceStr;
        }
    }
}

// Convert decimal minutes to minutes and seconds
string formatWalkingTime(double totalMinutes) {
    int minutes = static_cast<int>(totalMinutes);
    int seconds = static_cast<int>((totalMinutes - minutes) * 60);
    return to_string(minutes) + " minutes " + to_string(seconds) + " seconds";
}

int main(int argc, char* argv[]) {
    // Load the graph data from JSON
    string filePath = "C:/Users/aiden/vscode/Personal/SwampRoute/backend/data/uf_campus.json";
    ifstream file(filePath);
    if (!file.is_open()) {
        cerr << "Error: Could not open JSON file at path: " << filePath << endl;
        return 1;
    }

    // Parse the JSON file
    json data;
    try {
        file >> data;
    } catch (const json::parse_error& e) {
        cerr << "JSON parse error: " << e.what() << endl;
        return 1;
    }

    // Parse nodes
    unordered_map<int, Node> nodes;
    unordered_map<string, int> nameToId; // Map building names (lowercase) to node IDs
    for (const auto& node : data["nodes"]) {
        nodes[node["id"]] = {node["id"], node["x"], node["y"], node["name"]};
        if (!node["name"].empty()) {
            nameToId[toLowercase(node["name"])] = node["id"];
        }
    }

    // Parse edges and build the graph
    Graph graph;
    for (const auto& edge : data["edges"]) {
        string roadName;
        if (edge["road_name"].is_array()) {
            for (const auto& name : edge["road_name"]) {
                if (!roadName.empty()) roadName += " / ";
                roadName += name.get<string>();
            }
        } else if (edge["road_name"].is_string()) {
            roadName = edge["road_name"];
        }
        graph[edge["from"]].push_back({edge["to"], edge["weight"], roadName});
    }

    // Get user input for start and goal buildings
    if (argc != 3) {
        cerr << "Usage: main.exe <start> <end>" << endl;
        return 1;
    }

    string startName = argv[1];
    string goalName = argv[2];

    // Convert input to lowercase for case-insensitive comparison
    string startNameLower = toLowercase(startName);
    string goalNameLower = toLowercase(goalName);

    // Find the node IDs for the start and goal buildings
    if (!nameToId.count(startNameLower)) {
        cerr << "Error: Starting building '" << startName << "' not found." << endl;
        return 1;
    }
    if (!nameToId.count(goalNameLower)) {
        cerr << "Error: Destination building '" << goalName << "' not found." << endl;
        return 1;
    }

    int start = nameToId[startNameLower];
    int goal = nameToId[goalNameLower];

    // Run A* algorithm
    vector<int> path = aStar(graph, nodes, start, goal);

    // Calculate total distance and estimated walking time
    double totalDistance = 0.0;
    for (size_t i = 1; i < path.size(); ++i) {
        const Node& curr = nodes.at(path[i]);
        const Node& prev = nodes.at(path[i - 1]);

        // Calculate the distance between consecutive nodes (Euclidean distance)
        double dist = graph.at(curr.id)[0].weight;  // This is the edge weight, distance between nodes
        totalDistance += dist;
    }

    // Convert total distance to miles
    double totalDistanceMiles = totalDistance * 0.000621371;  // Convert meters to miles
    totalDistanceMiles = round(totalDistanceMiles * 100.0) / 100.0;  // Round to hundredths place

    // Estimate walking time (walking speed of 3 miles per hour)
    double walkingSpeedMph = 3.0;  // miles per hour
    double estimatedTimeHours = totalDistanceMiles / walkingSpeedMph;
    double estimatedTimeMinutes = estimatedTimeHours * 60;
    int minutes = static_cast<int>(estimatedTimeMinutes);
    int seconds = static_cast<int>((estimatedTimeMinutes - minutes) * 60);

    // Format total distance and estimated walking time
    stringstream timeStream;
    timeStream << minutes << " minutes " << seconds << " seconds";

    // Build the response to include directions and coordinates
    json response;
    vector<json> coordinates;
    vector<string> directions;

    for (size_t i = 1; i < path.size() - 1; ++i) {
        const Node& prev = nodes.at(path[i - 1]);
        const Node& curr = nodes.at(path[i]);
        const Node& next = nodes.at(path[i + 1]);

        double distance = graph.at(curr.id)[0].weight;  // Distance to the next node
        string roadName = graph.at(curr.id)[0].roadName;  // Road name
        string direction = getDirection(prev, curr, next, roadName, distance);
        directions.push_back(direction);

        // Add coordinates
        coordinates.push_back({{"latitude", curr.y}, {"longitude", curr.x}});
    }

    // Add total distance and estimated time to the response
    response["coordinates"] = coordinates;
    response["directions"] = directions;
    response["total_distance"] = totalDistanceMiles;  // Add total distance in miles
    response["estimated_time"] = timeStream.str();    // Add estimated walking time

    // Send the response as JSON
    cout << response.dump(4) << endl;

    return 0;
}
