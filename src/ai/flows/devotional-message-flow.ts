'use server';
/**
 * @fileOverview An AI flow for generating short devotional messages.
 *
 * - getDevotionalMessage - A function that generates a devotional message based on a topic.
 * - DevotionalMessageInput - The input type for the flow.
 * - DevotionalMessageOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DevotionalMessageInputSchema = z.object({
  topic: z.string().describe('The topic for the devotional message, e.g., "Faith", "Love", "Forgiveness".'),
});
export type DevotionalMessageInput = z.infer<typeof DevotionalMessageInputSchema>;

const DevotionalMessageOutputSchema = z.object({
  message: z.string().describe('A short, encouraging devotional message, 1-2 sentences long.'),
});
export type DevotionalMessageOutput = z.infer<typeof DevotionalMessageOutputSchema>;

export async function getDevotionalMessage(topic: string): Promise<string> {
  const result = await devotionalMessageFlow({ topic });
  return result.message;
}

const prompt = ai.definePrompt({
  name: 'devotionalMessagePrompt',
  input: { schema: DevotionalMessageInputSchema },
  output: { schema: DevotionalMessageOutputSchema },
  prompt: `You are a wise and gentle Coptic Orthodox spiritual guide.
Generate a very short, encouraging devotional message (1-2 sentences) in Arabic based on the following topic: {{{topic}}}.
The message should be inspiring and suitable for a priest to see on their dashboard.
Do not include the topic in the response, only the message itself.`,
});

const devotionalMessageFlow = ai.defineFlow(
  {
    name: 'devotionalMessageFlow',
    inputSchema: DevotionalMessageInputSchema,
    outputSchema: DevotionalMessageOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
