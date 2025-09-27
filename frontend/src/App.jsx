import React from 'react';
import { useState, useRef } from 'react';
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
  // Will default to host 1 for quicker testing
  const exampleJson = `{  
  "ip": "168.196.241.227",
  "location": {
    "city": "New York City",
    "country": "United States",
    "country_code": "US",
    "coordinates": {
      "latitude": 40.71427,
      "longitude": -74.00597
    }
  },
  "autonomous_system": {
    "asn": 263744,
    "name": "Udasha S.A.",
    "country_code": "HN"
  },
  "services": [
    {
      "port": 11558,
      "protocol": "SSH",
      "banner": "SSH-2.0-OpenSSH_8.7",
      "software": [
        {
          "product": "openssh",
          "vendor": "openbsd",
          "version": "8.7"
        }
      ],
      "vulnerabilities": [
        {
          "cve_id": "CVE-2023-38408",
          "severity": "critical",
          "cvss_score": 9.8,
          "description": "Known exploited vulnerability"
        },
        {
          "cve_id": "CVE-2024-6387",
          "severity": "high",
          "cvss_score": 8.1,
          "description": "Known exploited vulnerability"
        }
      ]
    }
  ],
  "threat_intelligence": {
    "security_labels": [
      "REMOTE_ACCESS"
    ],
    "risk_level": "high"
  }
}`
  const [inputData, setInputData] = useState(exampleJson);
  const [summary, setSummary] = useState("");
  const [loadingWheel, setLoadingWheel] = useState(false);
  const [error, setError] = useState("");

  // allowing users to upload json file directly instead
  const fileInputRef = useRef(null); 
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setInputData(evt.target.result);
    };
    reader.readAsText(file);
  };

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
         
         <Button
          variant="outlined"
          onClick={() => fileInputRef.current.click()}
          fullWidth
        >
          Upload JSON File
        </Button>
        <input
          type="file"
          accept=".json,application/json"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />

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
          variant="outlined"
          color="secondary"
          fullWidth
          style={{ marginTop: "0.5rem" }}
          onClick={() => setInputData("")}
        >
          Clear Input
        </Button>

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