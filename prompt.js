import {labels,bugLabels,scopeLabels,missing} from './brief.js';

const value = (record,key) => record[key]?.trim() || 'Not specified';
const facts = (record,fields) => Object.entries(fields).map(([key,label])=>`- ${label}: ${value(record,key)}`).join('\n');

export function projectPrompt(brief){
  if(!Object.values(brief).some(v=>v?.trim())) throw Error('Capture at least one project detail first.');
  const unknown=missing(brief).map(key=>labels[key]);
  return `# Project build prompt — ${value(brief,'projectName')}

## 1. Your role and objective
Act as a senior product manager, UX designer, and full-stack engineer. Turn the discovery notes below into a scoped, buildable MVP. If a repository is supplied, inspect it before implementing. Distinguish facts from proposals and never claim a feature is complete until tested.

## 2. Client-provided facts
${facts(brief,labels)}

## 3. Required output, in this order
### A. Product definition
- One-paragraph problem statement, target users, and the outcome the product should achieve.
- Confirmed requirements versus assumptions, explicitly labeled.

### B. MVP scope
- Must-have features, optional features, and out-of-scope items.
- Explain how each must-have connects to the stated problem and success measure.
- If the stated budget or timeline is unrealistic, propose a smaller MVP and show the trade-offs. Do not silently change the client's constraints.

### C. User experience
- Key user journeys from entry to successful completion, including errors and empty states.
- Page/screen map with purpose, content, and primary action for each screen.
- Visual direction based on the notes; include responsive and accessibility considerations.

### D. Technical design
- Recommended stack with a short rationale.
- Frontend components and state; backend endpoints, data model, validation, and integrations.
- Authentication, privacy, security, deployment, and credential needs where relevant.
- Mark architecture choices as proposals when they were not supplied by the client.

### E. Delivery plan
- Small implementation milestones in dependency order.
- Testable acceptance criteria for each must-have feature.
- Test plan covering core flow, mobile behavior, errors, and the stated success measure.
- Risks, dependencies, and what cannot be verified without client access or credentials.

### F. Questions for the client
${unknown.length?unknown.map(item=>`- Confirm ${item}.`).join('\n'):'- Reconfirm the captured details and ask only questions that block implementation.'}

## 4. Working rules
Ask concise questions about blocking unknowns. Keep estimates clearly labeled as estimates. Do not invent requirements, data, integrations, or test results. Provide the plan first; if implementation is requested and a repository is available, build the MVP and report what actually passed.`;
}

export function bugPrompt(bug){
  if(!Object.values(bug).some(v=>v?.trim())) throw Error('Capture at least one bug detail first.');
  return `# Bug investigation: ${value(bug,'title')}\n\nYou are a senior developer investigating a user-reported issue. Treat the report as observations, not a verified diagnosis.\n\n## Reporter notes\n${facts(bug,bugLabels)}\n\n## Investigation request\n1. Reproduce the issue using the reported steps and environment if access is available.\n2. Separate observed facts, hypotheses, and unknowns. Ask for missing reproduction details.\n3. Identify the likely cause with evidence from code or logs.\n4. Propose the smallest safe fix and meaningful regression test.\n5. Implement only after verifying the cause; report what you tested and what remains unverified.\n\nDo not invent an error message, claim reproduction without testing, or mark this fixed from the report alone.`;
}

export function scopePrompt(scope,brief,proposals=[]){
  if(!Object.values(scope).some(v=>v?.trim())&&!proposals.length) throw Error('Capture a change request or save a proposal first.');
  const change=Object.values(scope).some(v=>v?.trim())?scope:proposals[0].change;
  return `# Scope change review: ${value(change,'request')}\n\nYou are a senior product manager and technical lead. Evaluate this proposed change against the agreed project brief. It is a proposal, not an approved requirement.\n\n## Existing project baseline\n${facts(brief,labels)}\n\n## Proposed change\n${facts(change,scopeLabels)}\n\n## What I need from you\n1. Describe the difference between the current scope and the new request.\n2. Break the change into concrete follow-up tasks and acceptance criteria.\n3. List dependencies and open questions; assess timeline and budget effects without making up estimates.\n4. Suggest a decision record with options: accept, defer, or reject, and what each means for the original plan.\n\nDo not alter the original brief or claim the change has been approved.`;
}

export function generatePrompt(mode,documents,proposals=[]){
  if(mode==='project') return projectPrompt(documents.project);
  if(mode==='bug') return bugPrompt(documents.bug);
  if(mode==='scope') return scopePrompt(documents.scope,documents.project,proposals);
  throw Error('Unknown mode');
}
