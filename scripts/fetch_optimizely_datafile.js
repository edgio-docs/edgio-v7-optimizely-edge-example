const fs = require('fs');
const fetch = require('node-fetch');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

const DATAFILE_DIR = path.join(__dirname, '..', 'lib', 'optimizely');
const DATAFILE_FILE_PATH = path.join(DATAFILE_DIR, 'datafile.json');
const HASH_FILE_PATH = path.join(DATAFILE_DIR, 'datafile_hash.json');

async function fetchDatafile() {
  const sdkKey = process.env.OPTIMIZELY_SDK_KEY;

  if (!sdkKey) {
    console.error(
      'OPTIMIZELY_SDK_KEY environment variable is required. Skipping datafile fetch.'
    );
    return;
  }

  console.log(`Fetching Optimizely Datafile for SDK Key: ${sdkKey}`);

  const response = await fetch(
    `https://cdn.optimizely.com/datafiles/${sdkKey}.json`
  );
  const responseJson = await response.text();

  if (!fs.existsSync(DATAFILE_DIR)) {
    fs.mkdirSync(DATAFILE_DIR, { recursive: true });
  }

  fs.writeFileSync(DATAFILE_FILE_PATH, responseJson);
  console.log(`Optimizely Datafile fetched successfully`);

  // Create a hash of the datafile contents
  const hash = crypto
    .createHash('sha256')
    .update(responseJson)
    .digest('hex')
    .slice(0, 8);
  fs.writeFileSync(
    HASH_FILE_PATH,
    JSON.stringify({ hash, timestamp: Date.now() })
  );
  console.log(`Datafile hash written to ${HASH_FILE_PATH}`);
}

(async () => {
  await fetchDatafile();
})();
