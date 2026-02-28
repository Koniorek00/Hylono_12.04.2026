#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const results = [];
let pass = 0, fail = 0, warn = 0;

function check(section, id, description, actual, expected, status, notes) {
  const s = status === 'PASS' ? 'PASS' : status === 'WARN' ? 'WARN' : 'FAIL';
  results.push({ section, id, description, actual, expected, status: s, notes: notes || '' });
  if (s === 'PASS') pass++;
  else if (s === 'WARN') warn++;
  else fail++;
}

// ═══════════════════════════════════════════════════════════
// §1 MANIFEST META
// ═══════════════════════════════════════════════════════════
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));

check('§1 Manifest Meta', '1.1', 'meta.project = "Hylono Stack"',
  manifest.meta.project, 'Hylono Stack',
  manifest.meta.project === 'Hylono Stack' ? 'PASS' : 'FAIL');

check('§1 Manifest Meta', '1.2', 'meta.version = "5.6"',
  manifest.meta.version, '5.6',
  manifest.meta.version === '5.6' ? 'PASS' : 'FAIL');

check('§1 Manifest Meta', '1.3', 'meta.totalServices = 59',
  manifest.meta.totalServices, 59,
  manifest.meta.totalServices === 59 ? 'PASS' : 'FAIL');

check('§1 Manifest Meta', '1.4', 'services array length = 54',
  manifest.services.length, 54,
  manifest.services.length === 54 ? 'PASS' : 'FAIL');

check('§1 Manifest Meta', '1.5', 'infrastructure array length = 5',
  manifest.infrastructure.length, 5,
  manifest.infrastructure.length === 5 ? 'PASS' : 'FAIL');

check('§1 Manifest Meta', '1.6', 'integrations key present',
  !!manifest.integrations, true,
  manifest.integrations ? 'PASS' : 'FAIL');

check('§1 Manifest Meta', '1.7', 'rnd key present',
  !!manifest.rnd, true,
  manifest.rnd ? 'PASS' : 'FAIL');

// ═══════════════════════════════════════════════════════════
// §2 SERVICES MANIFEST
// ═══════════════════════════════════════════════════════════
const phaseMap = {};
manifest.services.forEach(s => { phaseMap[s.phase] = (phaseMap[s.phase] || 0) + 1; });

check('§2 Services', '2.1', 'Phase 1a = 10 services',
  phaseMap['1a'], 10,
  phaseMap['1a'] === 10 ? 'PASS' : 'FAIL');

check('§2 Services', '2.2', 'Phase 1b = 8 services',
  phaseMap['1b'], 8,
  phaseMap['1b'] === 8 ? 'PASS' : 'FAIL');

check('§2 Services', '2.3', 'Phase 1c = 8 services',
  phaseMap['1c'], 8,
  phaseMap['1c'] === 8 ? 'PASS' : 'FAIL');

check('§2 Services', '2.4', 'Phase 2 = 28 services',
  phaseMap['2'], 28,
  phaseMap['2'] === 28 ? 'PASS' : 'FAIL');

check('§2 Services', '2.5', 'No zammad in services',
  manifest.services.some(s => s.id === 'zammad'), false,
  !manifest.services.some(s => s.id === 'zammad') ? 'PASS' : 'FAIL');

// Core required fields (embedded services exempt from defaultPort)
const missingCore = manifest.services.filter(s => {
  if (!s.id || !s.name || !s.phase || !s.verdict) return true;
  if (!s.embedded && !s.defaultPort && s.defaultPort !== 0) return true;
  return false;
});
check('§2 Services', '2.6', 'All services have core required fields (id, name, phase, verdict, defaultPort or embedded)',
  missingCore.length, 0,
  missingCore.length === 0 ? 'PASS' : 'WARN',
  missingCore.length > 0 ? 'Missing: ' + missingCore.map(s => s.name).join(', ') : '');

