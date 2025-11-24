import { SheetGrid, Tab, AppData } from '../types';
import { SHEET_ID, SHEET_TAB_IDS } from '../constants';

// Parser robusto para CSV que lida com aspas e vírgulas dentro de células
const parseCSVToGrid = (csvText: string): SheetGrid => {
  const rows: SheetGrid = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  // Normaliza quebras de linha
  const sanitizedText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < sanitizedText.length; i++) {
    const char = sanitizedText[i];
    const nextChar = sanitizedText[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        // Aspas duplas escapadas ("") dentro de aspas
        currentCell += '"';
        i++;
      } else if (char === '"') {
        // Fim da célula aspeada
        inQuotes = false;
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        // Fim da célula
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\n') {
        // Fim da linha
        currentRow.push(currentCell.trim());
        if (currentRow.some(cell => cell !== '')) { // Ignora linhas 100% vazias
            rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
  }
  
  // Adiciona a última linha se existir
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(cell => cell !== '')) {
        rows.push(currentRow);
    }
  }

  return rows;
};

// Gera dados vazios/exemplo caso falhe
const generateMockGrid = (title: string): SheetGrid => {
  return [
    [title, 'Jan', 'Fev', 'Mar', 'Total'],
    ['Origem A', '10', '20', '30', '60'],
    ['Origem B', '5', '15', '25', '45'],
    ['Total', '15', '35', '55', '105']
  ];
};

export const fetchAllSheetData = async (): Promise<AppData> => {
  const baseUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=`;

  const fetchDataForTab = async (gid: string, tabName: string): Promise<SheetGrid> => {
    try {
      const response = await fetch(baseUrl + gid);
      if (!response.ok) throw new Error('Network error');
      const text = await response.text();
      return parseCSVToGrid(text);
    } catch (error) {
      console.warn(`Erro ao carregar aba ${tabName}:`, error);
      return generateMockGrid(tabName);
    }
  };

  try {
    const [marketing, newBusiness, won, lost] = await Promise.all([
      fetchDataForTab(SHEET_TAB_IDS.MARKETING, 'Marketing'),
      fetchDataForTab(SHEET_TAB_IDS.NEW_BUSINESS, 'Novos Negócios'),
      fetchDataForTab(SHEET_TAB_IDS.WON, 'Ganhos'),
      fetchDataForTab(SHEET_TAB_IDS.LOST, 'Perdidos'),
    ]);

    return {
      [Tab.MARKETING]: marketing,
      [Tab.NEW_BUSINESS]: newBusiness,
      [Tab.WON]: won,
      [Tab.LOST]: lost,
    };
  } catch (e) {
    console.error("Erro geral carregando dados", e);
    return {};
  }
};
