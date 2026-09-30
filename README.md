# Briefly

**Speak your idea. Leave with a build-ready brief.** A voice-led project discovery app for freelancers, agencies and founders. AssemblyAI handles the live conversation; a client-side `update_brief` tool turns spoken details and corrections into editable fields.

## Run

Requires Node.js 20+ and an AssemblyAI API key with Voice Agent API access.

```bash
cp .env.example .env
# Put your actual ASSEMBLYAI_API_KEY in .env
npm start
```

Open http://localhost:3000 in Chrome or Edge and allow microphone access. For deployment, use HTTPS. The example brief, manual editing and JSON export work without a key. `npm test` runs the contract and token endpoint tests. Real voice interaction needs your own key, provider access, microphone and quota.

See [the PRD, app flow and architecture](docs/PRODUCT.md).

## Current limits

The saved brief is device-local. It has no account, hosted database, collaboration or public rate limiting. Spoken Hindi-English behavior and end-to-end tool calls require a live provider test before making claims in a demo. Protect a publicly deployed instance from untrusted traffic because voice sessions incur usage.

## BugTalk mode

Select **BugTalk** above the workspace to interview a user about a website or app issue. The agent builds a separate nine-field bug ticket with reproduction steps, expected/actual results and environment. Spoken corrections update the relevant field. Edit the ticket manually or export `briefly-bug-ticket.json`. Switch back to **Project brief** to continue the original document. Switching is disabled during a live voice session.

## ScopeCheck mode

Select **ScopeCheck** to discuss new client requests against the saved Project Brief. It captures a proposed change, reason, affected feature, follow-up tasks and known impacts. Click **Save proposal** to put the draft into local proposal history. The original Project Brief is never updated automatically. Export `briefly-scope-proposals.json` for the original brief, current draft and saved proposals. Proposals are for review and are not approved or merged by the app.

## Setup step by step

1. Extract the ZIP and open the `briefly` folder in VS Code or a terminal.
2. Install Node.js 20 or newer if needed. Run `node --version` to check. This project has no package dependencies, so `npm install` is optional.
3. Sign in to AssemblyAI, create an API key, and confirm that your account can use its Voice Agent API.
4. Copy `.env.example` to `.env` inside `briefly`. Replace `your_key_here` with your own key after `ASSEMBLYAI_API_KEY=`. Never commit or share `.env`.
5. Run `npm start`. Open `http://localhost:3000` in Chrome or Edge on the same computer.
6. Allow microphone access. Choose **Project brief**, **BugTalk**, or **ScopeCheck**, then click **Start voice conversation**. Finish the call with **End conversation**. ScopeCheck works best after you fill the Project Brief first.
7. Edit fields if needed, click **Save proposal** in ScopeCheck, and use **Export JSON** to download the current document.
8. Run `npm test` for local contract checks. For a hackathon demo, also test a real voice call and spoken correction with your key.

If you see “Add ASSEMBLYAI_API_KEY”, check that `.env` is in the `briefly` folder and restart the server. If microphone access fails, use `localhost` or HTTPS and allow site permission. If the provider rejects a token, check the key and Voice Agent API access.

## Generate five project documents

In **Project brief**, click **Generate documents** or end the voice call after capturing details. The app creates five separate, editable Markdown drafts: `PRD.md`, `APP_FLOW.md`, `TECH_STACK.md`, `FRONTEND_GUIDELINES.md`, and `BACKEND_STRUCTURE.md`. Select a tab to review or edit its contents, download that `.md` file, or download all five as `briefly-project-documents.zip`. Changes to a field hide the prior document preview; generate again to refresh from the latest facts. Recommendations are explicitly marked as proposals; missing facts stay unspecified. No external model or server call is made for the document formatting.

**BugTalk** and **ScopeCheck** still offer a text prompt and JSON export. They do not generate the five project design files.

For a complete voice and UI check before submitting, follow [the manual testing script](docs/TESTING.md).
