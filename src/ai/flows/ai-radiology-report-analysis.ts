'use server';
/**
 * @fileOverview An AI tool to interpret free-text radiology reports, extract structured findings,
 * and flag critical follow-up recommendations.
 *
 * - aiRadiologyReportAnalysis - A function that processes radiology reports.
 * - AIRadiologyReportAnalysisInput - The input type for the aiRadiologyReportAnalysis function.
 * - AIRadiologyReportAnalysisOutput - The return type for the aiRadiologyReportAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIRadiologyReportAnalysisInputSchema = z.object({
  radiologyReportText: z
    .string()
    .describe('The free-text radiology report to be analyzed.'),
});
export type AIRadiologyReportAnalysisInput = z.infer<
  typeof AIRadiologyReportAnalysisInputSchema
>;

const AIRadiologyReportAnalysisOutputSchema = z.object({
  structuredFindings: z
    .array(
      z.object({
        finding: z.string().describe('A summary of the medical finding.'),
        severity:
          z.enum(['mild', 'moderate', 'severe', 'critical']) ||
          z.string().describe('The severity of the finding.'),
        location: z.string().describe('The anatomical location of the finding.'),
      })
    )
    .describe('Structured extraction of medical findings from the report.'),
  followUpRecommendations:
    z.array(z.string().describe('A critical follow-up recommendation.'))
      .describe(
        'List of critical follow-up recommendations detected in the report, especially for incidental findings.'
      ),
  incidentalFindingsDetected: z
    .boolean()
    .describe(
      'True if any incidental findings requiring follow-up were detected in the report.'
    ),
});
export type AIRadiologyReportAnalysisOutput = z.infer<
  typeof AIRadiologyReportAnalysisOutputSchema
>;

export async function aiRadiologyReportAnalysis(
  input: AIRadiologyReportAnalysisInput
): Promise<AIRadiologyReportAnalysisOutput> {
  return aiRadiologyReportAnalysisFlow(input);
}

const aiRadiologyReportAnalysisPrompt = ai.definePrompt({
  name: 'aiRadiologyReportAnalysisPrompt',
  input: {schema: AIRadiologyReportAnalysisInputSchema},
  output: {schema: AIRadiologyReportAnalysisOutputSchema},
  prompt: `You are an expert medical AI assistant specialized in analyzing radiology reports. Your task is to accurately interpret the provided free-text radiology report, extract all medical findings in a structured format, and specifically identify and flag any critical follow-up recommendations, particularly those related to incidental findings.

Pay close attention to details, and ensure all relevant information for each finding (what it is, its severity, and where it is located) is captured. For follow-up recommendations, only list those that are critical or require immediate attention or scheduling. If no incidental findings are detected or no critical follow-up is recommended, provide an empty array for 'followUpRecommendations' and set 'incidentalFindingsDetected' to false.

Radiology Report:
{{{radiologyReportText}}}`,
});

const aiRadiologyReportAnalysisFlow = ai.defineFlow(
  {
    name: 'aiRadiologyReportAnalysisFlow',
    inputSchema: AIRadiologyReportAnalysisInputSchema,
    outputSchema: AIRadiologyReportAnalysisOutputSchema,
  },
  async input => {
    const {output} = await aiRadiologyReportAnalysisPrompt(input);
    return output!;
  }
);
