import type { CalculationInput, ShutteringResult, CategoryResult, MaterialItem } from '@/types/shuttering';
import { CATEGORY_DISTRIBUTION, MATERIAL_FACTORS, STANDARD_WOOD_BOARD } from '@/types/shuttering';

// Conversion utilities
const sqmToSqft = (sqm: number): number => sqm * 10.764;
const sqftToSqm = (sqft: number): number => sqft / 10.764;

// Round up to nearest whole number
const roundUp = (num: number): number => Math.ceil(num);

// Calculate wood boards needed based on area and coverage factor
const calculateWoodBoards = (area: number, factor: number): number => {
  const totalBoardArea = area * factor;
  const boardsNeeded = totalBoardArea / STANDARD_WOOD_BOARD.area;
  return roundUp(boardsNeeded);
};

// Calculate column wood boards (special case: 4" × 8" columns need 2 boards of 2.5" each)
const calculateColumnWoodBoards = (area: number): { boards: number; note: string } => {
  // For columns, we need boards for 4 sides
  // Standard column size: 12" × 12" or 4" × 8" (as mentioned by user)
  // For 4" × 8" column: need 2 boards of 2.5" for the 4" side (2.5" + 2.5" = 5" > 4")
  // And 2 boards for the 8" side
  
  const columnPerimeterFactor = 1.4; // Higher factor for 4-sided coverage
  const boards = calculateWoodBoards(area, columnPerimeterFactor);
  
  // Calculate how many columns we can form
  const columnFaceArea = 4 * 8 / 144; // 4" × 8" in sq ft
  const estimatedColumns = Math.max(1, Math.floor(area / columnFaceArea));
  
  // Each column needs 4 sides, each side needs boards
  // Short sides (4"): 2 boards of 2.5" each
  // Long sides (8"): 2 boards of 2.5" each (but 8' length matches)
  const boardsPerColumn = 8; // 4 sides × 2 boards each
  const totalColumnBoards = estimatedColumns * boardsPerColumn;
  
  return {
    boards: Math.max(boards, totalColumnBoards),
    note: `For ${estimatedColumns} estimated columns (4"×8"). Each column needs 8 boards (2 boards per side × 4 sides). 2.5" + 2.5" boards cover 4" width.`
  };
};

// Calculate slab materials
const calculateSlabMaterials = (area: number): MaterialItem[] => {
  const factors = MATERIAL_FACTORS.slab;
  
  const woodBoards = calculateWoodBoards(area, factors.woodBoardsPerSqft);
  const props = roundUp(area * factors.propsPerSqft);
  const beams = roundUp(area * factors.beamsPerSqft);
  const bamboo = roundUp(area * factors.bambooPerSqft);
  
  // Calculate steel sheets (optional, for steel shuttering cases)
  const steelSheets = roundUp(area / 32); // 4×8 = 32 sq ft per sheet
  
  return [
    {
      name: 'Wood Boards (2.5" × 8\')',
      quantity: woodBoards,
      unit: 'pcs',
      description: 'Standard shuttering boards for slab surface',
      size: '2.5" × 8\''
    },
    {
      name: 'Adjustable Props',
      quantity: props,
      unit: 'pcs',
      description: 'Steel props for slab support (8\' standard)',
      size: '8\' length'
    },
    {
      name: 'Steel Beams / Joists',
      quantity: beams,
      unit: 'pcs',
      description: 'Support beams under wood boards',
      size: '8\' length'
    },
    {
      name: 'Bamboo Poles',
      quantity: bamboo,
      unit: 'pcs',
      description: 'Secondary support and bracing',
      size: '12\' length, 3" diameter'
    },
    {
      name: 'Steel Shuttering Sheets (4\' × 8\')',
      quantity: steelSheets,
      unit: 'pcs',
      description: 'Alternative to wood for smooth finish',
      size: '4\' × 8\''
    },
    {
      name: 'Nails (4")',
      quantity: roundUp(woodBoards * 8),
      unit: 'pcs',
      description: 'For securing boards to beams'
    },
    {
      name: 'Binding Wire',
      quantity: roundUp(area * 0.05),
      unit: 'kg',
      description: 'For tying and securing'
    }
  ];
};

