# Design OS (Extended Prototype)

A **product design and planning workspace** that bridges the gap between product ideas and implementation.

This repository extends the original **Design OS** concept with an experimental **AI Meeting Assistant prototype**, demonstrating how AI can assist teams in summarizing meetings and extracting actionable insights from transcripts.

The goal is to explore how **AI-assisted product workflows** can support planning, design, and team collaboration.

---

# Overview

Design OS provides a structured workflow for defining a product before writing code.

Instead of jumping directly into implementation, the system guides you through a step-by-step process:

1. **Product Definition**  
   Define the product vision and identify core problems.

2. **Data Shape Modeling**  
   Describe how data should be structured in the application.

3. **Design System Setup**  
   Configure colors, typography, and application layout.

4. **Feature Section Design**  
   Design feature flows and UI screens.

5. **Export & Implementation Handoff**  
   Prepare artifacts that can be used for development.

This repository also includes a **prototype AI Meeting Assistant** that can summarize meeting transcripts and extract action items.

---

# AI Meeting Assistant (Prototype)

The AI Meeting Assistant allows users to:

- Upload or paste meeting transcripts  
- Process `.vtt` transcript files  
- Generate AI summaries  
- Extract actionable tasks from discussions  

This feature uses the **OpenAI API** to analyze transcripts and produce structured outputs.

Example output:

```
Meeting Summary
The team discussed progress on modules 1–5 and aligned priorities for upcoming integration work.

Action Items
1. Ensure modules 1–5 are completed by end of April
2. Integrate feedback from SBU
3. Conduct testing for new features
```

---

# Tech Stack

This project is built with:

- React
- TypeScript
- Vite
- TailwindCSS
- OpenAI API

---

# Installation

Clone the repository:

```bash
git clone https://github.com/artpinkkan/design-os.git
cd design-os
```

Install dependencies:

```bash
npm install
```

---

# Environment Setup

Create an `.env` file in the root directory:

```
VITE_OPENAI_API_KEY=your_openai_api_key
```

You can generate an API key at:

https://platform.openai.com/api-keys

---

# Run the Development Server

Start the application:

```bash
npm run dev
```

The app will run at:

```
http://localhost:3000
```

---

# Using the AI Meeting Assistant

1. Navigate to the **AI Meeting Assistant** page
2. Paste a meeting transcript or upload a `.vtt` file
3. Click **Generate Summary**
4. The AI will produce:

- Meeting Summary
- Action Items

---

# Example Transcript Format

The system works best with transcripts formatted like:

```
Andre: We need to finalize module 5 by April.
Sarah: Integration testing should begin next week.
```

`.vtt` transcripts will automatically be cleaned before processing.

---

# Project Structure

```
src
 ├ components
 │   └ MeetingAssistantDashboard.tsx
 │
 ├ lib
 │   └ ai.ts
 │
 ├ assets
 └ main.tsx
```

Important modules:

**ai.ts**  
Handles OpenAI integration and transcript processing.

**MeetingAssistantDashboard.tsx**  
Main UI for transcript input and summary generation.

---

# Future Improvements

Planned improvements for this prototype include:

- Speaker-aware transcript parsing  
- Topic segmentation for meetings  
- AI-powered Q&A about meeting discussions  
- Export meeting summaries to PDF / Notion  
- Real-time meeting summarization  

---

# Acknowledgements

This project builds on the original **Design OS concept by Brian Casel**.

Original repository:  
https://github.com/buildermethods/design-os

---

# License

MIT License