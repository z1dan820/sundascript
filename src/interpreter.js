const fs = require('fs');
const vm = require('vm');

function parseSundaScript(code) {
  // Pisahkan string literal agar keyword di dalam string tidak ikut terisi/terganti
  const stringRegex = /(".*?"|'.*?'|`.*?`)/g;
  const parts = code.split(stringRegex);

  const keywordMap = [
    [/\bboga\b/g, 'let'],
    [/\bpaten\b/g, 'const'],
    [/\bgorowok\b/g, 'gorowok'],
    [/\bpenta\b/g, 'pentaInput'],
    [/\blamun\b/g, 'if'],
    [/\bmun henteu\b/g, 'else if'],
    [/\bpoko mah\b/g, 'else'],
    [/\bputer\b/g, 'while'],
    [/\bjurus\b/g, 'function'],
    [/\bpasrahkeun\b/g, 'return'],
    [/\benya\b/g, 'true'],
    [/\bhenteu\b/g, 'false'],
    [/\beuweuh\b/g, 'null']
  ];

  const transpiled = parts.map((part, index) => {
    // Indeks genap adalah kode program, indeks ganjil adalah teks string
    if (index % 2 === 0) {
      let str = part;
      for (const [regex, replacement] of keywordMap) {
        str = str.replace(regex, replacement);
      }
      return str;
    }
    return part;
  }).join('');

  return transpiled;
}

function runSundaScript(code) {
  const transpiled = parseSundaScript(code);

  const context = {
    console,
    gorowok: (...args) => console.log(...args),
    pentaInput: (promptText = '') => {
      if (promptText) process.stdout.write(String(promptText));
      const buf = Buffer.alloc(1024);
      let bytesRead = 0;
      try {
        bytesRead = fs.readSync(process.stdin.fd, buf, 0, 1024, null);
      } catch (e) {
        return '';
      }
      return buf.toString('utf8', 0, bytesRead).trim();
    },
    process
  };

  vm.createContext(context);
  try {
    vm.runInContext(transpiled, context);
  } catch (err) {
    console.error("Kasalahan SundaScript (Runtime Error):", err.message);
  }
}

module.exports = { runSundaScript, parseSundaScript };
