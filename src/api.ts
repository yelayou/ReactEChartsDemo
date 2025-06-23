// api.ts
export interface MonthlySummary {
  monthNumber: number;
  monthName: string;
  guaranteedAmount: number;
  guaranteedLeverage: number;
  contingentAmount: number;
  contingentLeverage: number;
  forecastAmount: number;
  totalForecastAmount: number;
  targetMaxPercent: number;
  targetMinPercent: number;
  targetMaxAmount: number;
  targetMinAmount: number;
  topUpMaxAmount: number;
}

export interface FxClientSummary {
  clientId: number;
  clientName: string;
  fxCurrency: string;
  settlementCurrency: string;
  fxDirection: string;
  summary: MonthlySummary[];
}

// API call function
export const fetchClientSummary = async (): Promise<FxClientSummary> => {
  const url = "https://api.jsonbin.io/v3/qs/6859562d8960c979a5afc5b8";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch FX client summary");
  }

  const json = await response.json();

  return json.record as FxClientSummary;
};
