export const analyzeMeetingText = async (text, apiKey, isFinal = false) => {
  const prompt = `You are an expert meeting analyst. Analyze the following meeting transcript and provide a comprehensive analysis.

Meeting Transcript:
"""${text}"""

Provide your analysis in the following JSON format exactly:
{
  "productiveScore": <number 0-100, how productive the meeting was>,
  "bsScore": <number 0-100, how much circular/vague/unproductive talk>,
  "sentimentScore": <number 0-100, overall sentiment>,
  "sentiment": <"positive"|"negative"|"neutral"|"mixed">,
  "decisionsCount": <number of clear decisions made>,
  "circularTopics": <number of circular discussion topics>,
  "summary": "<2-3 sentence executive summary of the meeting>",
  "decisions": ["<decision 1>", "<decision 2>"],
  "actionItems": ["<action item 1>", "<action item 2>"],
  "circularTopics": ["<circular topic 1>", "<circular topic 2>"],
  "recommendations": ["<recommendation 1>", "<recommendation 2>"],
  "keywords": [
    {"word": "<keyword>", "type": "productive|circular|decision|neutral", "count": <number>}
  ],
  "alerts": [
    {"message": "<alert message>", "type": "warning|danger|info", "icon": "<emoji>"}
  ]
}

Focus on:
1. Identifying circular discussions (topics revisited multiple times without resolution)
2. Detecting BS/vague language (synergy, leverage, circle back, touch base, etc.)
3. Finding clear decisions and action items
4. Measuring productive vs unproductive time
5. Overall meeting efficiency

Be accurate and honest in your assessment.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a meeting efficiency expert. Always respond with valid JSON only, no markdown, no extra text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'API request failed');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) throw new Error('No response from API');

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse API response');
      }
    }

    return {
      productiveScore: Math.min(100, Math.max(0, parsed.productiveScore || 50)),
      bsScore: Math.min(100, Math.max(0, parsed.bsScore || 50)),
      sentimentScore: Math.min(100, Math.max(0, parsed.sentimentScore || 50)),
      sentiment: parsed.sentiment || 'neutral',
      decisionsCount: parsed.decisionsCount || (parsed.decisions ? parsed.decisions.length : 0),
      circularTopics: typeof parsed.circularTopics === 'number' ? parsed.circularTopics : (Array.isArray(parsed.circularTopics) ? parsed.circularTopics.length : 0),
      summary: parsed.summary || '',
      decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
      circularTopics: Array.isArray(parsed.circularTopics) ? parsed.circularTopics : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      alerts: Array.isArray(parsed.alerts) ? parsed.alerts : []
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};

export const summarizeYouTubeVideo = async (videoId, apiKey) => {
  const prompt = `You are an expert video content analyst. The following is a YouTube video ID: ${videoId}.

Since you cannot access video content directly, provide a general framework for what someone should look for when analyzing this type of video content. Include:

1. Expected key topics or themes based on typical content for this video format
2. Common talking points or discussions
3. What makes this type of content valuable or problematic
4. Key questions viewers should consider
5. A brief summary of what to expect from such a video

Respond in a well-structured format with clear headings and bullet points.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to summarize video');
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export const generateSuperChat = async (transcript, question, apiKey) => {
  const prompt = `You are an intelligent meeting assistant called Super Chat. You have access to the following meeting transcript:

${transcript}

The user is asking: "${question || 'Please provide a detailed analysis and insights about this meeting.'}"

Provide a comprehensive, conversational response that:
1. Directly answers the question based on the transcript
2. Provides relevant context and details from the meeting
3. Highlights important moments, decisions, or action items related to the question
4. If the question is general, provide an overall meeting summary with key insights

Respond naturally as if having a conversation about the meeting.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to generate response');
  }

  const data = await response.json();
  return data.choices[0].message.content;
};