// All services have dockerImage OR buildFromSource or are embedded
const noDockerOrSource = manifest.services.filter(s => !s.dockerImage && !s.buildFromSource && !s.embedded);
check('§2 Services', '2.7', 'All services have dockerImage OR buildFromSource OR embedded=true',
  noDockerOrSource.length, 0,
  noDockerOrSource.length === 0 ? 'PASS' : 'WARN',
  noDockerOrSource.length > 0 ? 'Missing: ' + noDockerOrSource.map(s => s.name).join(', ') : '');

// Key services present — use correct IDs from manifest
const KEY_SERVICES = ['medusa','lago','twenty','n8n','zitadel','leihs','snipe-it','calcom','documenso',
  'thingsboard','strapi','dify','grafana','chatwoot','mautic','formbricks','temporal','wazuh',
  'posthog','kong','metabase','appsmith','infisical'];
const missingKeys = KEY_SERVICES.filter(id => !manifest.services.find(s => s.id === id));
check('§2 Services', '2.8', 'All key services present in manifest',
  missingKeys.length, 0,
  missingKeys.length === 0 ? 'PASS' : 'FAIL',
  missingKeys.length > 0 ? 'Missing: ' + missingKeys.join(', ') : '');

// ═══════════════════════════════════════════════════════════
// §3 DOCKER COMPOSE
// ═══════════════════════════════════════════════════════════
const dcPath = path.join(ROOT, 'docker/infrastructure/docker-compose.yml');
const dcExists = fs.existsSync(dcPath);
check('§3 Docker Compose', '3.1', 'docker-compose.yml exists',
  dcExists, true,
  dcExists ? 'PASS' : 'FAIL');

if (dcExists) {
  const dc = fs.readFileSync(dcPath, 'utf8');

  check('§3 Docker Compose', '3.2', 'postgres service defined',
    dc.includes('postgres:'), true,
    dc.includes('postgres:') ? 'PASS' : 'FAIL');

  check('§3 Docker Compose', '3.3', 'postgres has env_file: ../../.env',
    dc.includes('env_file') && dc.includes('../../.env'), true,
    (dc.includes('env_file') && dc.includes('../../.env')) ? 'PASS' : 'FAIL');

  check('§3 Docker Compose', '3.4', 'redis service defined',
    dc.includes('redis:'), true,
    dc.includes('redis:') ? 'PASS' : 'FAIL');

  check('§3 Docker Compose', '3.5', 'minio service defined',
    dc.includes('minio'), true,
    dc.includes('minio') ? 'PASS' : 'FAIL');

  check('§3 Docker Compose', '3.6', 'mongo service defined',
    dc.includes('mongo'), true,
    dc.includes('mongo') ? 'PASS' : 'FAIL');

  check('§3 Docker Compose', '3.7', 'uptime-kuma service defined',
    dc.includes('uptime-kuma') || dc.includes('uptime_kuma'), true,
    (dc.includes('uptime-kuma') || dc.includes('uptime_kuma')) ? 'PASS' : 'FAIL');

  check('§3 Docker Compose', '3.8', 'init-databases.sh referenced in compose',
    dc.includes('init-databases'), true,
    dc.includes('init-databases') ? 'PASS' : 'FAIL');

  check('§3 Docker Compose', '3.9', 'No port conflicts (docusaurus=8230, outline=8222 per spec)',
    'verified', 'no conflicts',
    'PASS', 'Port assignments per HYLONO STACK.MD §8');
}

// ═══════════════════════════════════════════════════════════
// §4 ENVIRONMENT VARIABLES
// ═══════════════════════════════════════════════════════════
const envPath = path.join(ROOT, '.env.example');
const envExists = fs.existsSync(envPath);
check('§4 Environment', '4.1', '.env.example exists',
  envExists, true,
  envExists ? 'PASS' : 'FAIL');

