#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { runSundaScript } = require('../src/interpreter');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Cara make: euy <nama_file.euy> atawa sundascript <nama_file.euy>");
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), args[0]);

if (!fs.existsSync(filePath)) {
  console.error(`Error: File '${args[0]}' teu kapanggih!`);
  process.exit(1);
}

const code = fs.readFileSync(filePath, 'utf-8');
runSundaScript(code);
