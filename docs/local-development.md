# JayTech AI — Local Development & Deployment Guide

## 1. Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- (Optional) Docker & Docker Compose for containerized execution

### Environment Variables
Copy `.env.example` to `.env`:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=development
```

### Running Locally
```bash
# Install dependencies
npm install

# Start full-stack dev server (Express API + Vite Dev Server on port 3000)
npm run dev

# Run automated test suite
npm test

# Build production bundle
npm run build
```

## 2. Docker Execution
```bash
# Start all containerized services
docker compose up -d --build
```
Open your browser at `http://localhost:3000`.
