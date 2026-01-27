# Fly Your Tech - AI Chatbot Assessment

This is a full-stack AI-powered chatbot built for the fictional company "Fly Your Tech". 
It features tool-based decision making using LangChain and LangGraph.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express, LangChain JS, LangGraph JS
- **AI**: Gemini 1.5 Flash (via Google Generative AI)
- **Database**: JSON (simulated) / MongoDB (optional support)

## Core Features
### 1. Tool Call Reasoning
The chatbot uses **LangGraph** to manage the state and decision-making flow. When a user asks a question, the LLM determines if it needs to call a tool or reply directly.

### 2. Mandatory Tools
- **Knowledge Base Tool**: Fetches company data (address, services, pricing) from `backend/data/company_info.json`.
- **Lead Management Tool**: Allows reading and creating leads stored in `backend/data/leads.json`.
- **Scheduling Tool**: A dummy tool that simulates scheduling a meeting and returns a confirmation.

### 3. Premium UI
A modern, dark-themed chat interface with:
- Glassmorphism effects
- Smooth animations (Framer Motion)
- Responsive design
- Interactive elements

## Setup Instructions

### Backend
1. Navigate to `backend/`
2. Create a `.env` file based on `.env.example`.
3. Add your `GOOGLE_API_KEY` (Get one from [Google AI Studio](https://aistudio.google.com/)).
4. Run:
   ```bash
   npm install
   npm start
   ```

### Frontend
1. Navigate to `frontend/`
2. Run:
   ```bash
   npm install
   npm run dev
   ```

## Chatbot Flow
1. **Input**: User sends a query (e.g., "What services do you offer?").
2. **Graph Start**: The LangGraph starts at the `agent` node.
3. **LLM Decision**: The LLM (Gemini) decides to call `knowledge_base`.
4. **Tool Execution**: The `tools` node executes the function and returns data.
5. **Final Response**: The LLM receives the tool output and generates a friendly response for the user.
6. **Output**: The user sees the final answer in the sleek UI.
