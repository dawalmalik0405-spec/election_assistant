import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

export const generateNimResponse = async (prompt, apiKey, language = 'en-US') => {
  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: `${window.location.origin}/nim-api/v1`,
    dangerouslyAllowBrowser: true // Required for client-side API calls
  });

  const langNames = { 'en-US': 'English', 'es-ES': 'Spanish', 'fr-FR': 'French', 'hi-IN': 'Hindi' };
  const targetLang = langNames[language] || 'English';

  try {
    const completion = await openai.chat.completions.create({
      model: "minimaxai/minimax-m2.7",
      messages: [
        { role: 'system', content: `You are a voice-based assistant. Answer the user's question directly, strictly, and extremely briefly using ONLY the provided context. IMPORTANT: You MUST reply entirely in ${targetLang}. DO NOT include any extra conversational filler. ABSOLUTELY NO MARKDOWN. Do not use asterisks (*), hashes (#), underscores, or bullet points. Use plain text only.` },
        { role: 'user', content: prompt }
      ],
      temperature: 1,
      top_p: 0.95,
      max_tokens: 8192,
    });
    
    const msg = completion.choices[0]?.message;
    return msg?.content || msg?.reasoning_content || "I'm sorry, I couldn't generate a proper response.";
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch from NVIDIA NIM');
  }
};

export const generateGeminiResponse = async (prompt, apiKey, language = 'en-US') => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }, { apiVersion: "v1" });
  
  const langNames = { 'en-US': 'English', 'es-ES': 'Spanish', 'fr-FR': 'French', 'hi-IN': 'Hindi' };
  const targetLang = langNames[language] || 'English';

  const systemPrompt = `You are a voice-based assistant. Answer the user's question directly, strictly, and extremely briefly using ONLY the provided context. IMPORTANT: You MUST reply entirely in ${targetLang}. DO NOT include any extra conversational filler. ABSOLUTELY NO MARKDOWN. Do not use asterisks (*), hashes (#), underscores, or bullet points. Use plain text only.`;
  const fullPrompt = `${systemPrompt}\n\n${prompt}`;
  
  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch from Gemini');
  }
};

export const generateRobustAiResponse = async (prompt, preferredModel, geminiKey, nimKey, language = 'en-US') => {
  const tryGemini = async () => {
    if (!geminiKey) throw new Error("Google Gemini API Key is missing.");
    return await generateGeminiResponse(prompt, geminiKey, language);
  };
  
  const tryNim = async () => {
    if (!nimKey) throw new Error("NVIDIA NIM API Key is missing.");
    return await generateNimResponse(prompt, nimKey, language);
  };

  if (preferredModel === 'gemini') {
    try {
      return await tryGemini();
    } catch (err) {
      console.warn("Primary model (Gemini) failed. Falling back to NVIDIA NIM:", err);
      try {
        return await tryNim();
      } catch (fallbackErr) {
        throw new Error(`Both AI providers failed. Gemini Error: ${err.message}. NIM Error: ${fallbackErr.message}`);
      }
    }
  } else {
    try {
      return await tryNim();
    } catch (err) {
      console.warn("Primary model (NIM) failed. Falling back to Gemini:", err);
      try {
        return await tryGemini();
      } catch (fallbackErr) {
        throw new Error(`Both AI providers failed. NIM Error: ${err.message}. Gemini Error: ${fallbackErr.message}`);
      }
    }
  }
};

export const generateDynamicQuiz = async (geminiKey, nimKey, language = 'en-US') => {
  const langNames = { 'en-US': 'English', 'es-ES': 'Spanish', 'fr-FR': 'French', 'hi-IN': 'Hindi' };
  const targetLang = langNames[language] || 'English';

  const prompt = `Generate a 5-question multiple choice quiz about Global and Indian Election processes, voting rights, and civic duties.
IMPORTANT: You MUST write the questions and answers in ${targetLang}.
You MUST return ONLY a valid JSON array of objects. Do not use markdown blocks like \`\`\`json. 
Each object must have exactly these keys:
"question": the question string
"options": an array of 4 string options
"correctAnswer": the correct string (must exactly match one of the options)

Example:
[
  {
    "question": "Which body conducts elections in India?",
    "options": ["Supreme Court", "Election Commission", "Parliament", "NITI Aayog"],
    "correctAnswer": "Election Commission"
  }
]
`;

  try {
    // Attempt with Gemini first for complex JSON
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let content = response.text();
    content = content.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(content);
  } catch (err) {
    console.warn("Gemini Quiz generation failed, trying NIM:", err);
    
    const openai = new OpenAI({
      apiKey: nimKey,
      baseURL: `${window.location.origin}/nim-api/v1`,
      dangerouslyAllowBrowser: true
    });

    try {
      const completion = await openai.chat.completions.create({
        model: "minimaxai/minimax-m2.7",
        messages: [
          { role: 'system', content: 'You are a strict JSON API. Output ONLY a valid JSON array. Nothing else.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
      });
      
      let content = completion.choices[0]?.message?.content || "[]";
      content = content.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(content);
    } catch (fallbackErr) {
      console.error("Both Quiz generators failed", fallbackErr);
      return [
        {
          question: "Which body conducts elections in India?",
          options: ["Supreme Court", "Election Commission", "Parliament", "NITI Aayog"],
          correctAnswer: "Election Commission"
        }
      ];
    }
  }
};

export const generateValuesAnalysis = async (answers, nimKey, language = 'en-US') => {
  const langNames = { 'en-US': 'English', 'es-ES': 'Spanish', 'fr-FR': 'French', 'hi-IN': 'Hindi' };
  const targetLang = langNames[language] || 'English';

  const prompt = `Based on the following user values, provide a brief, objective summary of which civic policies align best with their values.
User Values: ${JSON.stringify(answers)}
IMPORTANT: You MUST write the analysis in ${targetLang}.
Keep it informative, unbiased, and around 3-4 sentences. Do not mention specific political parties if possible, focus on policies.`;

  const openai = new OpenAI({
    apiKey: nimKey,
    baseURL: `${window.location.origin}/nim-api/v1`,
    dangerouslyAllowBrowser: true
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "minimaxai/minimax-m2.7",
      messages: [
        { role: 'system', content: 'You are an objective political science expert. Be unbiased and concise.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });
    
    const msg = completion.choices[0]?.message;
    return msg?.content || msg?.reasoning_content || "Analysis could not be generated.";
  } catch (error) {
    console.error("Values analysis failed", error);
    return "I'm sorry, I couldn't generate an analysis right now due to an AI service error.";
  }
};
