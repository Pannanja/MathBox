import { build } from 'vite';
import { execFileSync } from 'node:child_process';
import { mkdir, copyFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const root=fileURLToPath(new URL('../',import.meta.url));
export async function buildPage() {
  await build({root,configFile:false,logLevel:'warn',build:{
    outDir:'.build',emptyOutDir:true,minify:false,target:'es2022',
    lib:{entry:path.join(root,'src/legacy-adapter.ts'),name:'ClockMath',formats:['iife'],fileName:()=> 'clock-math.js'},
  },worker:{format:'iife'}});
  const assembled=path.join(root,'.build/page.html');
  execFileSync(process.env.PYTHON || 'python',['.review/game-build.py'],{
    cwd:root,stdio:'inherit',env:{...process.env,CLOCK_HTML_OUTPUT:assembled},
  });
  await mkdir(path.join(root,'dist'),{recursive:true});
  await copyFile(assembled,path.join(root,'dist/index.next.html'));
  await rename(path.join(root,'dist/index.next.html'),path.join(root,'dist/index.html'));
  await rename(assembled,path.join(root,'orrery-of-eratosthenes.html'));
  console.log('Built standalone HTML and dist/index.html.');
}
if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) await buildPage();
