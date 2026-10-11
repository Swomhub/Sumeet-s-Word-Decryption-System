# Sumeet's Word Decryption System

**Decode the meaning behind every word.** Understand slang, phrases and everyday conversations across English, Hinglish, Hindi and Marathi.

![Built with Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Powered by Gemini](https://img.shields.io/badge/Gemini%20AI-Powered-purple)

## Features

- 🔍 **Multi-language decoding** — English, Hindi, Marathi, Hinglish, and Romanized scripts
- 🤖 **AI-powered** — Uses Google Gemini for accurate, context-aware translations
- 💡 **Meaning, Translation & Transliteration** modes
- 🎨 **Premium dark UI** with responsive design
- ⚡ **Fast** — Server-side API with rate limiting and validation

## Quick Start

```bash
# Install dependencies
npm install

# Add your Gemini API key
# Create a file called .env.local in the root and add:
# GEMINI_API_KEY=your_key_here

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key ([Get one here](https://aistudio.google.com/apikey)) |

## Deployment

This app is ready for Vercel deployment:

1. Push to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Add `GEMINI_API_KEY` in Vercel Environment Variables
4. Deploy

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Google Gemini AI**

---

Built with ❤️ by Sumeet
