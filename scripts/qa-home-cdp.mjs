import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

if(typeof WebSocket!=='function')throw Error('Node 22 com WebSocket necessário');
const bin=process.env.CHROME_PATH||'/usr/bin/google-chrome';
const dir=mkdtempSync(join(tmpdir(),'hover-chrome-'));
const chrome=spawn(bin,['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-first-run','--no-default-browser-check','--remote-debugging-port=9223','--user-data-dir='+dir,'about:blank'],{stdio:'ignore'});
let ws,seq=0;
const pend=new Map();
const call=(method,params={})=>new Promise((resolve,reject)=>{
 const id=++seq;pend.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));
});
const evalJs=async expression=>{
 const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
 if(r.exceptionDetails)throw Error('JS: '+r.exceptionDetails.text);
 return r.result?.value;
};
try{
 let endpoint;
 for(let i=0;i<50;i++){
  try{const pages=await(await fetch('http://127.0.0.1:9223/json/list')).json();endpoint=pages.find(x=>x.type==='page')?.webSocketDebuggerUrl;if(endpoint)break;}catch{}
  await delay(200);
 }
 if(!endpoint)throw Error('CDP indisponível');
 ws=new WebSocket(endpoint);
 await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
 ws.addEventListener('message',event=>{
  const x=JSON.parse(String(event.data));if(!x.id)return;
  const p=pend.get(x.id);if(!p)return;pend.delete(x.id);
  if(x.error)p.reject(Error(JSON.stringify(x.error)));else p.resolve(x.result);
 });
 await call('Page.enable');
 await call('Runtime.enable');
 await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await call('Page.navigate',{url:'https://hovershot.online/?qa-browser='+Date.now()});
 await delay(4500);
 const desktop=await evalJs('(() => { const grid=document.querySelector("#version-grid");const cards=[...document.querySelectorAll(".version-card")];const style=getComputedStyle(grid);const cssHref=document.querySelector("link[rel=stylesheet]")?.href||"";const scriptSrc=document.querySelector("script[type=module]")?.src||"";document.querySelector("[data-filter=hosted]").click();const filtered=cards.filter(c=>!c.hidden).length;document.querySelector("[data-details=guntanks]").click();const modal=document.querySelector("#details-modal").open;document.querySelector("#modal-close").click();document.querySelector("[data-filter=all]").click();return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,cardCount:cards.length,gridDisplay:style.display,columns:style.gridTemplateColumns.split(" ").length,filtered,modal,cssVersioned:cssHref.includes("?v="),jsVersioned:scriptSrc.includes("?v="),moduleFetched:performance.getEntriesByType("resource").some(x=>x.name.includes("/assets/playtest-model.js?v="))}; })()');
 console.log('LAYOUT_DESKTOP='+JSON.stringify(desktop));
 if(desktop.cardCount!==13||desktop.gridDisplay!=='grid'||desktop.filtered!==2||!desktop.modal||!desktop.cssVersioned||!desktop.jsVersioned||!desktop.moduleFetched||desktop.scrollWidth>desktop.width+2)throw Error('QA_DESKTOP_FAIL');
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await delay(700);
 const mobile=await evalJs('(() => {const grid=document.querySelector("#version-grid");const filters=document.querySelector(".filters");const cards=[...document.querySelectorAll(".version-card")].filter(x=>!x.hidden);const rects=cards.map(x=>x.getBoundingClientRect());return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,gridDisplay:getComputedStyle(grid).display,columns:getComputedStyle(grid).gridTemplateColumns.split(" ").length,filtersWidth:filters.clientWidth,filtersScrollWidth:filters.scrollWidth,visibleCards:cards.length,maxCardRight:Math.max(...rects.map(x=>x.right))};})()');
 console.log('LAYOUT_MOBILE='+JSON.stringify(mobile));
 if(mobile.width!==390||mobile.scrollWidth>392||mobile.columns!==1||mobile.visibleCards!==13||mobile.filtersScrollWidth>mobile.filtersWidth+2||mobile.maxCardRight>392)throw Error('QA_MOBILE_FAIL');
 console.log('RESULTADO=HOME_LAYOUT_BROWSER_OK');
}finally{
 ws?.close();
 chrome.kill('SIGTERM');
 rmSync(dir,{recursive:true,force:true});
}
