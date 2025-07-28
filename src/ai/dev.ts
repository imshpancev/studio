import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-workout-feedback.ts';
import '@/ai/flows/generate-workout-plan.ts';
import '@/ai/flows/adapt-workout-plan.ts';