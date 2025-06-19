const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate content ideas using OpenAI
 * @param {string} contentType - Type of content (blog, video, social)
 * @param {string} topic - Main topic or industry
 * @param {string} audience - Target audience
 * @param {string} tone - Tone of content
 * @param {number} count - Number of ideas to generate
 * @returns {Promise<Array>} Array of generated ideas
 */
async function generateIdeas(contentType, topic, audience, tone = 'professional', count = 5) {
  // Craft prompt based on content type
  let prompt = `Generate ${count} creative and engaging ${contentType} content ideas`;
  
  if (topic) {
    prompt += ` about ${topic}`;
  }
  
  if (audience) {
    prompt += ` for ${audience}`;
  }
  
  prompt += `. The tone should be ${tone}.`;
  
  // Additional instructions based on content type
  if (contentType === 'blog') {
    prompt += ` For each blog post idea, provide a catchy title and a brief description of what the post would cover. Include potential keywords for SEO.`;
  } else if (contentType === 'video') {
    prompt += ` For each video idea, provide an attention-grabbing title, a concept description, and suggested visual elements or hooks.`;
  } else if (contentType === 'social') {
    prompt += ` For each social media post idea, specify the platform (Instagram, Twitter, LinkedIn, etc.), provide a concise caption, and suggest hashtags or engagement prompts.`;
  }
  
  prompt += ` Format each idea as a JSON object with 'title', 'description', and 'keywords' fields.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // or gpt-3.5-turbo
      messages: [
        { role: "system", content: "You are a creative content strategist helping generate engaging content ideas." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    // Extract and parse the JSON response
    const content = response.choices[0].message.content;
    try {
      // Try to parse directly if the response is clean JSON
      return JSON.parse(content);
    } catch (err) {
      // Handle case where response might include explanatory text along with JSON
      const jsonMatch = content.match(/\[\s*{.*}\s*\]/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON array found, try to extract individual JSON objects
        const ideas = [];
        const matches = content.match(/{[^{}]*}/g);
        if (matches) {
          for (const match of matches) {
            try {
              ideas.push(JSON.parse(match));
            } catch (e) {
              console.warn('Failed to parse idea:', match);
            }
          }
          return ideas;
        }
      }
      
      // If all parsing attempts fail, return a structured error message
      console.error('Failed to parse OpenAI response as JSON:', content);
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

module.exports = generateIdeas;