'use server';

/**
 * @fileOverview AI-powered habit suggestion flow.
 *
 * - suggestHabits - A function that suggests personalized habits based on user input.
 * - SuggestHabitsInput - The input type for the suggestHabits function.
 * - SuggestHabitsOutput - The return type for the suggestHabits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHabitsInputSchema = z.object({
  existingHabits: z
    .string()
    .describe('A comma separated list of the user\'s existing habits.'),
  goals: z.string().describe('The user\'s goals.'),
});
export type SuggestHabitsInput = z.infer<typeof SuggestHabitsInputSchema>;

const SuggestHabitsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'A comma separated list of personalized habit suggestions based on the user\'s existing habits and goals.'
    ),
});
export type SuggestHabitsOutput = z.infer<typeof SuggestHabitsOutputSchema>;

export async function suggestHabits(input: SuggestHabitsInput): Promise<SuggestHabitsOutput> {
  return suggestHabitsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestHabitsPrompt',
  input: {schema: SuggestHabitsInputSchema},
  output: {schema: SuggestHabitsOutputSchema},
  prompt: `You are a personalized habit suggestion AI. You will suggest new habits to users based on their existing habits and goals.

  Existing Habits: {{{existingHabits}}}
  Goals: {{{goals}}}

  Suggest new habits to the user that align with their goals. The suggestions should be comma separated.
  `,
});

const suggestHabitsFlow = ai.defineFlow(
  {
    name: 'suggestHabitsFlow',
    inputSchema: SuggestHabitsInputSchema,
    outputSchema: SuggestHabitsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
