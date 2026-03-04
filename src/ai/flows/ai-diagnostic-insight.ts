'use server';
/**
 * @fileOverview An AI Diagnostic Assistant for medical professionals.
 *
 * - aiDiagnosticInsight - A function that processes patient data to provide preliminary diagnostic insights and highlight potential health risks.
 * - AIDiagnosticInsightInput - The input type for the aiDiagnosticInsight function.
 * - AIDiagnosticInsightOutput - The return type for the aiDiagnosticInsight function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIDiagnosticInsightInputSchema = z.object({
  imagingDataUri: z
    .string()
    .optional()
    .describe(
      "Optional: A data URI of patient imaging (e.g., X-ray, MRI). Must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  labResults: z
    .string()
    .optional()
    .describe('Optional: A string containing comprehensive lab results data.'),
  patientHistory: z
    .string()
    .describe('A detailed string containing the patient clinical history, symptoms, and relevant medical background.'),
});
export type AIDiagnosticInsightInput = z.infer<typeof AIDiagnosticInsightInputSchema>;

const AIDiagnosticInsightOutputSchema = z.object({
  preliminaryDiagnosis: z
    .string()
    .describe('A concise preliminary diagnosis based on the provided data.'),
  diagnosticInsights: z
    .string()
    .describe('Detailed insights and reasoning behind the preliminary diagnosis.'),
  potentialHealthRisks: z
    .array(z.string())
    .describe('A list of potential health risks or conditions identified.'),
  recommendedNextSteps: z
    .array(z.string())
    .describe('Recommendations for further investigations, tests, or specialist consultations.'),
  confidenceLevel: z
    .enum(['High', 'Medium', 'Low'])
    .describe("The AI's confidence level in its preliminary diagnosis."),
});
export type AIDiagnosticInsightOutput = z.infer<typeof AIDiagnosticInsightOutputSchema>;

export async function aiDiagnosticInsight(input: AIDiagnosticInsightInput): Promise<AIDiagnosticInsightOutput> {
  return aiDiagnosticInsightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDiagnosticInsightPrompt',
  input: { schema: AIDiagnosticInsightInputSchema },
  output: { schema: AIDiagnosticInsightOutputSchema },
  prompt: `You are an AI Diagnostic Assistant for medical professionals. Your task is to analyze integrated patient data and provide preliminary diagnostic insights, highlight potential health risks, and suggest further investigations. You must act as a knowledgeable but cautious assistant, always emphasizing that these are preliminary insights and not definitive diagnoses.

Analyze the following patient data:

{{#if imagingDataUri}}
Imaging Data: {{media url=imagingDataUri}}
{{/if}}

{{#if labResults}}
Lab Results: {{{labResults}}}
{{/if}}

Patient History: {{{patientHistory}}}

Based on this information, provide:
1. A concise preliminary diagnosis.
2. Detailed diagnostic insights and reasoning.
3. A list of potential health risks or conditions identified.
4. Recommendations for further investigations, tests, or specialist consultations.
5. Your confidence level in this preliminary assessment.

Ensure your output strictly adheres to the provided JSON schema. If any data is missing or insufficient to provide a confident assessment, reflect that in your output, especially in the diagnostic insights and confidence level.`,
});

const aiDiagnosticInsightFlow = ai.defineFlow(
  {
    name: 'aiDiagnosticInsightFlow',
    inputSchema: AIDiagnosticInsightInputSchema,
    outputSchema: AIDiagnosticInsightOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