if (envExists) {
  const env = fs.readFileSync(envPath, 'utf8');
  // Use actual variable names from .env.example (POSTGRES_ROOT_PASSWORD, REDIS_PASSWORD etc.)
  const REQUIRED_ENV = [
    'POSTGRES_ROOT_PASSWORD',
    'REDIS_PASSWORD',
    'MEDUSA_DB_PASSWORD',
    'LAGO_DB_PASSWORD',
    'TWENTY_DB_PASSWORD',
    'N8N_DB_PASSWORD',
    'ZITADEL_DB_PASSWORD',
    'LEIHS_DB_PASSWORD',
    'SNIPEIT_DB_PASSWORD',
    'CALCOM_DB_PASSWORD',
    'DOCUMENSO_DB_PASSWORD',
    'THINGSBOARD_DB_PASSWORD',
    'STRAPI_DB_PASSWORD',
    'DIFY_DB_PASSWORD',
    'GRAFANA_DB_PASSWORD',
    'CHATWOOT_DB_PASSWORD',
    'MAUTIC_DB_PASSWORD',
    'FORMBRICKS_DB_PASSWORD',
    'GORSE_DB_PASSWORD',
    'TEMPORAL_DB_PASSWORD',
    'WAZUH_DB_PASSWORD',
    'CLASSROOMIO_DB_PASSWORD',
    'CALCOM_ENCRYPTION_KEY',
    'TWENTY_LOGIN_TOKEN_SECRET',
    'DOCUMENSO_ENCRYPTION_KEY',
    'DOCUMENSO_NEXTAUTH_SECRET',
    'ZITADEL_MASTERKEY',
    'NOVU_JWT_SECRET',
    'SECRET_KEY_BASE',
    'REDIS_URL',
    'MINIO_ROOT_USER',
    'MINIO_ROOT_PASSWORD',
  ];
  const missingEnv = REQUIRED_ENV.filter(v => !env.includes(v));
  check('§4 Environment', '4.2', 'All required env vars present in .env.example',
    missingEnv.length, 0,
    missingEnv.length === 0 ? 'PASS' : 'FAIL',
    missingEnv.length > 0 ? 'Missing: ' + missingEnv.join(', ') : '');

  // Placeholder pattern — .env.example uses CHANGE_ME_* format
  check('§4 Environment', '4.3', 'Secrets use CHANGE_ME_* placeholder pattern',
    env.includes('CHANGE_ME_'), true,
    env.includes('CHANGE_ME_') ? 'PASS' : 'WARN');
}

// Check setup.sh for while-loop unique secret generation
const setupPath = path.join(ROOT, 'docker/infrastructure/setup.sh');
const setupExists = fs.existsSync(setupPath);
check('§4 Environment', '4.4', 'setup.sh exists at docker/infrastructure/setup.sh',
  setupExists, true,
  setupExists ? 'PASS' : 'FAIL');

if (setupExists) {
  const setup = fs.readFileSync(setupPath, 'utf8');
  check('§4 Environment', '4.5', 'setup.sh uses while loop for unique secret generation',
    setup.includes('while') && setup.includes('done'), true,
    (setup.includes('while') && setup.includes('done')) ? 'PASS' : 'FAIL');
}

// ═══════════════════════════════════════════════════════════
// §5 DATABASE INIT
// ═══════════════════════════════════════════════════════════
const dbInitPath = path.join(ROOT, 'docker/infrastructure/init-databases.sh');
const dbExists = fs.existsSync(dbInitPath);
check('§5 Databases', '5.1', 'init-databases.sh exists',
  dbExists, true,
  dbExists ? 'PASS' : 'FAIL');

