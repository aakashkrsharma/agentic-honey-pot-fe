# 🕵️ Scam Honeypot (Frontend)

A React-based frontend for the Scam Honeypot project. Users can interact with the app to detect scam attempts and extract intelligence.

## Live Demo

Try it here: [🕵️ Scam Honeypot](https://aakashkrsharma.github.io/agentic-honey-pot-fe/)

## Features

- Send messages and interact with the honeypot.
- Detect scams in conversations.
- View extracted intelligence like UPI IDs, bank accounts, and phishing URLs.
- Start new sessions with a single click.

## Getting Started (Local Development)

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

1. Clone the repository:

```bash
git clone https://github.com/<username>/<repo-name>.git
cd <repo-name>
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file in the root directory:
```bash
REACT_APP_API_URL=https://your-backend-url/api/honeypot/message
REACT_APP_API_KEY=your-api-key
```

### Running Locally

```bash
npm start
```

This will start the app at http://localhost:3000

### Building for Production

```bash
npm run build
```

### Deploying to GitHub Pages

```bash
npm run deploy
```
