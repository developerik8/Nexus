import Resolver from '@forge/resolver';
import { asApp } from '@forge/api';

const resolver = new Resolver();

// The key for the issue property where we store the mood history
const MOOD_HISTORY_PROPERTY_KEY = 'mood-tracker-history';

// Function to get a motivational quote
resolver.define('getMotivationalQuote', async () => {
  const quotes = [
    'Believe you can and you’re halfway there.',
    'The only way to do great work is to love what you do.',
    'Act as if what you do makes a difference. It does.',
    'Keep your face always toward the sunshine—and shadows will fall behind you.',
    'Success is not how high you have climbed, but how you make a positive difference to the world.',
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
});

// Function to save a mood and a comment to the issue's properties
resolver.define('saveMood', async ({ context, payload }) => {
  const { issueKey } = context.extension;
  const { mood, comment } = payload;
  const jira = asApp();

  // Get the existing history
  const response = await jira.requestJira(`/rest/api/3/issue/${issueKey}/properties/${MOOD_HISTORY_PROPERTY_KEY}`);
  let history = [];
  if (response.ok) {
    const data = await response.json();
    history = data.value || [];
  }

  // Add the new mood entry
  const newEntry = {
    mood,
    comment,
    timestamp: new Date().toISOString(),
    // In a real app, you might get the user's ID from the context
    // user: context.accountId 
  };
  history.push(newEntry);

  // Save the updated history
  await jira.requestJira(`/rest/api/3/issue/${issueKey}/properties/${MOOD_HISTORY_PROPERTY_KEY}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(history),
  });

  return true;
});

// Function to get the mood history for an issue
resolver.define('getMoodHistory', async ({ context }) => {
  const { issueKey } = context.extension;
  const jira = asApp();

  const response = await jira.requestJira(`/rest/api/3/issue/${issueKey}/properties/${MOOD_HISTORY_PROPERTY_KEY}`);
  
  if (!response.ok) {
    // If the property doesn't exist, return an empty array
    if (response.status === 404) {
      return [];
    }
    console.error(`Error fetching mood history: ${response.status} ${await response.text()}`);
    return [];
  }

  const data = await response.json();
  return data.value || [];
});


export const handler = resolver.getDefinitions();
