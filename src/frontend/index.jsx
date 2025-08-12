import React, { useEffect, useState, useCallback } from 'react';
import ForgeReconciler, {
  Text,
  Button,
  ButtonSet,
  SectionMessage,
  Heading,
  Stack,
  Grid,
  Cell,
  TextField,
} from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const [mood, setMood] = useState(null);
  const [comment, setComment] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [quote, setQuote] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const fetchMoodHistory = useCallback(async () => {
    const history = await invoke('getMoodHistory');
    setMoodHistory(history || []);
  }, []);

  useEffect(() => {
    invoke('getMotivationalQuote').then(setQuote);
    fetchMoodHistory();
  }, [fetchMoodHistory]);

  const handleSetMood = async (selectedMood) => {
    setMood(selectedMood);
    await invoke('saveMood', { mood: selectedMood, comment });
    setConfirmationMessage(`Your mood "${selectedMood}" has been saved!`);
    setComment(''); // Clear the comment field
    // Hide the confirmation message after 3 seconds
    setTimeout(() => setConfirmationMessage(''), 3000);
    // Refresh the history after saving a new mood
    fetchMoodHistory();
  };

  const moodCounts = moodHistory.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  return (
    <Stack space="space.200">
      <SectionMessage title="A little motivation for you!" appearance="info">
        <Text>{quote || 'Loading motivational quote...'}</Text>
      </SectionMessage>

      <Grid>
        <Cell>
          <Stack space="space.100">
            <Heading as="h2">How are you feeling about this issue?</Heading>
            <ButtonSet>
              <Button text="Happy 😊" onClick={() => handleSetMood('Happy')} />
              <Button text="Stressed 😓" onClick={() => handleSetMood('Stressed')} />
              <Button text="Neutral 😐" onClick={() => handleSetMood('Neutral')} />
              <Button text="Excited 😄" onClick={() => handleSetMood('Excited')} />
              <Button text="Sad 😔" onClick={() => handleSetMood('Sad')} />
            </ButtonSet>
            <TextField
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment (optional)"
            />
            {confirmationMessage && (
              <SectionMessage appearance="confirmation">
                <Text>{confirmationMessage}</Text>
              </SectionMessage>
            )}
          </Stack>
        </Cell>
      </Grid>

      <Stack space="space.100">
        <Heading as="h2">Mood History</Heading>
        {moodHistory.length > 0 ? (
          moodHistory.map((entry, index) => (
            <Text key={index}>
              - {new Date(entry.timestamp).toLocaleString()}: **{entry.mood}**
              {entry.comment && ` - "${entry.comment}"`}
            </Text>
          ))
        ) : (
          <Text>No moods logged for this issue yet.</Text>
        )}
      </Stack>

      <Stack space="space.100">
        <Heading as="h2">Mood Visualization</Heading>
        {Object.keys(moodCounts).length > 0 ? (
          Object.entries(moodCounts).map(([mood, count]) => (
            <Grid key={mood}>
              <Cell>
                <Text>{mood}</Text>
              </Cell>
              <Cell>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      width: `${count * 20}px`, // Simple scaling for the bar
                      height: '20px',
                      backgroundColor: '#4c9aff',
                      borderRadius: '3px',
                    }}
                  />
                  <Text>&nbsp;({count})</Text>
                </div>
              </Cell>
            </Grid>
          ))
        ) : (
          <Text>No data to visualize yet.</Text>
        )}
      </Stack>
    </Stack>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