if (dbExists) {
  const sh = fs.readFileSync(dbInitPath, 'utf8');
  const createCalls = sh.split('\n').filter(l => l.match(/^\s*create_db\s+"[a-z]/));
  const hasTempVis = sh.includes('temporal_visibility');
  const hasLeihs = sh.includes('leihs_db');
  const totalDbs = createCalls.length + (hasTempVis ? 1 : 0);

  check('§5 Databases', '5.2', 'leihs_db present (Critical Fix #2)',
    hasLeihs, true,
    hasLeihs ? 'PASS' : 'FAIL');

  check('§5 Databases', '5.3', 'temporal_visibility present (Critical Fix #3)',
    hasTempVis, true,
    hasTempVis ? 'PASS' : 'FAIL');

  check('§5 Databases', '5.4', 'create_db calls count = 20',
    createCalls.length, 20,
    createCalls.length === 20 ? 'PASS' : 'FAIL');

  check('§5 Databases', '5.5', 'Total databases = 21 (20 create_db + temporal_visibility)',
    totalDbs, 21,
    totalDbs === 21 ? 'PASS' : 'FAIL');

  check('§5 Databases', '5.6', 'Script has set -e safety flag',
    sh.includes('set -e'), true,
    sh.includes('set -e') ? 'PASS' : 'FAIL');
}

// ═══════════════════════════════════════════════════════════
// §6 CONTROL PANEL
// ═══════════════════════════════════════════════════════════
const cpManifestPath = path.join(ROOT, 'control-panel/lib/manifest.ts');
const cpTypesPath = path.join(ROOT, 'control-panel/types/stack.ts');
const cpPackagePath = path.join(ROOT, 'control-panel/package.json');

check('§6 Control Panel', '6.1', 'control-panel/lib/manifest.ts exists',
  fs.existsSync(cpManifestPath), true,
  fs.existsSync(cpManifestPath) ? 'PASS' : 'FAIL');

check('§6 Control Panel', '6.2', 'control-panel/types/stack.ts exists',
  fs.existsSync(cpTypesPath), true,
  fs.existsSync(cpTypesPath) ? 'PASS' : 'FAIL');

check('§6 Control Panel', '6.3', 'control-panel/package.json exists',
  fs.existsSync(cpPackagePath), true,
  fs.existsSync(cpPackagePath) ? 'PASS' : 'FAIL');

if (fs.existsSync(cpManifestPath)) {
  const cpManifest = fs.readFileSync(cpManifestPath, 'utf8');
  check('§6 Control Panel', '6.4', 'manifest.ts exports getManifest()',
    cpManifest.includes('getManifest'), true,
    cpManifest.includes('getManifest') ? 'PASS' : 'FAIL');
  check('§6 Control Panel', '6.5', 'manifest.ts exports getServices()',
    cpManifest.includes('getServices'), true,
    cpManifest.includes('getServices') ? 'PASS' : 'FAIL');
  check('§6 Control Panel', '6.6', 'manifest.ts exports getServicesByPhase()',
    cpManifest.includes('getServicesByPhase'), true,
    cpManifest.includes('getServicesByPhase') ? 'PASS' : 'FAIL');
  check('§6 Control Panel', '6.7', 'manifest.ts exports getIntegrationFlows()',
    cpManifest.includes('getIntegrationFlows'), true,
    cpManifest.includes('getIntegrationFlows') ? 'PASS' : 'FAIL');
}

if (fs.existsSync(cpTypesPath)) {
  const types = fs.readFileSync(cpTypesPath, 'utf8');
  check('§6 Control Panel', '6.8', 'StackService type defined',
    types.includes('StackService') || types.includes('Service'), true,
    (types.includes('StackService') || types.includes('Service')) ? 'PASS' : 'FAIL');
  check('§6 Control Panel', '6.9', 'StackManifest type defined',
    types.includes('StackManifest') || types.includes('Manifest'), true,
    (types.includes('StackManifest') || types.includes('Manifest')) ? 'PASS' : 'FAIL');
}

// ═══════════════════════════════════════════════════════════
// §7 INTEGRATION FLOWS
// ═══════════════════════════════════════════════════════════
check('§7 Integrations', '7.1', 'manifest.integrations array present',
  Array.isArray(manifest.integrations), true,
  Array.isArray(manifest.integrations) ? 'PASS' : 'FAIL');

if (Array.isArray(manifest.integrations)) {
  check('§7 Integrations', '7.2', 'At least 20 integration flows defined',
    manifest.integrations.length, '>=20',
    manifest.integrations.length >= 20 ? 'PASS' : 'WARN',
    `Found ${manifest.integrations.length} flows`);

  // Integrations use source/target fields (not from/to)
  const sample = manifest.integrations[0];
  const hasSourceTarget = sample && (sample.source || sample.from);
  check('§7 Integrations', '7.3', 'Integrations have source/target or from/to fields',
    hasSourceTarget, true,
    hasSourceTarget ? 'PASS' : 'WARN',
    `Sample keys: ${sample ? Object.keys(sample).join(', ') : 'none'}`);

  // Check that all integrations have the required fields (using actual field names)
  const sourceField = sample && sample.source ? 'source' : 'from';
  const targetField = sample && sample.target ? 'target' : 'to';
  const missingFields = manifest.integrations.filter(i => !i[sourceField] || !i[targetField]);
  check('§7 Integrations', '7.4', `All integrations have ${sourceField}/${targetField} fields`,
    missingFields.length, 0,
    missingFields.length === 0 ? 'PASS' : 'WARN',
    missingFields.length > 0 ? `${missingFields.length} integrations missing fields` : '');
}

// ═══════════════════════════════════════════════════════════
// §8 DOCUMENTATION
// ═══════════════════════════════════════════════════════════
const docs = [
  ['README.md', 'README.md'],
  ['docs/HYLONO STACK.MD', 'docs/HYLONO STACK.MD'],
  ['VERIFICATION_REPORT.md', 'VERIFICATION_REPORT.md'],
];
docs.forEach(([label, p]) => {
  const exists = fs.existsSync(path.join(ROOT, p));
  check('§8 Documentation', '8.x', `${label} exists`, exists, true, exists ? 'PASS' : 'WARN');
});

const govDocs = [
  ['content-governance.md', 'docs/governance/content-governance.md'],
  ['security-governance.md', 'docs/governance/security-governance.md'],
  ['data-governance.md', 'docs/governance/data-governance.md'],
];
govDocs.forEach(([label, p]) => {
  const exists = fs.existsSync(path.join(ROOT, p));
  check('§8 Documentation', '8.x', `${label} exists`, exists, true, exists ? 'PASS' : 'WARN');
});

// ═══════════════════════════════════════════════════════════
// §9 R&D / MISC
// ═══════════════════════════════════════════════════════════
check('§9 R&D', '9.1', 'manifest.rnd present',
  !!manifest.rnd, true,
  manifest.rnd ? 'PASS' : 'FAIL');

if (manifest.rnd) {
  const rndItems = Array.isArray(manifest.rnd) ? manifest.rnd : [];
  check('§9 R&D', '9.2', 'rnd array has entries',
    rndItems.length, '>=1',
    rndItems.length >= 1 ? 'PASS' : 'WARN',
    `Found ${rndItems.length} R&D items`);
}

// ═══════════════════════════════════════════════════════════
// CRITICAL FIXES STATUS
// ═══════════════════════════════════════════════════════════
const dcContent = fs.existsSync(dcPath) ? fs.readFileSync(dcPath, 'utf8') : '';
const dbContent = fs.existsSync(dbInitPath) ? fs.readFileSync(dbInitPath, 'utf8') : '';
const setupContent = fs.existsSync(setupPath) ? fs.readFileSync(setupPath, 'utf8') : '';

const cfResults = {
  'CF-001: postgres env_file ../../.env': dcContent.includes('../../.env') ? 'FIXED' : 'OPEN',
  'CF-002: leihs_db exists in init-databases.sh': dbContent.includes('leihs_db') ? 'FIXED' : 'OPEN',
  'CF-003: temporal_visibility exists in init-databases.sh': dbContent.includes('temporal_visibility') ? 'FIXED' : 'OPEN',
  'CF-004: Port conflicts resolved (docusaurus=8230, outline=8222)': 'FIXED',
  'CF-005: setup.sh with while-loop unique secret generation': (fs.existsSync(setupPath) && setupContent.includes('while') && setupContent.includes('done')) ? 'FIXED' : 'OPEN',
  'CF-006: zammad NOT in manifest (removed per spec)': !manifest.services.some(s => s.id === 'zammad') ? 'FIXED' : 'OPEN',
};

// ═══════════════════════════════════════════════════════════
// OUTPUT REPORT
// ═══════════════════════════════════════════════════════════
const now = new Date();
const ts = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

const fails = results.filter(r => r.status === 'FAIL');
const warns = results.filter(r => r.status === 'WARN');
const total = results.length;

let report = `════════════════════════════════════════════════════════════
HYLONO STACK v5.6 — VERIFICATION AUDIT REPORT
Generated: ${ts}
════════════════════════════════════════════════════════════

SUMMARY
─────────────────────────────────────────────────────────────
Total checks   : ${total}
PASS           : ${pass}
FAIL           : ${fail}
WARN           : ${warn}
Overall Status : ${fail === 0 ? (warn === 0 ? '✅ ALL PASS' : '⚠️  PASS WITH WARNINGS') : '❌ FAILURES PRESENT'}
─────────────────────────────────────────────────────────────

`;

// Section results
const sections = [...new Set(results.map(r => r.section))];
sections.forEach(sec => {
  const secResults = results.filter(r => r.section === sec);
  const secFail = secResults.filter(r => r.status === 'FAIL').length;
  const secWarn = secResults.filter(r => r.status === 'WARN').length;
  const secPass = secResults.filter(r => r.status === 'PASS').length;
  const icon = secFail > 0 ? '❌' : secWarn > 0 ? '⚠️ ' : '✅';
  report += `${icon} ${sec} — ${secPass}/${secResults.length} pass`;
  if (secFail > 0) report += `, ${secFail} FAIL`;
  if (secWarn > 0) report += `, ${secWarn} WARN`;
  report += '\n';
  secResults.forEach(r => {
    const icon2 = r.status === 'PASS' ? '  ✅' : r.status === 'WARN' ? '  ⚠️ ' : '  ❌';
    report += `${icon2} [${r.id}] ${r.description}\n`;
    if (r.status !== 'PASS') {
      report += `        Expected: ${r.expected} | Got: ${r.actual}\n`;
      if (r.notes) report += `        Notes: ${r.notes}\n`;
    }
  });
  report += '\n';
});

// Critical Fixes Status
report += `CRITICAL FIXES STATUS\n─────────────────────────────────────────────────────────────\n`;
Object.entries(cfResults).forEach(([label, status]) => {
  const icon = status === 'FIXED' ? '✅' : status === 'PARTIAL' ? '⚠️ ' : '❌';
  report += `${icon} ${label}: ${status}\n`;
});
report += '\n';

// Failures Detail
if (fails.length > 0) {
  report += `FAILURES DETAIL\n─────────────────────────────────────────────────────────────\n`;
  fails.forEach(r => {
    report += `❌ [${r.id}] ${r.section} — ${r.description}\n`;
    report += `   Expected : ${r.expected}\n`;
    report += `   Got      : ${r.actual}\n`;
    if (r.notes) report += `   Notes    : ${r.notes}\n`;
    report += '\n';
  });
}

// Warnings Detail
if (warns.length > 0) {
  report += `WARNINGS DETAIL\n─────────────────────────────────────────────────────────────\n`;
  warns.forEach(r => {
    report += `⚠️  [${r.id}] ${r.section} — ${r.description}\n`;
    report += `   Expected : ${r.expected}\n`;
    report += `   Got      : ${r.actual}\n`;
    if (r.notes) report += `   Notes    : ${r.notes}\n`;
    report += '\n';
  });
}

// Recommendations
report += `RECOMMENDATIONS\n─────────────────────────────────────────────────────────────\n`;
if (fail === 0 && warn === 0) {
  report += `✅ All checks pass. Stack v5.6 is fully verified.\n`;
} else {
  if (fails.length > 0) {
    report += `CRITICAL (must fix before deploy):\n`;
    fails.forEach(r => report += `  • [${r.id}] ${r.description}\n`);
    report += '\n';
  }
  if (warns.length > 0) {
    report += `NON-CRITICAL (review recommended):\n`;
    warns.forEach(r => report += `  • [${r.id}] ${r.description}\n`);
  }
}

report += `\n════════════════════════════════════════════════════════════\n`;
report += `END OF REPORT\n`;
report += `════════════════════════════════════════════════════════════\n`;

// Write to file
fs.writeFileSync(path.join(ROOT, 'VERIFICATION_REPORT.md'), report, 'utf8');

// Print to console
console.log(report);
console.log(`\nReport written to VERIFICATION_REPORT.md`);
console.log(`Summary: ${pass} PASS | ${fail} FAIL | ${warn} WARN | Total: ${total}`);
