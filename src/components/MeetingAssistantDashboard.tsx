import { type ChangeEvent, type FormEvent, useState } from 'react'
import { Calendar, CheckCircle2, Clock, FileText, Sparkles, Users } from 'lucide-react'
import { AppLayout } from '@/components/AppLayout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { generateMeetingSummary, parseAIResult } from '@/lib/ai'

export function MeetingAssistantDashboard() {
  const [transcript, setTranscript] = useState('')
  const [transcriptFileName, setTranscriptFileName] = useState<string | null>(null)
  const [attendeesInput, setAttendeesInput] = useState('')
  const [meetingDateTime, setMeetingDateTime] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [actionItems, setActionItems] = useState<string[]>([])

  const attendees = attendeesInput
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)

  const formattedMeetingDateTime = (() => {
    if (!meetingDateTime) return ''
    const date = new Date(meetingDateTime)
    if (Number.isNaN(date.getTime())) return meetingDateTime
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  })()

  const handleTranscriptFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setTranscriptFileName(file.name)

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setTranscript(reader.result)
      }
    }
    reader.readAsText(file)
  }

  const handleGenerateSummary = async (e: React.FormEvent) => {
    e.preventDefault()
  
    console.log("Generate button clicked")
  
    setIsGenerating(true)
  
    try {
      const result = await generateMeetingSummary(transcript)
  
      const parsed = parseAIResult(result)
  
      setSummary(parsed.summary)
      setActionItems(parsed.actions)
  
      console.log("AI RESULT:", result)
  
      setHasGenerated(true)
  
    } catch (error) {
      console.error("AI ERROR:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <AppLayout showPhaseNav={false}>
      <div className="max-w-5xl mx-auto space-y-8 py-6">
        {/* Page header */}
        <header className="mb-2 flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700 ring-1 ring-stone-200 dark:bg-stone-900 dark:text-stone-200 dark:ring-stone-800">
              <Sparkles className="h-3.5 w-3.5 text-lime-500 dark:text-lime-400" strokeWidth={1.5} />
              AI workspace
            </div>
            <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            AI Meeting Assistant
            </h1>
            <p className="max-w-2xl text-sm text-stone-600 dark:text-stone-400">
              Provide a transcript and meeting details to generate a polished, shareable summary and
              clear action items.
            </p>
          </div>
        </header>

        <form onSubmit={handleGenerateSummary} className="space-y-6">
          {/* New analysis */}
          <Card>
            <CardHeader className="border-b border-stone-100 pb-4 dark:border-stone-800">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <FileText className="h-4 w-4 text-stone-500 dark:text-stone-400" strokeWidth={1.5} />
                    New Analysis
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Provide meeting details and transcript to generate a professional summary.
                  </CardDescription>
                </div>
                <div className="hidden text-xs text-stone-400 md:block dark:text-stone-500">
                  Only .txt transcripts, up to 10MB.
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <label
                  htmlFor="transcript"
                  className="text-sm font-medium text-stone-800 dark:text-stone-100"
                >
                  Paste Meeting Transcript
                </label>
                <textarea
                  id="transcript"
                  value={transcript}
                  onChange={(event) => setTranscript(event.target.value)}
                  placeholder="Paste the raw transcript text here..."
                  className="min-h-[180px] w-full resize-y rounded-md border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 shadow-sm outline-none ring-0 transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100 dark:focus:ring-stone-100"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.4fr)]">
                {/* Upload */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-stone-800 dark:text-stone-100">
                    Upload .txt File
                  </span>
                  <input
                    id="transcript-file"
                    type="file"
                    accept=".txt"
                    onChange={handleTranscriptFileChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor="transcript-file"
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-stone-300 bg-stone-50/80 px-4 py-6 text-center text-xs text-stone-500 transition hover:border-stone-400 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-stone-500 dark:hover:bg-stone-900/80"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-700">
                      <FileText className="h-4 w-4 text-stone-500 dark:text-stone-300" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-stone-700 dark:text-stone-200">
                        Upload a file or drag and drop
                      </p>
                      <p className="text-[11px] text-stone-500 dark:text-stone-500">
                        Only .txt files up to 10MB
                      </p>
                    </div>
                    {transcriptFileName && (
                      <p className="mt-1 truncate text-[11px] text-stone-500 dark:text-stone-500">
                        Loaded: <span className="font-medium">{transcriptFileName}</span>
                      </p>
                    )}
                  </label>
                </div>

                {/* Attendees + date/time */}
                <div className="grid gap-4 sm:grid-cols-1">
                  <div className="space-y-2">
                    <label
                      htmlFor="attendees"
                      className="text-sm font-medium text-stone-800 dark:text-stone-100"
                    >
                      Meeting Attendees
                    </label>
                    <input
                      id="attendees"
                      type="text"
                      value={attendeesInput}
                      onChange={(event) => setAttendeesInput(event.target.value)}
                      placeholder="e.g. John Doe, Sarah Smith"
                      className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm outline-none ring-0 transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100 dark:focus:ring-stone-100"
                    />
                    <p className="text-xs text-stone-500 dark:text-stone-500">
                      Separate attendees with commas. These will be surfaced in the summary.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="meeting-datetime"
                      className="text-sm font-medium text-stone-800 dark:text-stone-100"
                    >
                      Meeting Date and Time
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-stone-400">
                        <Calendar className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      <input
                        id="meeting-datetime"
                        type="datetime-local"
                        value={meetingDateTime}
                        onChange={(event) => setMeetingDateTime(event.target.value)}
                        className="w-full rounded-md border border-stone-200 bg-white px-9 py-2 text-sm text-stone-900 shadow-sm outline-none ring-0 transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100 dark:focus:ring-stone-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call-to-action */}
          <div className="flex flex-col items-center gap-2 pt-1">
            <Button
              type="submit"
              size="lg"
              disabled={isGenerating}
              className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-2.5 text-sm font-medium text-stone-50 shadow-md shadow-stone-900/10 hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-80 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
            >
              {isGenerating && (
                <span className="h-4 w-4 animate-spin rounded-full border-[2px] border-stone-50 border-t-transparent dark:border-stone-900 dark:border-t-transparent" />
              )}
              Generate Summary
            </Button>
            <p className="text-xs text-stone-500 dark:text-stone-500">
              All processing is simulated in this prototype. No data leaves your browser.
            </p>
          </div>
        </form>

        {/* Results */}
        {hasGenerated && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 text-base">
                <span>AI Meeting Summary</span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                  <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Simulated output
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-stone-900 dark:text-stone-50">
                  <FileText className="h-4 w-4 text-stone-500 dark:text-stone-400" strokeWidth={1.5} />
                  Meeting Summary
                </h2>
                <p className="text-sm text-stone-700 dark:text-stone-300">{summary}</p>
              </div>

              <div className="space-y-2">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-stone-900 dark:text-stone-50">
                  <CheckCircle2
                    className="h-4 w-4 text-stone-500 dark:text-stone-400"
                    strokeWidth={1.5}
                  />
                  Action Items
                </h2>
                <ul className="space-y-1.5">
                  {actionItems.map((item, index) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-stone-700 dark:text-stone-300"
                    >
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border border-stone-400 text-[10px] font-medium text-stone-700 dark:border-stone-500 dark:text-stone-200">
                        {index + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-4 border-t border-dashed border-stone-200 pt-4 text-sm dark:border-stone-800 md:grid-cols-2">
                <div className="space-y-1">
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                    <Users className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Meeting Attendees
                  </h3>
                  {attendees.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {attendees.map((name) => (
                        <span
                          key={name}
                          className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-800 dark:bg-stone-800 dark:text-stone-100"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500 dark:text-stone-500">
                      No attendees captured. Add names in the inputs section to display them here.
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                    <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Meeting Date &amp; Time
                  </h3>
                  {formattedMeetingDateTime ? (
                    <p className="text-sm text-stone-700 dark:text-stone-300">
                      {formattedMeetingDateTime}
                    </p>
                  ) : (
                    <p className="text-xs text-stone-500 dark:text-stone-500">
                      Not specified. Use the date &amp; time picker in the inputs section to record when
                      this meeting occurred.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
