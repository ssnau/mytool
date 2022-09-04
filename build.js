const exec = require('child_process').execSync;
const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname);
const htmlFiles = files.filter(f => {
  return /.html$/.test(f);
});
exec(`rm -rf ${path.join(__dirname, 'docs')}`);
exec(`rm -rf ${path.join(__dirname, 'dist')}`);
/*
htmlFiles.forEach(f => {
  const s = exec(`cd ${__dirname} && ./node_modules/.bin/parcel build ${f} --public-url '.' --out-dir docs`);
  console.log(String(s));
});
*/
const indexFile = path.join(__dirname, "index.html")
const indexContent = fs.readFileSync(indexFile, 'utf-8');
fs.writeFileSync(indexFile, indexContent.replace(/ver:\s+\d+/, "ver: " + Date.now()), 'utf-8');
const s = exec(`cd ${__dirname} && ./node_modules/.bin/parcel build index.html --public-url '.' --out-dir docs`);
console.log(String(s));

