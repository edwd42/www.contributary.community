import topology from './topologies.json';

// static?
export class TopologyService {
  constructor() {
    this.topology = topology;
  }

  getTopologies() {
    return new Promise((resolve) => {
      resolve(this.topologies);
    });
  }

  getTopologyKeys() {
    return new Promise((resolve) => {
      const keys = Object.keys(this.topology.language);

      resolve(keys);
    });
  }

  getFullTopologyByKey(key) {
    return new Promise((resolve) => {
      resolve(this.topology.language[key]);
    });
  }

}