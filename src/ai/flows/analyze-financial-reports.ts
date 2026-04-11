'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing financial reports (annual/monthly)
 * and providing concise, actionable insights and identifying key trends.
 *
 * - analyzeFinancialReports - A function that handles the financial report analysis process.
 * - AnalyzeFinancialReportsInput - The input type for the analyzeFinancialReports function.
 * - AnalyzeFinancialReportsOutput - The return type for the analyzeFinancialReports function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const FinancialReportInputSchema = z.object({
  reportType: z.enum(['annual', 'monthly']).describe('The type of financial report being analyzed (annual or monthly).'),
  reportPeriod: z.string().describe('The specific period of the financial report (e.g., "2023" for annual, "January 2024" for monthly).'),
  financialData: z.array(z.object({
    period: z.string().describe('The specific period within the report (e.g., "January", "Q1", "December").'),
    totalBookings: z.number().describe('The total number of bookings in this period.'),
    totalRevenue: z.number().describe('The total revenue generated in this period.'),
    totalExpenses: z.number().describe('The total expenses incurred in this period.'),
    netProfit: z.number().describe('The net profit (revenue - expenses) for this period.'),
  })).describe('An array of financial data summaries for different periods within the report.'),
  additionalNotes: z.string().optional().describe('Any additional notes or context about the financial report.'),
});
export type AnalyzeFinancialReportsInput = z.infer<typeof FinancialReportInputSchema>;

// Output Schema
const FinancialReportOutputSchema = z.object({
  summary: z.string().describe('A concise overall summary of the financial report and its key performance.'),
  keyFindings: z.array(z.string()).describe('A list of key observations and data points from the report.'),
  busiestPeriods: z.array(z.string()).describe('A list of periods that had the highest number of bookings.'),
  highestProfitPeriods: z.array(z.string()).describe('A list of periods that yielded the highest net profit.'),
  actionableInsights: z.array(z.string()).describe('A list of actionable recommendations or strategic decisions based on the analysis.'),
});
export type AnalyzeFinancialReportsOutput = z.infer<typeof FinancialReportOutputSchema>;

export async function analyzeFinancialReports(input: AnalyzeFinancialReportsInput): Promise<AnalyzeFinancialReportsOutput> {
  return analyzeFinancialReportsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFinancialReportsPrompt',
  input: { schema: FinancialReportInputSchema },
  output: { schema: FinancialReportOutputSchema },
  prompt: `You are an expert financial analyst specializing in service business performance.
Your task is to analyze the provided financial report data and extract concise, actionable insights and identify key trends.
Focus on business performance, identifying busiest periods, periods with highest profit, and providing strategic recommendations.

Based on the data provided, generate a JSON object with the following fields: "summary", "keyFindings", "busiestPeriods", "highestProfitPeriods", and "actionableInsights".

- "summary": A concise overall summary of the financial report and its key performance.
- "keyFindings": An array of strings with key observations and data points from the report.
- "busiestPeriods": An array of strings listing the periods that had the highest number of bookings.
- "highestProfitPeriods": An array of strings listing the periods that yielded the highest net profit.
- "actionableInsights": An array of strings with actionable recommendations or strategic decisions based on the analysis.

Analyze the financial data below and provide the JSON output.

Financial Report Type: {{{reportType}}}
Report Period: {{{reportPeriod}}}

Financial Data:
{{#each financialData}}
- Period: {{{period}}}, Bookings: {{{totalBookings}}}, Revenue: {{{totalRevenue}}}, Expenses: {{{totalExpenses}}}, Net Profit: {{{netProfit}}}
{{/each}}

{{#if additionalNotes}}
Additional Notes: {{{additionalNotes}}}
{{/if}}
`,
});

const analyzeFinancialReportsFlow = ai.defineFlow(
  {
    name: 'analyzeFinancialReportsFlow',
    inputSchema: FinancialReportInputSchema,
    outputSchema: FinancialReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a financial report analysis.');
    }
    return output;
  }
);
