'use server';

/**
 * @fileOverview AI flow to generate a short motivational quote.
 *
 * - getMotivationalQuote - A function that returns a motivational quote.
 * - GetMotivationalQuoteOutput - The return type for the getMotivationalQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetMotivationalQuoteOutputSchema = z.object({
  quote: z.string().describe('A short, inspiring motivational quote.'),
});
export type GetMotivationalQuoteOutput = z.infer<typeof GetMotivationalQuoteOutputSchema>;

export async function getMotivationalQuote(): Promise<GetMotivationalQuoteOutput> {
  return getMotivationalQuoteFlow();
}

const prompt = ai.definePrompt({
  name: 'motivationalQuotePrompt',
  output: {schema: GetMotivationalQuoteOutputSchema},
  prompt: 'You are a source of inspiration. Please provide a short, powerful motivational quote to encourage a user who is building new habits.',
});

const getMotivationalQuoteFlow = ai.defineFlow(
  {
    name: 'getMotivationalQuoteFlow',
    outputSchema: GetMotivationalQuoteOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);
