import { createServer } from 'vite';
import { buildPage, root } from './build.mjs';

await buildPage();
const server=await createServer({root,configFile:false,server:{host:'127.0.0.1',watch:{ignored:['**/.build/**','**/dist/**']}},plugins:[{
  name:'clock-entry',
  configureServer(vite){vite.middlewares.use((request,response,next)=>{
    if(request.url==='/'){
      response.writeHead(302,{Location:'/orrery-of-eratosthenes.html'});response.end();
    }else next();
  });},
}]});
await server.listen();server.printUrls();
let timer, busy=false, dirty=false;
async function rebuild(){
  if(busy){dirty=true;return;}
  busy=true;
  try {await buildPage();server.ws.send({type:'full-reload'});}
  catch(error){console.error(error);}
  finally {busy=false;if(dirty){dirty=false;void rebuild();}}
}
server.watcher.on('all',(event,file)=>{
  const normalized=file.replaceAll('\\','/');
  if(!['add','change','unlink'].includes(event))return;
  if(normalized.includes('/src/') || /\/\.review\/[^/]+\.(js|css|py|html)$/.test(normalized)){
    clearTimeout(timer);timer=setTimeout(rebuild,120);
  }
});
