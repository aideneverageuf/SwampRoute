import ufCampusData from '../data/uf_campus.json';

// Load nodes and edges from JSON
const nodes = ufCampusData.nodes;
const edges = ufCampusData.edges;

// Find node by name (for autocomplete)
export const findNodeByName = (name) => {
  return nodes.find((node) => node.name.toLowerCase() === name.toLowerCase());
};

// Calculate path using A* (mock implementation)
export const calculatePath = (startNode, destinationNode) => {
  // Replace this with your A* implementation or call your C++ backend
  const path = [startNode, destinationNode]; // Mock path
  const directions = [
    `Walk from ${startNode.name} to ${destinationNode.name}`,
  ];
  return { path, directions };
};