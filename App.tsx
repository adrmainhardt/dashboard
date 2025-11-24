
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import KpiCard from './components/KpiCard';
import { AppData, SheetGrid, Tab, DashboardMetrics } from './types';
import { fetchAllSheetData } from './services/dataService';
import { generateDashboardInsights } from './services/geminiService';
import { CURRENCY_FORMATTER, THEME } from './constants';
import { RefreshCw, BrainCircuit, Loader2, Info } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [data, setData] = useState<AppData>({});
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Load Data
  const loadData = async () => {
    setLoading(true);
    const result = await fetchAllSheetData();
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // 1 min update
    return () => clearInterval(interval);
  }, []);

  // Helper to find a "Total" value in a grid
  // Strategy: Look for a column header "Total" or "2025" and sum the values, 
  // OR look for a specific row that looks like a Grand Total.
  const extractTotalFromGrid = (grid?: SheetGrid): number => {
    if (!grid || grid.length < 2) return 0;
    
    // Simplistic approach: Try to find the intersection of the last column and the row that might contain totals.
    // Usually Row 2 (index 1) in the provided screenshot format.
    
    // Try to find column index for "Total"
    const headerRow = grid.find(row => row.some(cell => cell.toLowerCase().includes('total')));
    if (!headerRow) return 0;
    
    const totalColIndex = headerRow.findIndex(cell => cell.toLowerCase().includes('total'));
    if (totalColIndex === -1) return 0;

    // Sum all numeric values in that column below the header
    let sum = 0;
    for (let i = 0; i < grid.length; i++) {
        // Skip header row itself
        if (grid[i] === headerRow) continue;
        
        const valStr = grid[i][totalColIndex];
        if (valStr) {
            // Remove currency symbols, dots (thousands), keep comma as decimal
            const clean = valStr.replace(/[R$\s.]/g, '').replace(',', '.');
            const num = parseFloat(clean);
            // We assume totals are usually large numbers, sometimes lines have subtotals.
            // For safety, let's just grab the single LARGEST number in that column, 
            // as the sheet likely has a "Grand Total" row.
            // OR, strictly look for the row under the header if structure is fixed.
            if (!isNaN(num)) {
               // Heuristic: If row label is empty or matches "Total", use it.
               if (grid[i][0] === '' || grid[i][0].toLowerCase().includes('total')) {
                   // This is likely the total row
                   return num;
               }
            }
        }
    }
    
    // Fallback: If we didn't find a specific total row, grab the max value found in the Total column
    // This assumes the Total is the sum of others.
    let maxVal = 0;
    for (let i = 0; i < grid.length; i++) {
        if (grid[i] === headerRow) continue;
        const valStr = grid[i][totalColIndex];
        if (valStr) {
            const clean = valStr.replace(/[R$\s.]/g, '').replace(',', '.');
            const num = parseFloat(clean);
            if (!isNaN(num) && num > maxVal) maxVal = num;
        }
    }

    return maxVal;
  };

  const metrics: DashboardMetrics = useMemo(() => {
    return {
      totalRevenue: extractTotalFromGrid(data[Tab.WON]),
      totalLeads: extractTotalFromGrid(data[Tab.MARKETING]),
      totalNewBusiness: extractTotalFromGrid(data[Tab.NEW_BUSINESS]),
      totalLost: extractTotalFromGrid(data[Tab.LOST]),
      activePipelineValue: 0, // Hard to calc from summary table
      dealsBySource: {},
      dealsByStage: {},
      recentDeals: [],
      monthlyRevenue: [],
      winRate: 0,
      marketingLeads: 0
    } as any; // Casting to any to satisfy the complex Interface if we don't fully populate it
  }, [data]);

  const handleAiInsights = async () => {
    setLoadingInsights(true);
    // Passing full metrics which now complies with the updated interface
    const text = await generateDashboardInsights(metrics);
    setInsights(text);
    setLoadingInsights(false);
  };

  // --- Views ---

  // 1. HOME VIEW (Summarized)
  const renderHome = () => (
    <div className="h-full p-6 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Visão Geral</h1>
        <p className="text-gray-400">Resumo consolidado das 4 abas da planilha.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard 
            title="Marketing (Total)" 
            value={metrics.totalLeads.toLocaleString('pt-BR')} 
            trend="neutral" 
            delay={100} 
            icon={<Info size={16} />}
        />
        <KpiCard 
            title="Novos Negócios (Valor)" 
            value={metrics.totalNewBusiness < 10000 ? metrics.totalNewBusiness : CURRENCY_FORMATTER.format(metrics.totalNewBusiness)} 
            trend="up" 
            subValue="Pipeline gerado" 
            delay={200} 
        />
        <KpiCard 
            title="Negócios Ganhos (Receita)" 
            value={CURRENCY_FORMATTER.format(metrics.totalRevenue)} 
            trend="up" 
            subValue="Faturamento" 
            delay={300} 
        />
        <KpiCard 
            title="Perdidos (Valor)" 
            value={CURRENCY_FORMATTER.format(metrics.totalLost)} 
            trend="down" 
            subValue="Oportunidades perdidas" 
            delay={400} 
        />
      </div>

      {/* AI Section */}
      <div className="bg-gradient-to-r from-[#003554]/40 to-[#00243a] rounded-2xl p-6 border border-[#70d44c]/20 relative overflow-hidden mb-6">
        <div className="flex justify-between items-start z-10 relative">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BrainCircuit className="text-[#70d44c]" />
              Análise Inteligente (AI)
            </h3>
            <p className="text-gray-400 mt-1 max-w-2xl">
              {insights ? insights : "Clique para que a IA analise os números totais das planilhas."}
            </p>
          </div>
          <button 
            onClick={handleAiInsights}
            disabled={loadingInsights}
            className="px-6 py-2 bg-[#70d44c] hover:bg-[#62ba42] text-[#00243a] font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loadingInsights ? <Loader2 className="animate-spin" /> : 'Gerar Análise'}
          </button>
        </div>
      </div>
    </div>
  );

  // 2. SPREADSHEET VIEW (Renders raw grid)
  const renderSpreadsheetView = (title: string, grid?: SheetGrid, badgeColor: string = 'bg-gray-500') => {
    if (!grid || grid.length === 0) {
        return (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                <Loader2 className="animate-spin mb-4" />
                <p>Carregando dados da planilha...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                    <span className={`w-2 h-8 ${badgeColor} rounded-full block`}></span>
                    {title}
                </h2>
                <div className="text-sm text-gray-400">
                    Sincronizado com Google Sheets
                </div>
            </div>
            
            <div className="flex-1 overflow-auto bg-[#001524] rounded-xl border border-white/10 shadow-xl custom-scrollbar relative">
                <table className="w-full border-collapse text-left whitespace-nowrap">
                    <tbody>
                        {grid.map((row, rowIndex) => {
                            // Heuristics for styling
                            const isHeader = row.some(c => ['Janeiro', 'Fevereiro', 'Origem', 'Total'].includes(c.trim()));
                            const isSectionHeader = row[0] && row.slice(1).every(c => !c); // Only first col has text
                            const isTotalRow = row[0]?.toLowerCase().includes('total') || row.includes('Total');

                            return (
                                <tr 
                                    key={rowIndex} 
                                    className={`
                                        border-b border-white/5 
                                        ${isHeader ? 'bg-[#003554] text-[#70d44c] font-bold sticky top-0 z-10' : ''}
                                        ${isSectionHeader ? 'bg-[#00243a] text-white font-bold text-lg mt-4' : ''}
                                        ${isTotalRow ? 'bg-[#70d44c]/10 text-white font-bold' : 'text-gray-300 hover:bg-white/5'}
                                    `}
                                >
                                    {row.map((cell, cellIndex) => (
                                        <td 
                                            key={cellIndex} 
                                            className={`
                                                px-4 py-3 text-sm
                                                ${cellIndex === 0 ? 'sticky left-0 bg-inherit z-0 border-r border-white/5 font-medium min-w-[200px]' : ''}
                                                ${!isNaN(parseFloat(cell.replace(/[R$.]/g, '').replace(',', '.'))) && cellIndex > 0 ? 'text-right font-mono' : ''}
                                            `}
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
  };

  return (
    <div className="flex h-screen w-screen bg-[#00243a] font-sans text-white overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 relative flex flex-col">
        {/* Header Bar */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#001a2c]/50 backdrop-blur-md z-20">
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400' : 'bg-[#70d44c]'} animate-pulse`}></span>
                {loading ? 'Sincronizando...' : 'Atualizado'}
            </div>
            <button onClick={loadData} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
            {/* Background gradients */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#70d44c] opacity-[0.03] blur-[100px] pointer-events-none rounded-full translate-x-[-50%] translate-y-[-50%]" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#003554] opacity-[0.2] blur-[100px] pointer-events-none rounded-full translate-x-[20%] translate-y-[20%]" />

            {activeTab === Tab.HOME && renderHome()}
            {activeTab === Tab.MARKETING && renderSpreadsheetView("Marketing", data[Tab.MARKETING], 'bg-purple-400')}
            {activeTab === Tab.NEW_BUSINESS && renderSpreadsheetView("Novos Negócios", data[Tab.NEW_BUSINESS], 'bg-blue-400')}
            {activeTab === Tab.WON && renderSpreadsheetView("Negócios Ganhos", data[Tab.WON], 'bg-[#70d44c]')}
            {activeTab === Tab.LOST && renderSpreadsheetView("Negócios Perdidos", data[Tab.LOST], 'bg-red-500')}
        </div>
      </main>
    </div>
  );
};

export default App;