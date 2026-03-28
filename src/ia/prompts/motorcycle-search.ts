/**
 * Prompt for Gemini to extract motorcycle specifications from a freeform query.
 * @param query The user's search text (e.g., "Yamaha MT-09 2023")
 */
export const getMotorcycleSearchPrompt = (query: string) => `
You are a motorcycle expert database. The user searched for: "${query}"

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "make": "brand name",
  "model": "model name",
  "year": null or year as number,
  "color": "most common factory color or empty string",
  "engineCC": null or engine displacement in cc as number,
  "horsepower": null or peak horsepower as number,
  "serviceIntervalKm": null or recommended oil change interval in km as number,
  "description": "one short sentence describing this motorcycle"
}

If the query does not match a real motorcycle, return { "error": "not_found" }.
`;
