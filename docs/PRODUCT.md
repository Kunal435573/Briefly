# Briefly — PRD and architecture

## Product goal
Turn a rough spoken digital project idea into a usable, editable project brief. The agent should ask focused questions, save concrete answers, accept spoken corrections, and show what remains unknown.

## Feature brainstorm and scope
| Feature | Benefit | Scope |
|---|---|---|
| Guided voice discovery | Start from a vague idea | MVP |
| Live structured updates | Visible action during conversation | MVP |
| Spoken corrections | Fix requirements without restarting | MVP |
| Missing-field cues | Guide useful follow-ups | MVP |
| Editable fields, device save, JSON export | Review and hand off the result | MVP |
| Hindi-English conversation | Relevant to Indian clients | Best-effort provider testing |
| Budget estimates | Needs a verified rate card | Later |
| Client approval/version history | Needs accounts and hosted storage | Later |
| Email/CRM delivery | Needs authentication and explicit permission | Later |

## Users and success
Primary users are freelancers and agencies running discovery calls; secondary users are founders clarifying their ideas. Success is a 3–5 minute conversation producing a brief with a problem, audience, platform, features and remaining unknowns. The defining demo is changing “mobile app” to “mobile-friendly website” by voice while preserving other fields.

## Acceptance criteria
1. Live speech works with a valid AssemblyAI key and microphone permission. The browser shows transcription and spoken replies.
2. Agent calls `update_brief` when explicit details are provided. Partial updates leave unrelated fields intact. Unsupported values are rejected.
3. The user can edit all ten fields manually. Changes survive refresh on the same device and export to valid JSON.
4. Missing fields remain visible. The agent never fabricates budget, deadline or delivery promises.
5. API key remains server-side. Failure to get a token or microphone permission shows a useful message without blocking manual editing.

## App flow
Open workspace → start voice → microphone permission and short-lived token → agent asks one question at a time → `update_brief` tool edits brief → spoken correction overwrites its field → edit or review missing fields → end call → export JSON. Without credentials, load an example and use manual fields/export.

## Tech stack
Node.js 20+ HTTP server with no runtime dependencies; HTML/CSS/JS browser client; AssemblyAI Voice Agent WebSocket; AudioWorklet resampling microphone audio to PCM16 24 kHz; localStorage for device-local brief persistence. Browser audio playback decodes PCM16 at 24 kHz. The provider receives audio and conversation context while connected.

## Frontend structure
`public/index.html` is the responsive two-panel workspace. `public/style.css` defines the visual system. `public/app.js` holds state, transcripts, WebSocket events, tool results, editing and export. `public/pcm-processor.js` resamples microphone input. `brief.js` is shared schema and patch validation.

## Backend structure
`server.js` serves allowlisted static files, reports key availability, and creates a single-use temporary voice token via `/api/voice-token`. `.env` holds the private AssemblyAI key. There is no user database; brief data stays on the user's device.

## Tool contract and failure behavior
`update_brief` accepts a partial object of ten string fields, each at most 1,000 characters. It saves only provided fields and returns updated and missing keys. Unknown fields and malformed data are rejected. Token errors, mic denial and provider disconnect retain the local brief. Outside localhost, microphone access needs HTTPS. Public deployment needs authentication or rate limiting to control paid provider usage.

## Demo script
“I run a small restaurant. I need an app so regulars can reserve tables.” Then: “Actually, start with a mobile-friendly website, not an app.” Finally: “Keep the design warm and measure success by fewer missed bookings.” Show real field changes, edit one field, and export JSON. Test this with a real provider session before submitting.

## BugTalk mode extension
Briefly now has two independent voice workflows in one workspace: **Project brief** and **BugTalk**. The mode selector changes the agent prompt, tool contract, live document fields and export filename. Switching modes preserves both locally saved documents and is disabled during a live call so an in-flight tool cannot update the wrong document.

BugTalk captures a bug title, product or page, device and browser, reproduction steps, expected and actual results, frequency, user impact, and observed error/evidence. It asks for missing facts one at a time, accepts spoken corrections, allows manual editing, and exports a JSON bug ticket. The agent does not claim to reproduce or fix a bug. The ticket is a reporter's account, not a verified diagnosis. Attachments, screen capture, issue tracker integration and automatic severity are future work.

BugTalk demo: “On my restaurant booking page, the Book button does nothing on Android Chrome.” Answer follow-up questions about steps and expected behavior. Correct the environment aloud: “Actually, I was using iPhone Safari.” Show the environment update without losing the other fields, then export the ticket. Return to Project brief and show its data is still intact.

## ScopeCheck change proposals and tasks
ScopeCheck is a third mode. It reads the saved Project Brief as reference when a voice session starts. Its `update_scope` tool captures only proposed changes: request, reason, affected feature, follow-up tasks, timeline impact, budget impact and open questions. No `update_brief` tool is available in ScopeCheck. The original brief is not edited automatically.

The user can refine the change draft, click **Save proposal**, and create another. Each saved proposal has a `proposed` status and a snapshot of the project name, platform, features, deadline and budget at proposal time. At most 20 proposals are stored locally, newest first. The ScopeCheck JSON export contains the current project brief, unsaved draft and saved proposals. The user can review changes outside the app; approval workflow, task assignments and merge into the original brief are not implemented.

Acceptance demo: create a project brief with “website, menu”. Switch to ScopeCheck, say “The client wants table booking; we need to clarify capacity and build a booking form.” Save a proposal. Return to the Project Brief: its features must still say “menu”. Export ScopeCheck JSON and confirm the proposal contains its own tasks and baseline.

## Structured prompt output
The user can generate a readable prompt from each mode's current document. Project Brief creates a build prompt with discovery facts, MVP planning instructions, feasibility review and missing questions. BugTalk creates an investigation prompt that distinguishes observations from diagnosis. ScopeCheck creates a proposed change review using the original brief as reference. The prompt appears after a voice session ends if any facts exist, and can also be generated on demand, edited, copied, or downloaded as `.txt`. JSON export remains available. `prompt.js` is a deterministic formatter: it does not call another model or invent requirements. Editing a field hides the old preview until regenerated.

## Five Markdown deliverables
Project Brief mode now generates actual draft files from captured facts: PRD, app flow, tech stack, frontend guidelines, and backend structure. The generator is deterministic (`docs-generator.js`) and treats stack, screens, entities, and endpoints as proposals for review. It includes an explicit feasibility checkpoint for the client's budget and timeline. The browser previews each editable file and offers individual `.md` downloads or a single ZIP (`zip-store.js`, store method, CRC32). The Voice Agent need only save structured facts; it does not recite the documents aloud. The prior project prompt has been superseded in the UI, while BugTalk and ScopeCheck prompt exports remain.
