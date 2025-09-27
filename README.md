# Censys Host Data Summarization Agent 
This project was built for Censys' 2026 AI Intern Take-Home Assignment. It is an AI-powered tool which provides a human-readable, security-focused summary of raw [Censys](https://censys.com/) JSON host scan data. To do this, I harnessed the power of the LlaMA 3 large language model (LLM) using Groq for the API to provide a fast, modern experience along with React and Vite for the frontend, and FastAPI for the backend.

![Image](https://github.com/rajvirvyas/censys-summarization-agent/blob/main/Screenshot%202025-09-26%20221224.png)

## Features
* Upload or paste raw JSON data
* Instantly get summarized key security findings with markdown-rendered bullet points
* Responsive, Modern UI
* Simple Error Handling

## Getting Started
### Prerequisites
* Python 3.8+
* Node.js (v18+ recommended)
* [Groq API key](https://console.groq.com/keys)

### Backend setup
```
# Create a virtual environment & install dependencies
cd backend
python -m  venv env
source env/bin/activate # On Windows: .\env\Scripts\activate
pip install -r requirements.txt

# Copy .env.example to .env
cp .env.example .env
# then add your Groq API key
GROQ_API_KEY=replace-with-your-groq-api-key

# To run the backend, use the following command:
uvicorn main:app --reload

```
### Frontend setup
```
# Install dependencies
cd frontend
npm install

# To run the frontend, use the following command:
npm run dev
```

## Testing
1. Run both the backend and the frontend as shown above
2. Paste valid Censys host data JSON directly within the input or utilize the pre-loaded JSON for rapid testing (You can always clear the input to paste new content using the button provided)
3. Optionally, you can also upload a valid Censys host data JSON file
4. Click Summarize and you'll receive a markdown-formatted bullet point summary highlighting the risks, open ports, vulnerabilities, location etc.

## Assumptions, AI Techniques Used, Error Handling
I assumed that the input JSON will follow the Censys host schema as showcased [here](https://docs.censys.com/docs/platform-host-dataset#/). I am also assuming this agent will be utilized by someone with a technical background (sybersecurity analyst), which is reflected in my choice of summarization.

I utilized the [LLaMA 3 70B Versatile](https://console.groq.com/docs/model/llama-3.3-70b-versatile) model via the Groq API for summarizing the JSON fields. It's among the most capable open-weight models today- comparative to OpenAI's GPT 4 model. In the past, I've worked with Claude-2 to simulate a medical chatbot but I found it to be limiting, so I had already done research into other alternatives. I referenced official documentation for React and also consulted ChatGPT throughout the development of the frontend as my primary expertise lies in data processing, transformation and AI/ML modeling and finetuning. For my prompt engineering, I referenced the groq documentation and based on the suggestions included there, I framed the AI as a cybersecurity analyst and emphasized in the instructions to maintain a professional and brief tone and to explicitly return the summary in a bulleted format. The user prompt contains the raw JSON data as well, which keep in line with the best practices outlined in the groq documentation.

For error handling, if a user pastes malformed JSON, the app catches the error and display it as an error message:

``"Unable to summarize data! Please ensure JSON is valid and backend is running!" ``

I also have loading animations which prevent users from editing the input field while a request is in progress. I also have some other simple error-catchers related to parsing errors or groq errors; similar error messages are displayed.

## Future Enhancements
With more time, I would have added more features and improvements to the app, such as:
1. Multi-Host Summarization: At the moment, I support single-host summarization, but I would like to add in high-level insights across many hosts
2. NLP-based risk/threat score: Since I have some NLP experience, I would've liked to classify the security risks and calculate and assign threat scores for them for better understandability
3. Finetune the underlying LLM: Make it more customizable for this specific use-case, which would offer even better summarization
4. Integrate with Censys API: Pull data live from the [Censys API](https://search.censys.io/api) using a key and then it can be a cybersecurity risk monitoring tool as users could enter a domain/IP and then get a summary of the internet-facing risks associated with that host. I'm thinking this would be more useful for security engineers and pentesters rather than general consumers as it lets them quickly assess the exposure of user/client infrastructure.
5.Export Summaries: Create a downloadable pdf of the summaries with actionable items so that the cybersecurity analyst reading the report could really focus on what needs to be assessed/fixed
6. Deployment Improvements: If I was actually deploying this, I would probably use Vercel and Docker for the FastAPI and ensure the layout works on all devices, has some authentication to access such data, add rate limiting to prevent misuse of the API, input sanitization to prevent LLM injections (have done a whole other project addressing this), store logs etc.

I think all of these enhancements could vastly improve the real-world usability and significance of this tool as AI and humans would work hand-in-hand to discover and analyze security risks in a more streamlined manner.

## Video Demo (Click Image To view on YouTube)
[![Video](https://img.youtube.com/vi/jP-j6fG4Xmk/maxresdefault.jpg)](https://www.youtube.com/watch?v=jP-j6fG4Xmk)
