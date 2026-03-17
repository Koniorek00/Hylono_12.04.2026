/**
 * Compliance Check Script
 * 
 * Scans content files for medical compliance issues before deployment.
 * Run with: pnpm exec tsx scripts/compliance-check.ts
 * 
 * @module scripts/compliance-check
 */

import { validateCompliance, type ComplianceIssue } from '../utils/compliance';
import * as fs from 'fs';
import * as path from 'path';

interface ScanResult {
  file: string;
  issues: ComplianceIssue[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ScanSummary {
  totalFiles: number;
  filesWithIssues: number;
  totalIssues: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  results: ScanResult[];
}

// Directories and file patterns to scan
const SCAN_PATHS = [
  'app',
  'content',
  'components',
  'src',
  'lib',
  'hooks',
  'utils',
  'constants',
];

const FILE_EXTENSIONS = ['.ts', '.tsx'];

// Patterns to extract content from
const CONTENT_PATTERNS = [
  // String literals in quotes
  /["'`]([^"'`]{20,})["'`]/g,
  // JSX text content
  />([^<]{20,})</g,
  // Template literals
  /`([^`]{20,})`/g,
];

// Skip patterns (files/paths to ignore)
const SKIP_PATTERNS = [
  /node_modules/,
  /\.test\./,
  /\.spec\./,
  /__tests__/,
  /compliance\.ts$/, // Don't scan the compliance utility itself
  /disclaimers\.ts$/, // Disclaimers contain medical terms for legitimate reasons
  /constants[\/\\]knowledge\.ts$/, // Internal banned-term registry, not public copy
  /src[\/\\]components[\/\\]ui[\/\\]Multitool[\/\\]utils[\/\\]extractMetrics\.ts$/, // Internal tooling
  /src[\/\\]lib[\/\\]stripe\.ts$/, // Server utility
  /hooks[\/\\]useFocusTrap\.tsx$/, // Accessibility utility
  /utils[\/\\]csrf\.ts$/, // Security utility
  /utils[\/\\]sanitization\.ts$/, // Sanitization utility
];

const RESEARCH_CITATION_SOURCE_PATTERNS = [
  /content[\/\\]evidence\.ts$/,
  /content[\/\\]research\.ts$/,
  /constants[\/\\]content\.ts$/,
];

const RESEARCH_CITATION_CONTEXT =
  /pubmed|doi|randomized|systematic review|meta-analysis|trial|study|research|publication|journal|participants?|patients?|fracture|syndrome|cardiac arrest|fatigue/i;

/**
 * Extract text content from a file
 */
function extractContent(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const extracts: string[] = [];

  CONTENT_PATTERNS.forEach(pattern => {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(content)) !== null) {
      if (match[1] && match[1].trim().length > 20) {
        extracts.push(match[1].trim());
      }
    }
  });

  return extracts;
}

const CLI_ARGS = process.argv.slice(2);

const findFlagValue = (flag: string): string | null => {
  const entry = CLI_ARGS.find((argument) => argument.startsWith(`${flag}=`));
  if (!entry) {
    return null;
  }

  return entry.slice(flag.length + 1);
};

const parseLimitFlag = (flag: string): number => {
  const value = findFlagValue(flag);
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return Number.POSITIVE_INFINITY;
  }

  return parsed;
};

const OUTPUT_LIMIT_FILES = parseLimitFlag('--limit-files');
const OUTPUT_LIMIT_ISSUES_PER_FILE = parseLimitFlag('--limit-issues');
const STRICT_MODE = !CLI_ARGS.includes('--non-strict');

/**
 * Check if path should be skipped
 */
function shouldSkip(filePath: string): boolean {
  return SKIP_PATTERNS.some(pattern => pattern.test(filePath));
}

function shouldIgnoreExtract(filePath: string, text: string): boolean {
  return (
    RESEARCH_CITATION_SOURCE_PATTERNS.some((pattern) => pattern.test(filePath)) &&
    RESEARCH_CITATION_CONTEXT.test(text)
  );
}

/**
 * Recursively get all files with target extensions
 */
function getFiles(dir: string): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...getFiles(fullPath));
    } else if (entry.isFile()) {
      if (FILE_EXTENSIONS.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

const toSafeLimit = (value: number): number => {
  if (!Number.isFinite(value) || value <= 0) {
    return Number.POSITIVE_INFINITY;
  }

  return value;
};

/**
 * Scan all content files for compliance issues
 */
function scanContent(basePath: string): ScanSummary {
  const results: ScanResult[] = [];
  let totalIssues = 0;
  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;

  // Get all files to scan
  const allFiles: string[] = [];
  for (const scanPath of SCAN_PATHS) {
    const fullPath = path.join(basePath, scanPath);
    allFiles.push(...getFiles(fullPath));
  }

  // Filter out skipped files
  const filesToScan = allFiles.filter(f => !shouldSkip(f));

  console.log(`\n📁 Scanning ${filesToScan.length} files for compliance issues...\n`);

  for (const file of filesToScan) {
    const extracts = extractContent(file);
    const fileIssues: ComplianceIssue[] = [];
    let fileHighestSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';

    for (const text of extracts) {
      if (shouldIgnoreExtract(file, text)) {
        continue;
      }

      const result = validateCompliance(text, { strict: STRICT_MODE });
      
      if (!result.isValid) {
        // Deduplicate issues by term
        const newIssues = result.issues.filter(
          issue => !fileIssues.some(existing => existing.term === issue.term)
        );
        fileIssues.push(...newIssues);

        // Track severity
        if (result.severity === 'critical') fileHighestSeverity = 'critical';
        else if (result.severity === 'high' && fileHighestSeverity !== 'critical') fileHighestSeverity = 'high';
        else if (result.severity === 'medium' && fileHighestSeverity !== 'critical' && fileHighestSeverity !== 'high') fileHighestSeverity = 'medium';
      }
    }

    if (fileIssues.length > 0) {
      results.push({
        file: file.replace(basePath, '').replace(/^[/\\]/, ''),
        issues: fileIssues,
        severity: fileHighestSeverity,
      });

      totalIssues += fileIssues.length;
      fileIssues.forEach(issue => {
        if (issue.severity === 'critical') criticalCount++;
        else if (issue.severity === 'high') highCount++;
        else if (issue.severity === 'medium') mediumCount++;
        else lowCount++;
      });
    }
  }

  return {
    totalFiles: filesToScan.length,
    filesWithIssues: results.length,
    totalIssues,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    results: results.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }),
  };
}

