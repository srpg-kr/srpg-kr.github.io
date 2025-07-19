import fs from 'fs/promises';
import path from 'path';
import { Octokit } from '@octokit/rest';

const { GITHUB_ISSUE_NUMBER, GITHUB_ISSUE_BODY, GITHUB_TOKEN } = process.env;
const owner = 'srpg-kr';
const repo = 'srpg-kr.github.io';

const octokit = new Octokit({ auth: GITHUB_TOKEN });

function parseIssueBody(body) {
  const cnMatch = body.match(/\*\*Original Text \(CN\):\*\*\s*```\s*([\s\S]*?)\s*```/);
  const krMatch = body.match(/\*\*Suggested Translation \(KR\):\*\*\s*```\s*([\s\S]*?)\s*```/);

  if (!cnMatch || !krMatch) {
    throw new Error('Could not parse issue body. Make sure it follows the template.');
  }

  const cnText = cnMatch[1].trim();
  const krText = krMatch[1].trim();

  if (krText.includes('[Please enter your suggestion here]')) {
    throw new Error('The suggested translation has not been filled out.');
  }

  return { cnText, krText };
}

async function updateTranslationFile(cnText, krText) {
  const filePath = path.resolve(process.cwd(), 'public/translation_data.json');
  const fileContent = await fs.readFile(filePath, 'utf8');
  const translations = JSON.parse(fileContent);

  if (translations[cnText] === undefined) {
    console.warn(`Original text "${cnText}" not found in translation file. It will be added as a new entry.`);
  }

  translations[cnText] = krText;

  await fs.writeFile(filePath, JSON.stringify(translations, null, 2), 'utf8');
  console.log(`Successfully updated translation for: "${cnText}"`);
}

async function closeIssue() {
  await octokit.issues.update({
    owner,
    repo,
    issue_number: GITHUB_ISSUE_NUMBER,
    state: 'closed',
    // You could also add a comment here to confirm
  });
  console.log(`Successfully closed issue #${GITHUB_ISSUE_NUMBER}`);
}

async function main() {
  try {
    if (!GITHUB_ISSUE_BODY || !GITHUB_ISSUE_NUMBER || !GITHUB_TOKEN) {
      throw new Error('Missing required environment variables.');
    }

    const { cnText, krText } = parseIssueBody(GITHUB_ISSUE_BODY);
    await updateTranslationFile(cnText, krText);
    await closeIssue();

  } catch (error) {
    console.error('Workflow failed:', error.message);
    // Optionally, add a comment to the issue to indicate failure
    await octokit.issues.createComment({
        owner,
        repo,
        issue_number: GITHUB_ISSUE_NUMBER,
        body: `Workflow failed: ${error.message}`
    });
    process.exit(1);
  }
}

main();
