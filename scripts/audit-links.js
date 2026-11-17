const fs = require('fs');
const path = require('path');
const http = require('http');

function getLinks(dir) {
  let links = new Set();
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory() && f.name !== 'node_modules' && f.name !== '.next') {
      getLinks(full).forEach(l => links.add(l));
    } else if (f.isFile() && (f.name.endsWith('.tsx') || f.name.endsWith('.ts'))) {
      const content = fs.readFileSync(full, 'utf8');
      const regex = /href=["'](\/[^"'#?]*)["'?#]/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        if (match[1] && !match[1].startsWith('//')) {
          links.add(match[1]);
        }
      }
    }
  }
  return links;
}

const allLinks = Array.from(getLinks(path.join(__dirname, '..', 'src')));
console.log('Total unique internal href links found:', allLinks.length);

async function testLinks() {
  const broken = [];
  const ok = [];

  for (const link of allLinks) {
    if (!link) continue;
    await new Promise(resolve => {
      http.get('http://localhost:3000' + link, res => {
        if (res.statusCode === 404) {
          broken.push({ link, status: res.statusCode });
          console.log(`[404 NOT FOUND] ${link}`);
        } else {
          ok.push({ link, status: res.statusCode });
          console.log(`[${res.statusCode}] ${link}`);
        }
        resolve();
      }).on('error', e => {
        broken.push({ link, error: e.message });
        console.log(`[ERR] ${link}: ${e.message}`);
        resolve();
      });
    });
  }

  console.log('\n--- AUDIT SUMMARY ---');
  console.log(`Valid links: ${ok.length}`);
  console.log(`Broken links (404): ${broken.length}`);
  if (broken.length > 0) {
    console.log('List of broken links:');
    broken.forEach(b => console.log(`  - ${b.link}`));
  }
}

testLinks();