// Calculate beam materials
const calculateBeamMaterials = (area: number): MaterialItem[] => {
  const factors = MATERIAL_FACTORS.beam;
  
  const woodBoards = calculateWoodBoards(area, factors.woodBoardsPerSqft);
  const props = roundUp(area * factors.propsPerSqft);
  const beams = roundUp(area * factors.beamsPerSqft);
  const bamboo = roundUp(area * factors.bambooPerSqft);
  
  // Beam specific calculations
  // Typical beam: 9" × 12" cross-section
  const beamLength = Math.sqrt(area * 4); // Estimate total beam length
  const estimatedBeams = Math.max(1, Math.floor(beamLength / 8)); // 8' beams
  
  return [
    {
      name: 'Wood Boards (2.5" × 8\')',
      quantity: woodBoards,
      unit: 'pcs',
      description: 'For beam sides and bottom',
      size: '2.5" × 8\''
    },
    {
      name: 'Adjustable Props',
      quantity: props,
      unit: 'pcs',
      description: 'Vertical support for beams',
      size: '8\' length'
    },
    {
      name: 'Steel Beams / Joists',
      quantity: beams,
      unit: 'pcs',
      description: 'Horizontal support under beam',
      size: '8\' length'
    },
    {
      name: 'Bamboo Poles',
      quantity: bamboo,
      unit: 'pcs',
      description: 'Diagonal bracing for beam sides',
      size: '12\' length, 3" diameter'
    },
    {
      name: 'Beam Bottom Plates',
      quantity: estimatedBeams * 2,
      unit: 'pcs',
      description: 'Thick boards for beam bottom (if needed)',
      size: '1.5" × 9" × 8\''
    },
    {
      name: 'Nails (3")',
      quantity: roundUp(woodBoards * 6),
      unit: 'pcs',
      description: 'For beam formwork assembly'
    },
    {
      name: 'Nails (5")',
      quantity: roundUp(estimatedBeams * 4),
      unit: 'pcs',
      description: 'Heavy nails for beam bottom'
    }
  ];
};

// Calculate column materials
const calculateColumnMaterials = (area: number): MaterialItem[] => {
  const columnCalc = calculateColumnWoodBoards(area);
  const factors = MATERIAL_FACTORS.column;
  
  const props = roundUp(area * factors.propsPerSqft);
  const beams = roundUp(area * factors.beamsPerSqft);
  const bamboo = roundUp(area * factors.bambooPerSqft);
  
  // Column specific - calculate based on typical column sizes
  const columnFaceArea = 4 * 8 / 144; // 4" × 8" in sq ft
  const estimatedColumns = Math.max(1, Math.floor(area / columnFaceArea));
  
  return [
    {
      name: 'Wood Boards (2.5" × 8\')',
      quantity: columnCalc.boards,
      unit: 'pcs',
      description: 'For column shuttering (4 sides)',
      size: '2.5" × 8\''
    },
    {
      name: 'Column Clamps / Yokes',
      quantity: estimatedColumns * 4,
      unit: 'pcs',
      description: 'Metal clamps to hold column boards',
      size: 'Adjustable'
    },
    {
      name: 'Adjustable Props',
      quantity: props,
      unit: 'pcs',
      description: 'Plumb support for columns',
      size: '8\' length'
    },
    {
      name: 'Steel Beams / Joists',
      quantity: beams,
      unit: 'pcs',
      description: 'For column alignment',
      size: '8\' length'
    },
    {
      name: 'Bamboo Poles',
      quantity: bamboo,
      unit: 'pcs',
      description: 'Diagonal bracing for columns',
      size: '12\' length, 3" diameter'
    },
    {
      name: 'Corner Angles (Steel)',
      quantity: estimatedColumns * 4,
      unit: 'pcs',
      description: 'For perfect column corners',
      size: '8\' length'
    },
    {
      name: 'Nails (4")',
      quantity: roundUp(columnCalc.boards * 4),
      unit: 'pcs',
      description: 'For column formwork'
    },
    {
      name: 'Release Agent / Oil',
      quantity: roundUp(area * 0.02),
      unit: 'liters',
      description: 'For easy form removal'
    }
  ];
};

