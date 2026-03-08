import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

function cleanVTT(text: string) {
    return text
      .replace(/WEBVTT/g, "")
      .replace(/\d{2}:\d{2}:\d{2}\.\d{3} --> .*/g, "")
      .replace(/<v.*?>/g, "")
      .replace(/<\/v>/g, "")
      .trim();
  }

  export async function generateMeetingSummary(transcript: string) {
    const cleanedTranscript = cleanVTT(transcript);
  
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
      You are an AI meeting assistant.
      
      Analyze the meeting transcript and return the result EXACTLY in this structure:
      
      SUMMARY:
      Write a short paragraph summarizing the meeting.
      
      KEY POINTS:
      - point
      - point
      
      ACTION ITEMS:
      - action
      - action
      
      DECISIONS:
      - decision
      
      Do not add markdown like ### or **.
      Do not change the section titles.
      `
        },
        {
          role: "user",
          content: transcript
        }
      ]
    });
  
    return response.choices[0].message.content ?? "";
  }

  export function parseAIResult(text: string) {
    const sections = {
      summary: "",
      points: [] as string[],
      actions: [] as string[],
      decisions: [] as string[]
    }
  
    const lines = text.split("\n")
  
    let current = ""
  
    for (const line of lines) {
        const l = line.toUpperCase()
      
        if (l.includes("SUMMARY")) {
          current = "summary"
      
          const parts = line.split(":")
          if (parts.length > 1) {
            sections.summary += parts.slice(1).join(":").trim() + " "
          }
        }
      
        else if (l.includes("KEY POINTS")) current = "points"
        else if (l.includes("ACTION ITEMS")) current = "actions"
        else if (l.includes("DECISIONS")) current = "decisions"
      
        else if (line.trim().startsWith("-")) {
          if (current === "points" || current === "actions" || current === "decisions") {
            sections[current].push(line.replace("-", "").trim())
          }
        }
      
        else if (current === "summary") {
          sections.summary += line + " "
        }
      }
  
    return sections
  }