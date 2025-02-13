import { genAI} from "@/lib/genAI";

const ai_model = "gemini-2.0-flash-lite-preview-02-05";

export async function generateJSON(prompt, schema) {
    try {
        if(!schema) {
            throw new Error("Schema not found.");
        }
        const model = genAI.getGenerativeModel({ model: ai_model,
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: schema,
            }})
        const response = await model.generateContent(prompt).then(result => {
            return result.response;
        });
        if(!response.text)
            throw new Error("Unable to get response from the AI.");
        return response;
    } catch (e) {
        console.error(e);
        throw new Error("Something went wrong in generating JSON: ", e);
    }
}

export async function generatePrediction(data) {

}