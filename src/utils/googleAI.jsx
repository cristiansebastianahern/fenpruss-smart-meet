import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);

export const generateText = async (prompt, type = 'summary') => {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Prepare the prompt based on type
    let systemPrompt = '';
    if (type === 'summary') {
      systemPrompt = 
        'Resume la siguiente transcripción de una reunión en un párrafo breve, ' +
        'destacando los temas principales y decisiones tomadas:\n\n';
    } else if (type === 'act') {
      systemPrompt = 
        'Genera un acta formal de reunión que incluya:\n' +
        '1. Fecha y hora\n' +
        '2. Asistentes (si se mencionan)\n' +
        '3. Puntos clave discutidos\n' +
        '4. Acuerdos y decisiones tomadas\n' +
        '5. Tareas asignadas y responsables (si se mencionan)\n\n' +
        'Transcripción:\n\n';
    }

    // Generate content
    const result = await model.generateContent(systemPrompt + prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error('Error generating text:', error);
    throw new Error('No se pudo generar el texto');
  }
};