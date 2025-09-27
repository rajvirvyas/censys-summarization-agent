import React from 'react';
import { useState } from 'react';
import { Container, TextField, Button, Card, Typography, CircularProgress } from "@mui/material";
import ReactDOM from 'react-dom/client'
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme} >
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)

export default function App() {
  const [inputData, setInputData] = useState("");
  const [summary, setSummary] = useState("");
  const [loadingWheel, setLoadingWheel] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    setLoadingWheel(true);
    setError("");
    setSummary("");
    try {
      const jsonData = JSON.parse(inputData);
      const response = await axios.post("http://localhost:8000/summarize", { data: jsonData});
      setSummary(response.data.summary);
    } catch (e) {
      setError("Unable to summarize data! Please ensure JSON is valid and backend is running!");
    }
    setLoadingWheel(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        padding: '2rem',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '600px',
          gap: '1rem'
        }}
      >
      <Typography variant='h4' gutterBottom align="center">
        Censys Host Data Summarizer AI Agent (Powered by Groq)
      </Typography>
      
      <TextField
        label="Paste Censys host data JSON here"
        multiline
        rows={15}
        fullWidth
        variant='filled'
        sx={{
          bgcolor: '#2c2c2c',
          borderRadius: 1,
          input: { color: 'white' },
          textarea: { color: 'white' },
          label: { color: '#bbb' }
        }}
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
      />
      
      <Button
        variant='contained'
        color="primary"
        fullWidth
        onClick={handleSummarize}
        disabled={loadingWheel}
      >
        {loadingWheel ? <CircularProgress size={26} /> : 'Summarize'}
      </Button>

      {error && (
        <Typography color='error'>
          {error}
        </Typography>
      )}

      {summary && (
        <Card sx={{ width: '100%', padding: '1rem' }}>
          <Typography variant='h6'>Summary</Typography>
          <ReactMarkdown>{summary}</ReactMarkdown>
        </Card>
      )}
      </div>
    </div>
  );
}