/**
 * Keep this project's node_modules OUT of the Google Drive mirror.
 *
 * "Desktop\\Phoenix Code" is a Drive mirrored backup root. Drive races writes to
 * large files and has silently deleted them here before — a git .pack file and
 * the 47 MB @rspack native binding both vanished that way. So node_modules lives
 * at C:\\dev\\nm\\<project>\\node_modules with a junction pointing at it.
 *
 * npm tears that junction down on every install:
 *     npm warn reify Removing non-directory ...\\node_modules
 * and writes a real folder back inside the mirror. This postinstall hook puts it
 * back. Inert on every machine but this one, and it never fails an install.
 */
const fs = require('fs');
const path = require('path');

const MIRROR = 'C:\\Users\\dasto\\Desktop\\Phoenix Code';
const TARGET = path.join('C:\\dev\\nm', "israel-property-advisors", 'node_modules');

function relink() {
  if (process.platform !== 'win32') return;              // Render / CI / Linux
  if (!__dirname.toLowerCase().startsWith(MIRROR.toLowerCase())) return;  // not the mirrored tree

  const link = path.join(__dirname, 'node_modules');
  const st = fs.lstatSync(link, { throwIfNoEntry: false });
  if (!st) return;                                       // nothing installed
  if (st.isSymbolicLink()) return;                       // junction already in place

  // npm just wrote a real node_modules inside the mirror. Move it out.
  fs.mkdirSync(path.dirname(TARGET), { recursive: true });

  // Whatever sits at TARGET is the PREVIOUS install, superseded by this one.
  // Park it first (instant rename) so the fresh tree is never at risk.
  let stale = null;
  if (fs.existsSync(TARGET)) {
    stale = TARGET + '.stale-' + process.pid;
    fs.renameSync(TARGET, stale);
  }

  fs.renameSync(link, TARGET);
  fs.symlinkSync(TARGET, link, 'junction');              // 'junction' needs no admin rights

  if (stale) {
    try { fs.rmSync(stale, { recursive: true, force: true }); }
    catch (_) { console.warn('[relink] left behind, delete when convenient: ' + stale); }
  }
  console.log('[relink] node_modules -> ' + TARGET + ' (kept out of Google Drive)');
}

try {
  relink();
} catch (err) {
  // Never fail an install over this — just make the breakage loud.
  console.warn('[relink] could NOT move node_modules out of the Drive mirror: ' + err.message);
  console.warn('[relink] node_modules is syncing to Drive until this is fixed. Move it to');
  console.warn('[relink]   ' + TARGET + '  and recreate the junction.');
}