// Calculate wall materials
const calculateWallMaterials = (area: number): MaterialItem[] => {
  const factors = MATERIAL_FACTORS.wall;
  
  const woodBoards = calculateWoodBoards(area, factors.woodBoardsPerSqft);
  const props = roundUp(area * factors.propsPerSqft);
  const beams = roundUp(area * factors.beamsPerSqft);
  const bamboo = roundUp(area * factors.bambooPerSqft);
  
  // Wall specific
  const wallHeight = 10; // typical wall height in feet
  const wallLength = area / wallHeight;
  const panelsNeeded = roundUp(wallLength / 8); // 8' panels
  
  return [
    {
      name: 'Wood Boards (2.5" × 8\')',
      quantity: woodBoards,
      unit: 'pcs',
      description: 'For wall surface',
      size: '2.5" × 8\''
    },
    {
      name: 'Wall Panels (Steel)',
      quantity: panelsNeeded,
      unit: 'pcs',
      description: 'Steel panels for wall (optional)',
      size: '2\' × 8\' or 3\' × 8\''
    },
    {
      name: 'Adjustable Props',
      quantity: props,
      unit: 'pcs',
      description: 'Wall alignment supports',
      size: '8\' length'
    },
    {
      name: 'Steel Beams / Joists',
      quantity: beams,
      unit: 'pcs',
      description: 'Horizontal walers',
      size: '8\' length'
    },
    {
      name: 'Bamboo Poles',
      quantity: bamboo,
      unit: 'pcs',
      description: 'Wall bracing',
      size: '12\' length, 3" diameter'
    },
    {
      name: 'Tie Rods',
      quantity: roundUp(panelsNeeded * 2),
      unit: 'pcs',
      description: 'To hold wall forms together',
      size: 'With cones'
    },
    {
      name: 'Nails (3")',
      quantity: roundUp(woodBoards * 5),
      unit: 'pcs',
      description: 'For wall formwork'
    }
  ];
};

// Main calculation function
export const calculateShuttering = (input: CalculationInput): ShutteringResult => {
  // Convert to sq ft for calculations
  const totalAreaSqft = input.unit === 'sqm' ? sqmToSqft(input.totalArea) : input.totalArea;
  
  // Calculate area for each category
  const slabArea = totalAreaSqft * CATEGORY_DISTRIBUTION.slab;
  const beamArea = totalAreaSqft * CATEGORY_DISTRIBUTION.beam;
  const columnArea = totalAreaSqft * CATEGORY_DISTRIBUTION.column;
  const wallArea = totalAreaSqft * CATEGORY_DISTRIBUTION.wall;
  
  // Calculate materials for each category
  const slabMaterials = calculateSlabMaterials(slabArea);
  const beamMaterials = calculateBeamMaterials(beamArea);
  const columnMaterials = calculateColumnMaterials(columnArea);
  const wallMaterials = calculateWallMaterials(wallArea);
  
  // Create category results
  const categories: CategoryResult[] = [
    {
      category: 'Slab Shuttering',
      materials: slabMaterials,
      totalArea: Math.round(slabArea),
      notes: 'Horizontal formwork for floor/roof slabs. Includes main support system.'
    },
    {
      category: 'Beam Shuttering',
      materials: beamMaterials,
      totalArea: Math.round(beamArea),
      notes: 'Formwork for RCC beams. Includes sides, bottom, and support system.'
    },
    {
      category: 'Column Shuttering',
      materials: columnMaterials,
      totalArea: Math.round(columnArea),
      notes: 'Vertical formwork for columns. 4-sided coverage with special board arrangement (2.5" + 2.5" boards for 4" faces).'
    },
    {
      category: 'Wall Shuttering',
      materials: wallMaterials,
      totalArea: Math.round(wallArea),
      notes: 'Vertical formwork for walls. Includes tie rods and alignment system.'
    }
  ];
  
  // Calculate summary totals
  const totalWoodBoards = categories.reduce((sum, cat) => {
    const boards = cat.materials.find(m => m.name.includes('Wood Boards'));
    return sum + (boards?.quantity || 0);
  }, 0);
  
  const totalBamboo = categories.reduce((sum, cat) => {
    const bamboo = cat.materials.find(m => m.name.includes('Bamboo'));
    return sum + (bamboo?.quantity || 0);
  }, 0);
  
  const totalSteelSheets = categories.reduce((sum, cat) => {
    const sheets = cat.materials.find(m => m.name.includes('Steel Shuttering') || m.name.includes('Steel Sheet'));
    return sum + (sheets?.quantity || 0);
  }, 0);
  
  const totalProps = categories.reduce((sum, cat) => {
    const props = cat.materials.find(m => m.name.includes('Props'));
    return sum + (props?.quantity || 0);
  }, 0);
  
  const totalBeams = categories.reduce((sum, cat) => {
    const beams = cat.materials.find(m => m.name.includes('Steel Beams') || m.name.includes('Joists'));
    return sum + (beams?.quantity || 0);
  }, 0);
  
  return {
    totalArea: Math.round(totalAreaSqft),
    categories,
    summary: {
      totalWoodBoards,
      totalBamboo,
      totalSteelSheets,
      totalProps,
      totalBeams
    }
  };
};

// Export utility functions
export { sqmToSqft, sqftToSqm, roundUp };
