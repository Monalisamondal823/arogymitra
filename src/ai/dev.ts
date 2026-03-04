import { config } from 'dotenv';
config();

import '@/ai/flows/ai-radiology-report-analysis.ts';
import '@/ai/flows/ai-clinical-note-generation-flow.ts';
import '@/ai/flows/ai-diagnostic-insight.ts';
import '@/ai/flows/ai-health-risk-alerts.ts';