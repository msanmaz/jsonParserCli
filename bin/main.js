// #!/usr/bin/env node

import { isValidJSON } from '../jsonValidator.js';
import fs from 'fs';

export default function main() {
  if (process.argv.length < 3) {
    console.error('Usage: node main.js <path-to-json-file>');
    process.exit(1);
  }

  const filePath = process.argv[2];

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
