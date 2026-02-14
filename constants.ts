
import { CityPhase } from './types';

export const CITY_PHASES: CityPhase[] = [
  {
    name: "Foundation & Site Prep",
    startDay: 1,
    endDay: 60,
    description: "Geotechnical investigation, surveying the terrain, and laying the groundwork.",
    subjects: ["Surveying", "Soil Mechanics", "Building Materials (Stones, Bricks)"]
  },
  {
    name: "Basic Infrastructure",
    startDay: 61,
    endDay: 120,
    description: "Developing drainage, water supply networks, and primary access roads.",
    subjects: ["Environmental Engineering", "Fluid Mechanics", "Transportation Engineering (Geometric Design)"]
  },
  {
    name: "Structural Superstructure",
    startDay: 121,
    endDay: 210,
    description: "Rising skylines, residential blocks, and industrial frameworks.",
    subjects: ["RCC Design", "Steel Design", "Theory of Structures", "Concrete Technology"]
  },
  {
    name: "Connectivity & Hydraulics",
    startDay: 211,
    endDay: 300,
    description: "Bridges, complex interchanges, and dam-fed irrigation for the city outskirts.",
    subjects: ["Irrigation Engineering", "Bridge Engineering", "Highway Materials", "Railway Engineering"]
  },
  {
    name: "Management & Valuation",
    startDay: 301,
    endDay: 360,
    description: "Project finishing, cost estimation, and municipal maintenance planning.",
    subjects: ["Estimating, Costing and Valuation", "Construction Management"]
  }
];

export const SUBJECT_TOPICS: Record<string, string[]> = {
  "Surveying": ["Principles of Surveying", "Compass Surveying", "Theodolite", "Levelling", "Contouring", "Tacheometry", "Curves", "GPS/GIS"],
  "Soil Mechanics": ["Origin of Soils", "Phase Diagram", "Index Properties", "Classification", "Permeability", "Seepage", "Effective Stress", "Consolidation", "Shear Strength", "Earth Pressure", "Shallow Foundations", "Deep Foundations"],
  "Building Materials": ["Physical & Chemical properties of Stones", "Bricks", "Cement", "Asbestos products", "Timber", "Glass", "Varnishes", "Plastics"],
  "RCC Design": ["Working Stress Method", "Limit State Method", "Beams", "Slabs", "Columns", "Footings", "Retaining Walls"],
  "Environmental Engineering": ["Water Quality", "Purification", "Distribution", "Sewerage Systems", "Sewage Treatment", "Air Pollution"],
  "Hydraulics": ["Fluid Properties", "Hydrostatic Pressure", "Buoyancy", "Fluid Kinematics", "Orifices", "Open Channel Flow", "Pumps", "Turbines"],
  "Estimating, Costing and Valuation": ["Methods of Estimation", "Analysis of Rates", "Valuation Concepts", "Contracts", "Tenders"]
};
