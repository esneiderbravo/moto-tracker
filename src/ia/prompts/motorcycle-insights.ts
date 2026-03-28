/**
 * Prompt for Gemini to generate a personalized maintenance tip.
 * @param make Brand of the motorcycle.
 * @param model Model of the motorcycle.
 * @param year Year of the motorcycle.
 * @param km Current mileage in km.
 */
export const getMotorcycleInsightsPrompt = (make: string, model: string, year: number | null, km: number) => `
You are a master motorcycle mechanic with specific knowledge of the "${make} ${model} ${year || ''}".
The user's motorcycle currently has ${km.toLocaleString()} km.

Based on this specific model and mileage, provide ONE short, expert maintenance tip or insight (max 2 sentences). 
Focus on what usually needs attention around this mileage for this specific bike.

Return ONLY the plain text tip. No markdown, no "Mechanic's tip:", just the text.
Language: The tip must be in the user's language (Detect from query or context, default to Spanish).
`;
