const exec = require('child_process').execSync;
const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname);
const htmlFiles = files.filter(f => {
  return /.html$/.test(f);
});
exec(`rm -rf ${path.join(__dirname, 'docs')}`);
htmlFiles.forEach(f => {
  const s = exec(`cd ${__dirname} && ./node_modules/.bin/parcel build ${f} --public-url '.' --out-dir docs`);
  console.log(String(s));
});

