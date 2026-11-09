/**
 * Transforme l'export Next.js (out/) en site HTML qui s'ouvre par double-clic (file://), sans serveur.
 *   node scripts/make-local-html.cjs [out] [site-html]
 * - chemins absolus (/img, /_next, /galerie/...) → chemins relatifs à chaque page ;
 * - liens de dossiers → .../index.html ;
 * - navigation : clic sur un lien interne = chargement classique de la page (pas de routeur JS) ;
 * - images et liens créés dynamiquement (filtres, galerie) : réécrits à la volée.
 */
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(process.argv[2] || 'out');
const DST = path.resolve(process.argv[3] || 'site-html');

function copyDir(a, b) {
  fs.mkdirSync(b, { recursive: true });
  for (const e of fs.readdirSync(a, { withFileTypes: true })) {
    const s = path.join(a, e.name), d = path.join(b, e.name);
    e.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    e.isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}

/** "/galerie/produits/?x=1#a" → "<prefix>galerie/produits/index.html?x=1#a" */
function relUrl(url, prefix) {
  if (!url.startsWith('/') || url.startsWith('//')) return url;
  const m = url.match(/^([^?#]*)(.*)$/);
  let p = m[1].slice(1), rest = m[2];
  const last = p.split('/').pop();
  if (p === '' || p.endsWith('/')) p += 'index.html';
  else if (!last.includes('.')) p += '/index.html';
  return prefix + p + rest;
}

const RUNTIME = (prefix) => `<script>
(function(){
  var R=${JSON.stringify(prefix)};window.__ROOT=R;
  function rel(u){if(!u||u.charAt(0)!=='/'||u.charAt(1)==='/')return u;var m=u.match(/^([^?#]*)(.*)$/),p=m[1].slice(1),r=m[2],l=p.split('/').pop();
    if(p===''||/\\/$/.test(p))p+='index.html';else if(l.indexOf('.')<0)p+='/index.html';return R+p+r;}
  window.__rel=rel;
  /* En file://, le préchargement des pages par Next.js (fetch ?_rsc=) est bloqué par le navigateur :
     on le neutralise (la navigation se fait de toute façon par chargement classique). */
  if(location.protocol==='file:'&&window.fetch){var f0=window.fetch.bind(window);
    window.fetch=function(i,o){var u=typeof i==='string'?i:(i&&(i.url||i.href))||String(i||'');
      if(/[?&]_rsc=|\\.txt(\\?|$)/.test(u)||(o&&o.headers&&JSON.stringify(o.headers).indexOf('RSC')>-1))return new Promise(function(){});
      return f0(i,o);};}
  window.addEventListener('unhandledrejection',function(e){if(location.protocol==='file:'&&e.reason&&e.reason.type==='error')e.preventDefault();});
  /* Navigation classique : on court-circuite le routeur client de Next.js. */
  window.addEventListener('click',function(e){
    if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
    var h=a.getAttribute('href');if(!h||h.charAt(0)==='#'||/^(https?:|mailto:|tel:|javascript:)/i.test(h))return;
    e.preventDefault();e.stopImmediatePropagation();
    var t=h.charAt(0)==='/'?rel(h):h;
    if(h.charAt(0)!=='/'&&!/\\.html(\\?|#|$)/.test(t)){var m=t.match(/^([^?#]*)(.*)$/);t=m[1].replace(/\\/?$/,'/index.html')+m[2];}
    location.href=t;
  },true);
  /* Images / liens ajoutés par JavaScript (filtres, galerie…) : chemins rendus relatifs. */
  function fix(el){if(el.nodeType!==1)return;
    ['src','href','poster'].forEach(function(k){var v=el.getAttribute&&el.getAttribute(k);if(v&&v.charAt(0)==='/'&&v.charAt(1)!=='/')el.setAttribute(k,k==='href'?rel(v):R+v.slice(1));});
    var s=el.getAttribute&&el.getAttribute('srcset');if(s&&/(^|,\\s*)\\//.test(s))el.setAttribute('srcset',s.replace(/(^|,\\s*)\\/(?!\\/)/g,'$1'+R));
    if(el.querySelectorAll)el.querySelectorAll('[src^="/"],[href^="/"],[srcset*="/"],[poster^="/"]').forEach(function(c){if(c!==el)fix(c);});}
  new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==='attributes')fix(m.target);else m.addedNodes.forEach(fix);});})
    .observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src','href','srcset','poster']});
  /* Le routeur Next.js tente de réécrire l'URL : sans effet en file://. */
  var rs=history.replaceState,ps=history.pushState;
  history.replaceState=function(s,t,u){try{return rs.call(history,s,t,location.protocol==='file:'&&u&&String(u).charAt(0)==='/'?undefined:u);}catch(e){}};
  history.pushState=function(s,t,u){if(location.protocol==='file:'&&u&&String(u).charAt(0)==='/'){location.href=rel(String(u));return;}try{return ps.call(history,s,t,u);}catch(e){}};
})();
</script>`;

if (!fs.existsSync(path.join(SRC, 'index.html'))) { console.error('Export introuvable :', SRC); process.exit(1); }
fs.rmSync(DST, { recursive: true, force: true });
copyDir(SRC, DST);

let html = 0, js = 0, css = 0;
for (const file of walk(DST)) {
  const relPath = path.relative(DST, file).split(path.sep);
  const depth = relPath.length - 1;
  const prefix = depth ? '../'.repeat(depth) : './';
  const ext = path.extname(file);

  if (ext === '.html') {
    let s = fs.readFileSync(file, 'utf8');
    s = s.replace(/\s(href|src|poster|action|content)="(\/[^"]*)"/g, (m, k, v) => (k === 'content' && !v.startsWith('/_next/') && !v.startsWith('/img/')) ? m : ` ${k}="${k === 'href' ? relUrl(v, prefix) : prefix + v.slice(1)}"`);
    s = s.replace(/\s(srcset|imagesrcset)="([^"]*)"/g, (m, k, v) => ` ${k}="${v.replace(/(^|,\s*)\/(?!\/)/g, `$1${prefix}`)}"`);
    s = s.replace(/url\((['"]?)\/(?!\/)/g, `url($1${prefix}`);
    s = s.replace(/<head>/, `<head>${RUNTIME(prefix)}`);
    fs.writeFileSync(file, s); html++;
  } else if (ext === '.js') {
    let s = fs.readFileSync(file, 'utf8'), o = s;
    // chemin public de webpack (chargement des morceaux de JS à la demande)
    s = s.replace(/\.p="\/_next\/"/g, '.p=(self.__ROOT||"/")+"_next/"');
    if (s !== o) { fs.writeFileSync(file, s); js++; }
  } else if (ext === '.css') {
    let s = fs.readFileSync(file, 'utf8');
    const pre = '../'.repeat(depth);
    s = s.replace(/url\((['"]?)\/(?!\/)/g, `url($1${pre}`);
    fs.writeFileSync(file, s); css++;
  }
}
console.log(`Site HTML local : ${DST}\n  ${html} pages HTML, ${css} feuilles CSS, ${js} fichier(s) JS adapté(s).`);
