import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Layers, 
  Box, 
  Columns, 
  BrickWall, 
  Package, 
  Ruler, 
  Info,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  TreePine,
  Construction,
  Sheet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ShutteringResult, CategoryResult } from '@/types/shuttering';

interface ResultsDisplayProps {
  result: ShutteringResult;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Slab Shuttering': <Layers className="h-5 w-5" />,
  'Beam Shuttering': <Box className="h-5 w-5" />,
  'Column Shuttering': <Columns className="h-5 w-5" />,
  'Wall Shuttering': <BrickWall className="h-5 w-5" />,
};

const categoryColors: Record<string, string> = {
  'Slab Shuttering': 'bg-blue-500',
  'Beam Shuttering': 'bg-amber-500',
  'Column Shuttering': 'bg-emerald-500',
  'Wall Shuttering': 'bg-purple-500',
};

function CategoryCard({ category }: { category: CategoryResult }) {
  const [expanded, setExpanded] = useState(true);
  
  const woodBoards = category.materials.find(m => m.name.includes('Wood Boards'));
  const props = category.materials.find(m => m.name.includes('Props'));
  const beams = category.materials.find(m => m.name.includes('Steel Beams') || m.name.includes('Joists'));
  
  return (
    <Card className="overflow-hidden border-2 border-slate-100 hover:border-amber-200 transition-all">
      <CardHeader 
        className={`${categoryColors[category.category]} text-white cursor-pointer`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {categoryIcons[category.category]}
            <CardTitle className="text-lg">{category.category}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {category.totalArea.toLocaleString()} sq ft
            </Badge>
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>
        {category.notes && (
          <CardDescription className="text-white/80 text-sm mt-1">
            {category.notes}
          </CardDescription>
        )}
      </CardHeader>
      
      {expanded && (
        <CardContent className="p-0">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 border-b">
            {woodBoards && (
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-700">{woodBoards.quantity}</div>
                <div className="text-xs text-slate-500">Wood Boards</div>
              </div>
            )}
            {props && (
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">{props.quantity}</div>
                <div className="text-xs text-slate-500">Props</div>
              </div>
            )}
            {beams && (
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-700">{beams.quantity}</div>
                <div className="text-xs text-slate-500">Beams</div>
              </div>
            )}
          </div>
          
          {/* Detailed Table */}
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100">
                <TableHead className="font-semibold">Material</TableHead>
                <TableHead className="font-semibold">Size/Spec</TableHead>
                <TableHead className="font-semibold text-right">Quantity</TableHead>
                <TableHead className="font-semibold">Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {category.materials.map((material, idx) => (
                <TableRow key={idx} className="hover:bg-amber-50/50">
                  <TableCell>
                    <div className="font-medium text-slate-800">{material.name}</div>
                    {material.description && (
                      <div className="text-xs text-slate-500 mt-0.5">{material.description}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {material.size || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-lg font-bold text-amber-700">
                      {material.quantity.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600">{material.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
}

function SummaryCard({ result }: { result: ShutteringResult }) {
  return (
    <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
          <Package className="h-6 w-6 text-amber-600" />
          Material Summary
        </CardTitle>
        <CardDescription>
          Total quantities across all categories for {result.totalArea.toLocaleString()} sq ft
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100 text-center">
            <TreePine className="h-8 w-8 mx-auto text-amber-600 mb-2" />
            <div className="text-2xl font-bold text-slate-800">{result.summary.totalWoodBoards.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Wood Boards</div>
            <div className="text-xs text-amber-600">2.5" × 8'</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 text-center">
            <Construction className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-slate-800">{result.summary.totalProps.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Steel Props</div>
            <div className="text-xs text-blue-600">8' length</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100 text-center">
            <Box className="h-8 w-8 mx-auto text-emerald-600 mb-2" />
            <div className="text-2xl font-bold text-slate-800">{result.summary.totalBeams.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Steel Beams</div>
            <div className="text-xs text-emerald-600">8' length</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 text-center">
            <Ruler className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-bold text-slate-800">{result.summary.totalBamboo.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Bamboo Poles</div>
            <div className="text-xs text-green-600">12' × 3"</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center">
            <Sheet className="h-8 w-8 mx-auto text-slate-600 mb-2" />
            <div className="text-2xl font-bold text-slate-800">{result.summary.totalSteelSheets.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Steel Sheets</div>
            <div className="text-xs text-slate-600">4' × 8'</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const data = {
      projectArea: result.totalArea,
      unit: 'sq ft',
      categories: result.categories,
      summary: result.summary,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shuttering-calculation-${result.totalArea}sqft.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-end gap-2 print:hidden">
        <Button variant="outline" onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Export JSON
        </Button>
        <Button variant="outline" onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </div>

      {/* Summary Card */}
      <SummaryCard result={result} />

      {/* Category Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="slab">Slab</TabsTrigger>
          <TabsTrigger value="beam">Beam</TabsTrigger>
          <TabsTrigger value="column">Column</TabsTrigger>
          <TabsTrigger value="wall">Wall</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4 mt-4">
          {result.categories.map((category, idx) => (
            <CategoryCard key={idx} category={category} />
          ))}
        </TabsContent>
        
        <TabsContent value="slab" className="mt-4">
          <CategoryCard category={result.categories.find(c => c.category === 'Slab Shuttering')!} />
        </TabsContent>
        
        <TabsContent value="beam" className="mt-4">
          <CategoryCard category={result.categories.find(c => c.category === 'Beam Shuttering')!} />
        </TabsContent>
        
        <TabsContent value="column" className="mt-4">
          <CategoryCard category={result.categories.find(c => c.category === 'Column Shuttering')!} />
        </TabsContent>
        
        <TabsContent value="wall" className="mt-4">
          <CategoryCard category={result.categories.find(c => c.category === 'Wall Shuttering')!} />
        </TabsContent>
      </Tabs>

      {/* Footer Info */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-600">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-slate-700 mb-1">Important Notes:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Wood board standard size: 2.5" × 8'. For 4" × 8" columns, 2 boards are used per side (2.5" + 2.5" = 5" coverage).</li>
              <li>Quantities include standard wastage factor of 10-15%.</li>
              <li>Actual requirements may vary based on site conditions and design specifications.</li>
              <li>Steel shuttering sheets are provided as an alternative where smooth finish is required.</li>
              <li>All props are assumed to be 8' adjustable steel props.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
