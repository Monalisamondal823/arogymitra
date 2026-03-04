'use server';
/**
 * @fileOverview An AI agent that predicts health risks for patients.
 *
 * - predictHealthRisk - A function that handles the health risk prediction process.
 * - PatientHealthDataInput - The input type for the predictHealthRisk function.
 * - HealthRiskAlertsOutput - The return type for the predictHealthRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PatientHealthDataInputSchema = z.object({
  patientId: z.string().describe('Unique identifier for the patient.'),
  age: z.number().describe('The age of the patient in years.'),
  gender: z.enum(['Male', 'Female', 'Other']).describe('The gender of the patient.'),
  medicalHistorySummary: z
    .string()
    .describe(
      'A summary of the patient\'s medical history, including pre-existing conditions, family history, and past diagnoses.'
    ),
  currentVitals: z
    .object({
      heartRate: z.number().optional().describe('Patient\'s current heart rate.'),
      bloodPressureSystolic: z.number().optional().describe('Patient\'s current systolic blood pressure.'),
      bloodPressureDiastolic: z.number().optional().describe('Patient\'s current diastolic blood pressure.'),
      temperature: z.number().optional().describe('Patient\'s current body temperature.'),
      oxygenSaturation: z.number().optional().describe('Patient\'s current oxygen saturation level.'),
      bloodSugar: z.number().optional().describe('Patient\'s current blood sugar level.'),
    })
    .describe('Current vital signs of the patient.'),
  labResultsSummary: z
    .string()
    .describe('A summary of recent lab results, e.g., "high cholesterol, elevated A1C".'),
  socialDeterminants: z
    .string()
    .optional()
    .describe(
      'Information regarding social determinants of health, such as housing stability, food access, and education level.'
    ),
});
export type PatientHealthDataInput = z.infer<typeof PatientHealthDataInputSchema>;

const HealthRiskAlertsOutputSchema = z.object({
  highRisk: z.boolean().describe('True if the patient is identified as being at high risk for an adverse event or disease progression.'),
  riskScore: z.number().describe('A numerical score indicating the level of risk, higher means higher risk.'),
  riskDescription: z.string().describe('A detailed description of the identified health risk(s).'),
  recommendedInterventions: z.array(z.string()).describe('A list of immediate recommended interventions or follow-up actions.'),
  predictedConditions: z.array(z.string()).describe('A list of conditions the patient is at high risk of developing or worsening.'),
});
export type HealthRiskAlertsOutput = z.infer<typeof HealthRiskAlertsOutputSchema>;

export async function predictHealthRisk(input: PatientHealthDataInput): Promise<HealthRiskAlertsOutput> {
  return predictHealthRiskFlow(input);
}

const predictHealthRiskPrompt = ai.definePrompt({
  name: 'predictHealthRiskPrompt',
  input: {schema: PatientHealthDataInputSchema},
  output: {schema: HealthRiskAlertsOutputSchema},
  prompt: `You are an AI-powered medical risk prediction assistant. Your task is to analyze the provided patient data and identify any high-risk conditions for imminent adverse events or disease progression.

Based on the following patient information, determine if the patient is at high risk, calculate a risk score, describe the risk in detail, and suggest immediate interventions or follow-up actions. List any predicted conditions the patient is at high risk of developing or worsening.

Patient ID: {{{patientId}}}
Age: {{{age}}}
Gender: {{{gender}}}
Medical History Summary: {{{medicalHistorySummary}}}
Current Vitals:
  Heart Rate: {{{currentVitals.heartRate}}}
  Blood Pressure (Systolic/Diastolic): {{{currentVitals.bloodPressureSystolic}}}/{{{currentVitals.bloodPressureDiastolic}}}
  Temperature: {{{currentVitals.temperature}}}
  Oxygen Saturation: {{{currentVitals.oxygenSaturation}}}
  Blood Sugar: {{{currentVitals.bloodSugar}}}
Lab Results Summary: {{{labResultsSummary}}}
Social Determinants of Health: {{{socialDeterminants}}}

Analyze this data and respond in the specified JSON format.`,
});

const predictHealthRiskFlow = ai.defineFlow(
  {
    name: 'predictHealthRiskFlow',
    inputSchema: PatientHealthDataInputSchema,
    outputSchema: HealthRiskAlertsOutputSchema,
  },
  async input => {
    const {output} = await predictHealthRiskPrompt(input);
    return output!;
  }
);
