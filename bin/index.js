import { isValidJSON } from '../jsonValidator.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function main() {
  if (process.argv.length < 3) {
    console.error('Usage: jsonParser <path-to-json-file>');
    process.exit(1);
  }

  const filePath = path.resolve(process.argv[2]);

  try {
    const jsonString = fs.readFileSync(filePath, 'utf8');
    const isValid = isValidJSON(jsonString);

    if (isValid) {
      console.log('JSON is valid');
      process.exit(0);
    } else {
      console.log('JSON is invalid');
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    process.exit(1);
  }
}

main();