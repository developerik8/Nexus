import Resolver from '@forge/resolver';

const resolver = new Resolver();

// Function to get mood tips
resolver.define('getMoodTips', async () => {
  const moodTips = [
    'Take a deep breath and relax.',
    'Go for a walk to clear your mind.',
    'Write down your thoughts in a journal.',
    'Talk to a friend or loved one.',
    'Listen to your favorite music or podcast.',
  ];
  return moodTips;
});

// Function to get a motivational quote
resolver.define('getMotivationalQuote', async () => {
  const quotes = [
    'Believe you can and you’re halfway there.',
    'The only way to do great work is to love what you do.',
    'Act as if what you do makes a difference. It does.',
    'Keep your face always toward the sunshine—and shadows will fall behind you.',
    'Success is not how high you have climbed, but how you make a positive difference to the world.',
  ];
  // Randomly select one quote
  return quotes[Math.floor(Math.random() * quotes.length)];
});

export const handler = resolver.getDefinitions();
