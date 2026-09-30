export const labels={projectName:'Project name',business:'Business',audience:'Audience',problem:'Problem',platform:'Platform',features:'Key features',budget:'Budget',deadline:'Timeline',style:'Visual direction',success:'Success measure'};
export const empty=()=>Object.fromEntries(Object.keys(labels).map(k=>[k,'']));
export function applyPatch(brief,patch){if(!patch||typeof patch!=='object'||Array.isArray(patch))throw Error('Expected an object');const next={...brief};for(const [key,value] of Object.entries(patch)){if(!(key in labels)||typeof value!=='string'||value.length>1000)throw Error(`Invalid field: ${key}`);next[key]=value.trim();}return next;}
export const missing=brief=>Object.keys(labels).filter(key=>!brief[key]);
export const bugLabels={title:'Bug title',product:'Product or page',environment:'Device and browser',steps:'Steps to reproduce',expected:'Expected result',actual:'Actual result',frequency:'Frequency',impact:'User impact',evidence:'Evidence or error'};
export const emptyBug=()=>Object.fromEntries(Object.keys(bugLabels).map(key=>[key,'']));
export function applyBugPatch(bug,patch){if(!patch||typeof patch!=='object'||Array.isArray(patch))throw Error('Expected an object');const next={...bug};for(const [key,value] of Object.entries(patch)){if(!(key in bugLabels)||typeof value!=='string'||value.length>1000)throw Error(`Invalid bug field: ${key}`);next[key]=value.trim();}return next;}
export const missingBug=bug=>Object.keys(bugLabels).filter(key=>!bug[key]);
export const scopeLabels={request:'Requested change',reason:'Why it is needed',affected:'Affected feature',tasks:'Follow-up tasks',timelineImpact:'Timeline impact',budgetImpact:'Budget impact',questions:'Open questions'};
export const emptyScope=()=>Object.fromEntries(Object.keys(scopeLabels).map(key=>[key,'']));
export function applyScopePatch(scope,patch){if(!patch||typeof patch!=='object'||Array.isArray(patch))throw Error('Expected an object');const next={...scope};for(const [key,value] of Object.entries(patch)){if(!(key in scopeLabels)||typeof value!=='string'||value.length>1000)throw Error(`Invalid scope field: ${key}`);next[key]=value.trim();}return next;}
export const missingScope=scope=>Object.keys(scopeLabels).filter(key=>!scope[key]);
export function makeProposal(scope,brief,createdAt){if(!scope.request?.trim())throw Error('Add a requested change before saving');return{createdAt,baseline:{projectName:brief.projectName,platform:brief.platform,features:brief.features,deadline:brief.deadline,budget:brief.budget},change:applyScopePatch(emptyScope(),scope),status:'proposed'};}
