// Shuttering Calculator Types

export interface MaterialItem {
  name: string;
  quantity: number;
  unit: string;
  description?: string;
  size?: string;
}

export interface CategoryResult {
  category: string;
  materials: MaterialItem[];
  totalArea: number;
  notes?: string;
}

export interface ShutteringResult {
  totalArea: number;
  categories: CategoryResult[];
  summary: {
    totalWoodBoards: number;
    totalBamboo: number;
    totalSteelSheets: number;
    totalProps: number;
    totalBeams: number;
  };
}

export interface CalculationInput {
  totalArea: number;
  unit: 'sqft' | 'sqm';
  slabHeight?: number;
  beamHeight?: number;
  columnHeight?: number;
  slabThickness?: number;
  useSteelShuttering?: boolean;
}

// Standard material specifications
export const STANDARD_WOOD_BOARD = {
  width: 2.5, // inches
  length: 8, // feet
  area: 2.5 * 8 / 12, // sq ft per board (2.5" = 2.5/12 ft)
};

export const MATERIAL_SPECIFICATIONS = {
  woodBoard: {
    standardWidth: 2.5, // inches
    standardLength: 8, // feet
    standardArea: 1.67, // sq ft (2.5" × 8')
  },
  bamboo: {
    length: 12, // feet
    diameter: 3, // inches
  },
  steelSheet: {
    standardSize: '4×8', // feet
    standardArea: 32, // sq ft
  },
  prop: {
    length: 8, // feet standard
    capacity: '2-3 tons',
  },
  beam: {
    standardLength: 8, // feet
  },
};

// Category distribution percentages (typical construction ratios)
export const CATEGORY_DISTRIBUTION = {
  slab: 0.50, // 50% of total area
  beam: 0.25, // 25% of total area
  column: 0.15, // 15% of total area
  wall: 0.10, // 10% of total area
};

// Material factors per sq ft
export const MATERIAL_FACTORS = {
  slab: {
    woodBoardsPerSqft: 0.65, // boards needed per sq ft
    propsPerSqft: 0.08, // props per sq ft
    beamsPerSqft: 0.15, // beams per sq ft
    bambooPerSqft: 0.12, // bamboo poles per sq ft
  },
  beam: {
    woodBoardsPerSqft: 0.85,
    propsPerSqft: 0.15,
    beamsPerSqft: 0.25,
    bambooPerSqft: 0.08,
  },
  column: {
    woodBoardsPerSqft: 1.2, // More boards for columns (4 sides)
    propsPerSqft: 0.05,
    beamsPerSqft: 0.10,
    bambooPerSqft: 0.06,
  },
  wall: {
    woodBoardsPerSqft: 0.75,
    propsPerSqft: 0.06,
    beamsPerSqft: 0.12,
    bambooPerSqft: 0.10,
  },
};