/**
 * Format severity for console output
 */
function formatSeverity(severity: string): string {
  const colors: Record<string, string> = {
    critical: '\x1b[41m\x1b[37m CRITICAL \x1b[0m',
    high: '\x1b[43m\x1b[30m HIGH \x1b[0m',
    medium: '\x1b[46m\x1b[30m MEDIUM \x1b[0m',
    low: '\x1b[47m\x1b[30m LOW \x1b[0m',
  };
  return colors[severity] || severity;
}

/**
 * Main execution
 */
const basePath = process.cwd();

console.log('🏥 HYLONO COMPLIANCE CHECKER');
console.log('━'.repeat(50));

const summary = scanContent(basePath);

// Print results
console.log('\n' + '━'.repeat(50));
console.log('📊 SCAN SUMMARY');
console.log('━'.repeat(50));
console.log(`Files scanned:     ${summary.totalFiles}`);
console.log(`Files with issues: ${summary.filesWithIssues}`);
console.log(`Total issues:      ${summary.totalIssues}`);
console.log('');
console.log(`  Critical: ${summary.criticalCount}`);
console.log(`  High:     ${summary.highCount}`);
console.log(`  Medium:   ${summary.mediumCount}`);
console.log(`  Low:      ${summary.lowCount}`);

if (summary.results.length > 0) {
  console.log('\n' + '━'.repeat(50));
  console.log('🚨 ISSUES FOUND');
  console.log('━'.repeat(50));

  const fileOutputLimit = toSafeLimit(OUTPUT_LIMIT_FILES);
  const issueOutputLimit = toSafeLimit(OUTPUT_LIMIT_ISSUES_PER_FILE);

  for (const result of summary.results.slice(0, fileOutputLimit)) {
    console.log(`\n${formatSeverity(result.severity)} ${result.file}`);
    
    for (const issue of result.issues.slice(0, issueOutputLimit)) {
      console.log(`  └─ "${issue.term}" → ${issue.suggestion}`);
    }
    
    if (result.issues.length > issueOutputLimit) {
      console.log(`  └─ ... and ${result.issues.length - issueOutputLimit} more`);
    }
  }

  if (summary.results.length > fileOutputLimit) {
    console.log(`\n  ... and ${summary.results.length - fileOutputLimit} more files with issues`);
  }
}

// Exit with appropriate code
console.log('\n' + '━'.repeat(50));
if (summary.criticalCount > 0 || summary.highCount > 0) {
  console.log('❌ COMPLIANCE CHECK FAILED');
  console.log('   Critical or high severity issues found.');
  console.log('   Please fix these issues before deployment.\n');
  process.exit(1);
} else if (summary.mediumCount > 0) {
  console.log('⚠️  COMPLIANCE CHECK PASSED WITH WARNINGS');
  console.log('   Medium severity issues found. Review recommended.\n');
  process.exit(0);
} else {
  console.log('✅ COMPLIANCE CHECK PASSED');
  console.log('   No significant issues found.\n');
  process.exit(0);
}
