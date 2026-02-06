import { useState } from 'react';
import { InputForm } from '@/components/InputForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import type { CalculationInput, ShutteringResult } from '@/types/shuttering';
import { calculateShuttering } from '@/lib/calculator';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { 
  HardHat, 
  Calculator, 
  Building2, 
  Ruler, 
  CheckCircle2,
  ArrowRight,
  Info
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

function App() {
  const [result, setResult] = useState<ShutteringResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = (input: CalculationInput) => {
    setIsCalculating(true);
    
    // Simulate calculation delay for UX
    setTimeout(() => {
      try {
        const calculationResult = calculateShuttering(input);
        setResult(calculationResult);
        toast.success('Calculation completed successfully!', {
          description: `Total area: ${calculationResult.totalArea.toLocaleString()} sq ft`,
        });
      } catch (error) {
        toast.error('Calculation failed', {
          description: 'Please check your input and try again.',
        });
      } finally {
        setIsCalculating(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl shadow-lg">
                <HardHat className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Shuttering Calculator <span className="text-amber-600">Pro</span>
                </h1>
                <p className="text-sm text-slate-500">Enterprise-grade formwork material estimator</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Badge variant="outline" className="gap-1 px-3 py-1">
                <Building2 className="h-4 w-4" />
                Construction
              </Badge>
              <Badge variant="outline" className="gap-1 px-3 py-1">
                <Ruler className="h-4 w-4" />
                Formwork
              </Badge>
              <Badge variant="outline" className="gap-1 px-3 py-1">
                <Calculator className="h-4 w-4" />
                Calculator
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - Input Form */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <InputForm onCalculate={handleCalculate} isCalculating={isCalculating} />
              
              {/* Quick Info Card */}
              <div className="mt-6 bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2 mb-3">
                  <Info className="h-5 w-5 text-amber-600" />
                  Material Standards
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-slate-700">Wood Board:</span>
                      <span className="text-slate-600"> 2.5" × 8' (standard)</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-slate-700">Bamboo:</span>
                      <span className="text-slate-600"> 12' × 3" diameter</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-slate-700">Steel Sheet:</span>
                      <span className="text-slate-600"> 4' × 8' (32 sq ft)</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-slate-700">Props:</span>
                      <span className="text-slate-600"> 8' adjustable steel</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-8">
            {result ? (
              <ResultsDisplay result={result} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center min-h-[500px] bg-white/50 rounded-xl border-2 border-dashed border-slate-300">
                <div className="bg-amber-100 p-6 rounded-full mb-6">
                  <Calculator className="h-16 w-16 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-700 mb-2">
                  Ready to Calculate
                </h2>
                <p className="text-slate-500 text-center max-w-md mb-6">
                  Enter your construction area on the left to get detailed material quantities 
                  for slabs, beams, columns, and walls.
                </p>
                <div className="flex items-center gap-2 text-amber-600 font-medium">
                  <span>Enter area and click Calculate</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
                
                {/* Feature Preview */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-slate-200">
                    <div className="text-2xl font-bold text-amber-600">4</div>
                    <div className="text-xs text-slate-500">Categories</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-slate-200">
                    <div className="text-2xl font-bold text-blue-600">25+</div>
                    <div className="text-xs text-slate-500">Material Types</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-slate-200">
                    <div className="text-2xl font-bold text-emerald-600">100%</div>
                    <div className="text-xs text-slate-500">Accurate</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-slate-200">
                    <div className="text-2xl font-bold text-purple-600">Free</div>
                    <div className="text-xs text-slate-500">To Use</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              Shuttering Calculator Pro - Professional formwork estimation tool
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>Wood: 2.5" × 8'</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Bamboo: 12' × 3"</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Steel: 4' × 8'</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
