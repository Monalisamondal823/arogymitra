'use server';
/**
 * @fileOverview This file implements a Genkit flow for the AI Communication Assistant.
 * It transcribes and summarizes doctor-patient conversations and generates draft clinical notes.
 *
 * - aiClinicalNoteGeneration - A function that handles the clinical note generation process.
 * - AIClinicalNoteGenerationInput - The input type for the aiClinicalNoteGeneration function.
 * - AIClinicalNoteGenerationOutput - The return type for the aiClinicalNoteGeneration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIClinicalNoteGenerationInputSchema = z.object({
  conversation: z.string().describe('The full transcript of the doctor-patient conversation.'),
});
export type AIClinicalNoteGenerationInput = z.infer<typeof AIClinicalNoteGenerationInputSchema>;

const AIClinicalNoteGenerationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the doctor-patient conversation.'),
  clinicalNote: z.string().describe('A draft clinical note based on the conversation, formatted for medical records.'),
});
export type AIClinicalNoteGenerationOutput = z.infer<typeof AIClinicalNoteGenerationOutputSchema>;

export async function aiClinicalNoteGeneration(
  input: AIClinicalNoteGenerationInput
): Promise<AIClinicalNoteGenerationOutput> {
  return aiClinicalNoteGenerationFlow(input);
}

const clinicalNoteGenerationPrompt = ai.definePrompt({
  name: 'clinicalNoteGenerationPrompt',
  input: {schema: AIClinicalNoteGenerationInputSchema},
  output: {schema: AIClinicalNoteGenerationOutputSchema},
  prompt: `You are an AI medical scribe assisting a medical professional. Your task is to analyze the provided doctor-patient conversation, generate a concise summary, and then create a draft clinical note in a structured format.

The clinical note should include:
1.  **Subjective**: Chief Complaint, History of Present Illness (HPI), Review of Systems (ROS).
2.  **Objective**: Pertinent Physical Exam findings (if implied or explicitly stated), relevant diagnostic results (if mentioned).
3.  **Assessment**: Diagnosis/Differential Diagnoses, problem list.
4.  **Plan**: Treatment plan, follow-up recommendations, patient education, medications.

Conversation:
{{{conversation}}}`,
});

const aiClinicalNoteGenerationFlow = ai.defineFlow(
  {
    name: 'aiClinicalNoteGenerationFlow',
    inputSchema: AIClinicalNoteGenerationInputSchema,
    outputSchema: AIClinicalNoteGenerationOutputSchema,
  },
  async input => {
    const {output} = await clinicalNoteGenerationPrompt(input);
    return output!;
  }
);
