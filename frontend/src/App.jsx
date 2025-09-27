import React from 'react';
import { useState, useRef } from 'react';
import { Avatar, Box, Container, TextField, Button, Card, Typography, CircularProgress } from "@mui/material";
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

  const handleGitHubClick = () => {
    window.open("https://github.com/rajvirvyas/censys-summarization-agent", "_blank");
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: '100vw'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '600px'
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
        <Typography 
          variant='h4' 
          gutterBottom 
          align="center"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            marginBottom: '2rem'
          }}
        >
          Censys Host Data Summarizer AI Agent (Powered by Groq)
        </Typography>
         <Box
              onClick={handleGitHubClick}
              sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '25px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Avatar
                src="https://github.com/rajvirvyas.png"  
                sx={{ 
                  width: 32, 
                  height: 32,
                  border: '2px solid rgba(255,255,255,0.3)'
                }}
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 500
                }}
              >
                Built by Your Name
              </Typography>
            </Box>
        <Button
          variant="outlined"
          onClick={() => fileInputRef.current.click()}
          fullWidth
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            fontWeight: '600',
            py: 1.2,
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            },
            transition: 'all 0.3s ease'
          }}
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
          label="Uploaded/Pasted JSON Data Appears here"
          multiline
          rows={15}
          fullWidth
          variant='filled'
          sx={{
            bgcolor: loadingWheel ? 'rgba(44, 44, 44, 0.7)' : '#2c2c2c',
            borderRadius: 1,
            input: { color: 'white' },
            textarea: { color: 'white' },
            label: { color: '#bbb' },
            filter: loadingWheel ? 'blur(2px)' : 'none',
            transition: 'all 0.3s ease',
            animation: loadingWheel ? 'pulse 2s ease-in-out infinite' : 'none',
            '@keyframes pulse': {
              '0%': {
                opacity: 0.7,
                transform: 'scale(0.99)'
              },
              '50%': {
                opacity: 1,
                transform: 'scale(1)'
              },
              '100%': {
                opacity: 0.7,
                transform: 'scale(0.99)'
              }
            }
          }}
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          disabled={loadingWheel}
        />
        <Button
          variant="outlined"

          fullWidth
          
          onClick={() => setInputData("")}
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            fontWeight: '500',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.6)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white'
            },
            transition: 'all 0.3s ease'
          }}
        >
           Clear Input
        </Button>

        <Button
          variant='contained'
          color="primary"
          fullWidth
          onClick={handleSummarize}
          disabled={loadingWheel}
          sx={{
            py: 1.5,
            fontSize: '16px',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            boxShadow: '0 3px 15px rgba(254, 107, 139, 0.4)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: loadingWheel ? 'none' : 'translateY(-2px)',
              boxShadow: loadingWheel ? '0 3px 15px rgba(254, 107, 139, 0.4)' : '0 8px 25px rgba(254, 107, 139, 0.6)'
            },
            '&:disabled': {
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              color: 'white',
              opacity: 0.8
            }
          }}
        >
          {loadingWheel ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={26} sx={{ color: 'white' }} />
              <Typography variant="button"> Parsing File...</Typography>
            </Box>
          ) : 'Summarize'}
        </Button>

        {error && (
          <Card
            sx={{
              padding: '1rem',
              backgroundColor: 'rgba(244, 67, 54, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              borderRadius: 2
            }}
          >
            <Typography 
              sx={{ 
                color: 'white',
                fontWeight: 500,
                textAlign: 'center'
              }}
            >
               {error}
            </Typography>
          </Card>
        )}

        {summary && (
          <Card 
            sx={{ 
              width: '100%', 
              padding: '1.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              color: 'black',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              borderRadius: 2,
              animation: 'slideIn 0.5s ease-out',
              '@keyframes slideIn': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(20px)'
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)'
                }
              }
            }}
          >
            <Typography 
              variant='h6' 
              sx={{ 
                marginBottom: 2,
                color: '#333',
                fontWeight: 'bold'
              }}
            >
              Summary
            </Typography>
            <Box sx={{ '& p': { marginBottom: 1, lineHeight: 1.6 } }}>
              <ReactMarkdown>{summary}</ReactMarkdown>
            </Box>
          </Card>
        )}
        </div>
        </div>
    </Box>
  );
}
