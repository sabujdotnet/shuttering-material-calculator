import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calculator, Info, Ruler, Settings2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { CalculationInput } from '@/types/shuttering';

interface InputFormProps {
  onCalculate: (input: CalculationInput) => void;
  isCalculating?: boolean;
}

export function InputForm({ onCalculate, isCalculating }: InputFormProps) {
  const [totalArea, setTotalArea] = useState<string>('1000');
  const [unit, setUnit] = useState<'sqft' | 'sqm'>('sqft');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [slabHeight, setSlabHeight] = useState<string>('10');
  const [beamHeight, setBeamHeight] = useState<string>('12');
  const [columnHeight, setColumnHeight] = useState<string>('10');
  const [slabThickness, setSlabThickness] = useState<string>('6');
  const [useSteelShuttering, setUseSteelShuttering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const area = parseFloat(totalArea);
    if (area > 0) {
      onCalculate({
        totalArea: area,
        unit,
        slabHeight: showAdvanced ? parseFloat(slabHeight) : undefined,
        beamHeight: showAdvanced ? parseFloat(beamHeight) : undefined,
        columnHeight: showAdvanced ? parseFloat(columnHeight) : undefined,
        slabThickness: showAdvanced ? parseFloat(slabThickness) : undefined,
        useSteelShuttering: showAdvanced ? useSteelShuttering : false,
      });
    }
  };

  return (
    <Card className="w-full shadow-lg border-2 border-amber-100">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Calculator className="h-6 w-6" />
          Shuttering Calculator
        </CardTitle>
        <CardDescription className="text-amber-50">
          Enter project area to calculate all formwork material quantities
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="area" className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                <Ruler className="h-5 w-5 text-amber-600" />
                Total Construction Area
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-5 w-5 text-slate-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Enter the total built-up area of your construction project. This will be distributed across slabs, beams, columns, and walls.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  id="area"
                  type="number"
                  min="1"
                  step="0.1"
                  value={totalArea}
                  onChange={(e) => setTotalArea(e.target.value)}
                  className="text-lg h-12 border-2 border-slate-200 focus:border-amber-500"
                  placeholder="Enter area..."
                />
              </div>
              <RadioGroup
                value={unit}
                onValueChange={(v) => setUnit(v as 'sqft' | 'sqm')}
                className="flex gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sqft" id="sqft" className="border-2" />
                  <Label htmlFor="sqft" className="cursor-pointer font-medium">sq ft</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sqm" id="sqm" className="border-2" />
                  <Label htmlFor="sqm" className="cursor-pointer font-medium">sq m</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <div className="border-t pt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-amber-700 hover:text-amber-800 font-medium transition-colors"
            >
              <Settings2 className="h-5 w-5" />
              {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
            </button>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-700">Advanced Parameters</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slabHeight" className="text-sm text-slate-600">Slab Height (ft)</Label>
                  <Input
                    id="slabHeight"
                    type="number"
                    min="1"
                    value={slabHeight}
                    onChange={(e) => setSlabHeight(e.target.value)}
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="beamHeight" className="text-sm text-slate-600">Beam Height (in)</Label>
                  <Input
                    id="beamHeight"
                    type="number"
                    min="1"
                    value={beamHeight}
                    onChange={(e) => setBeamHeight(e.target.value)}
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="columnHeight" className="text-sm text-slate-600">Column Height (ft)</Label>
                  <Input
                    id="columnHeight"
                    type="number"
                    min="1"
                    value={columnHeight}
                    onChange={(e) => setColumnHeight(e.target.value)}
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slabThickness" className="text-sm text-slate-600">Slab Thickness (in)</Label>
                  <Input
                    id="slabThickness"
                    type="number"
                    min="1"
                    value={slabThickness}
                    onChange={(e) => setSlabThickness(e.target.value)}
                    className="border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="steelShuttering"
                  checked={useSteelShuttering}
                  onChange={(e) => setUseSteelShuttering(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <Label htmlFor="steelShuttering" className="text-sm text-slate-600 cursor-pointer">
                  Prefer Steel Shuttering over Wood (where applicable)
                </Label>
              </div>
            </div>
          )}

          {/* Calculate Button */}
          <Button
            type="submit"
            disabled={isCalculating}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg transition-all hover:shadow-xl"
          >
            <Calculator className="h-5 w-5 mr-2" />
            {isCalculating ? 'Calculating...' : 'Calculate Materials'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
