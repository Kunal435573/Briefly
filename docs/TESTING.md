# Briefly manual test run

Use Chrome or Edge on `http://localhost:3000`. Keep the Node server running. Do not expose the AssemblyAI key in screenshots.

## Confirm this build is running
In the project folder, open `public/index.html` and search for `Generate documents`. The button must appear beside Export JSON in Project Brief mode. If it does not, replace the older project files with the newest ZIP, keep `.env`, restart `npm start`, and hard-refresh the page (`Ctrl+Shift+R`).

## 1. Project Brief: capture, correction, prompt
1. Start a call and say: “I run Balti Boys, a restaurant. We need a mobile-friendly website where people can scan a QR code to see the menu and order at their table.”
2. Confirm Project name, Business, Platform, and Key features update on the right. The agent should ask about a missing detail rather than inventing it.
3. Say: “Correction: customers will order through the site, but we are not taking online payments in the first version.” Confirm the feature field reflects this correction and the other fields remain.
4. End the call. Five Markdown documents should appear below both panels. You can also click **Generate documents**. Switch through PRD, App Flow, Tech Stack, Frontend Guidelines, and Backend Structure; verify the reported facts and marked recommendations. Edit one document and download its `.md`, then download the ZIP and check all five files.
5. Reload. The Project Brief fields should remain.

## 2. BugTalk: real ticket and correction
1. End any current call, then switch to BugTalk.
2. Say: “On the Balti Boys menu page, tapping Add to order does nothing on Android Chrome.”
3. Supply follow-up steps and expected result. Confirm the right panel records reporter observations, not a guessed cause.
4. Say: “Correction: it happened on iPhone Safari.” Only Device and browser should change.
5. End the call, generate the bug investigation prompt, and export JSON. Check actual/expected behavior and steps.

## 3. ScopeCheck: proposal without altering the brief
1. Switch to Project Brief and note the existing feature text.
2. Switch to ScopeCheck. Say: “The client now wants table bookings. First clarify capacity rules, then build the booking form. We have not agreed on a new deadline or budget.”
3. Confirm Requested change and Follow-up tasks update; timeline and budget must not be invented.
4. Click **Save proposal**. Confirm a proposal appears in Saved proposals.
5. Return to Project Brief. Its original features must still be unchanged. Export ScopeCheck JSON and check that baseline and proposal are separate.

## 4. Failures and limits
- Without a key: Start voice should explain how to configure `.env`; manual editing and export should still work.
- Deny microphone: the app should show an error and preserve fields.
- Empty brief: Generate prompt should request at least one detail rather than fabricate content.
- Switching modes during a live call should be disabled.
- Do not claim the agent truly verified a bug, approved a change, or built the requested product.

Record the successful real voice run, the visible field changes, the generated prompt, and export for the hackathon demo.
