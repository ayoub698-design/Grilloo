const fs = require('fs'), vm = require('vm'), path = require('path');
const src = fs.readFileSync(process.argv[2], 'utf8');
const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(src, ctx);
const G = ctx.window.GRILLOO;
fs.writeFileSync(process.argv[3], JSON.stringify(G, null, 1));
console.log('families', G.families.length, 'products', G.products.length);
