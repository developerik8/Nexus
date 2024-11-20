import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const [tips, setTips] = useState(null);
  const [quote, setQuote] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    // Fetch mood tips
    invoke('getMoodTips').then(setTips);

    // Fetch motivational quote
    invoke('getMotivationalQuote').then(setQuote);

    // Update the current time periodically
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Text>Welcome to the Nexus Mood Tracker!</Text>
      <Text>Mood Tracker helps you track your emotions and stay motivated.</Text>
      <Text>Current Date and Time: {currentTime}</Text>

      <Text>Your current mood is: Happy 😊</Text>

      <Text>Mood 1</Text>
      <Text>I am feeling great today! 😊</Text>

      <Text>Mood 2</Text>
      <Text>Things are a bit stressful, but I'm managing. 😓</Text>

      <Text>Mood 3</Text>
      <Text>Everything feels neutral today. 😐</Text>

      <Text>Mood 4</Text>
      <Text>I'm so excited and full of energy! 😄</Text>

      <Text>Mood 5</Text>
      <Text>I'm feeling a bit sad, but it's okay. 😔</Text>

      <Text>Mood Tips:</Text>
      {tips ? tips.map((tip, index) => <Text key={index}>- {tip}</Text>) : <Text>Loading mood tips...</Text>}

      <Text>Motivational Quote:</Text>
      <Text>{quote ? `"${quote}"` : 'Loading motivational quote...'}</Text>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
