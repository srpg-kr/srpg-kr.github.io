
import fs from 'fs';
import path from 'path';
import followRedirects from 'follow-redirects';
const { https } = followRedirects;

const url = 'https://github.com/jarari/anime-shooting-cn/raw/refs/heads/main/translation_final.json';
const outputPath = path.resolve(process.cwd(), 'public/translation_data.json');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest, { encoding: 'utf8' });
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function main() {
  try {
    console.log(`Downloading translation data from ${url}...`);
    await downloadFile(url, outputPath);
    console.log(`Successfully saved translation data to ${outputPath}`);
  } catch (error) {
    console.error('Error fetching or saving translation data:', error);
    process.exit(1);
  }
}

main();
