
import { GoogleGenAI } from "@google/genai";
import { DashboardMetrics } from "../types";

// In a real scenario, this would be env variable. 
// Using placeholder for strict instruction compliance regarding process.env.API_KEY usage
// The App will require the user to input one if env is missing, or we handle gracefully.
// However, per instructions, we must assume process.env.API_KEY is available or handle it.
// Since this is a client-side demo without a bundler to inject env, I will add a check.

export const generateDashboardInsights = async (metrics: DashboardMetrics): Promise<string> => {
  const apiKey = process.env.API_KEY; 
  if (!apiKey) {
    return "API Key not configured. Unable to generate AI insights.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Summarize data for the prompt to save tokens
    const summaryData = {
      totalRev: metrics.totalRevenue,
      winRate: (metrics.winRate * 100).toFixed(1) + '%',
      activePipe: metrics.activePipelineValue,
      topSources: Object.entries(metrics.dealsBySource)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([k,v]) => `${k} (${v})`)
        .join(', ')
    };

    const prompt = `
      Atue como um Diretor de Vendas Sênior analisando este dashboard.
      Dados:
      - Receita Total (Ganhos): ${summaryData.totalRev}
      - Taxa de Conversão: ${summaryData.winRate}
      - Pipeline Ativo: ${summaryData.activePipe}
      - Top Fontes de Marketing: ${summaryData.topSources}
      
      Forneça 3 insights estratégicos curtos (máximo 1 frase cada) em Português do Brasil.
      Foque em: Onde estamos ganhando, onde há risco e uma recomendação de ação.
      Não use markdown, apenas texto plano separado por quebras de linha.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar insights no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao conectar com a IA para insights.";
  }
};