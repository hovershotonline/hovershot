// QA de integração: sala, dois jogadores e um tiro em WebSocket real, sem rede externa.
const { spawn } = require('node:child_process');
const { createRequire } = require('node:module');
const { resolve } = require('node:path');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const root = resolve('sources/engines/hillshot');
const loadEngine = createRequire(resolve(root, 'package.json'));
const WebSocket = loadEngine('ws');
// Por padrao testa localhost. O modo remoto e manual, restrito a subdominio
// de homologacao; nunca aponta o QA para producao ou outros projetos.
const remoteHost = (process.env.HOVERSHOT_QA_REMOTE_HOST || '').trim();
const remotePrefix = (process.env.HOVERSHOT_QA_REMOTE_PREFIX || '').trim();
const accessToken = process.env.HOVERSHOT_QA_ACCESS_TOKEN || '';
const remote = Boolean(remoteHost);
if (remote) {
  if (!/^homologacao(?:-[a-z0-9-]+)?\\.hovershot\\.online$/.test(remoteHost))
    throw Error('Host remoto invalido: somente subdominios homologacao*.hovershot.online');
  if (remotePrefix && !/^\\/(?:[a-z0-9-]+\\/?)*$/.test(remotePrefix))
    throw Error('Prefixo remoto invalido');
  if (accessToken.length < 24 || /\\s/.test(accessToken))
    throw Error('Token de acesso da homologacao ausente ou invalido');
} else if (remotePrefix || accessToken) {
  throw Error('Config remota incompleta: falta HOVERSHOT_QA_REMOTE_HOST');
}
const port = 18789;
const prefix = remotePrefix.replace(/\\/$/, '');
const base = remote ? 'https://' + remoteHost + prefix : 'http://127.0.0.1:' + port;
const wsUrl = remote ? 'wss://' + remoteHost + prefix : 'ws://127.0.0.1:' + port;
const authHeaders = remote ? { Authorization: 'Bearer ' + accessToken } : {};
const clients = [];
let server;
let serverLog = '';
function ensure(ok, text) { if (!ok) throw Error(text); }
async function waitReady() {
  for (let i = 0; i < 65; i++) {
    if (!remote) ensure(server.exitCode === null, 'Servidor encerrou: ' + serverLog);
    try {
      const res = await fetch(base + '/health', { headers: authHeaders, signal: AbortSignal.timeout(remote ? 4000 : 900) });
      if (res.status === 200 && await res.text() === 'ok') return;
    } catch {}
    await sleep(150);
  }
  throw Error('Servidor nao respondeu /health: ' + serverLog);
}
function newClient(label) {
  return new Promise((resolveClient, rejectClient) => {
    const ws = new WebSocket(wsUrl, remote ? { headers: authHeaders } : undefined);
    const inbox = [];
    const waiting = new Set();
    let opened = false;
    const connectionTimeout = setTimeout(() => {
      if (!opened) rejectClient(Error(label + ': conexao excedeu 5s'));
    }, 5000);
    ws.on('message', (raw) => {
      let msg;
      try { msg = JSON.parse(String(raw)); } catch { return; }
      inbox.push(msg);
      for (const waiter of Array.from(waiting)) {
        if (waiter.match(msg)) {
          clearTimeout(waiter.timer);
          waiting.delete(waiter);
          waiter.resolve(msg);
        }
      }
    });
    ws.on('error', (err) => {
      if (!opened) rejectClient(err);
    });
    ws.once('open', () => {
      opened = true;
      clearTimeout(connectionTimeout);
      clients.push(ws);
      resolveClient({
        send(type, args={}) { ws.send(JSON.stringify({ type, ...args })); },
        wait(match, ms=7000) {
          const existing = inbox.find(match);
          if (existing) return Promise.resolve(existing);
          return new Promise((resolve, reject) => {
            const waiter = { match, resolve, reject, timer:null };
            waiter.timer = setTimeout(() => {
              waiting.delete(waiter);
              reject(Error(label + ': timeout; mensagens=' + inbox.map(m => m.type).join(',')));
            }, ms);
            waiting.add(waiter);
          });
        }
      });
    });
  });
}
(async () => {
  if (!remote) {
    server = spawn(process.execPath, ['server/server.js'], {
      cwd:root, env:{...process.env, PORT:String(port), NODE_ENV:'test'},
      stdio:['ignore','pipe','pipe']
    });
    server.stdout.on('data', (b) => { serverLog += String(b).slice(-2500); });
    server.stderr.on('data', (b) => { serverLog += String(b).slice(-2500); });
  }
  try {
    await waitReady();
    const response = await fetch(base+'/', { headers: authHeaders, signal: AbortSignal.timeout(remote ? 10000 : 4000) });
    ensure(response.status===200, 'FRONTEND_HTTP=' + response.status);
    ensure((await response.text()).includes('id="createBtn"'), 'FRONTEND_SEM_BOTAO_CRIAR');
    const a = await newClient('anfitriao');
    a.send('create', {name:'Jogador A'});
    const host = await a.wait((x)=>x.type==='joined');
    ensure(/^[A-Z2-9]{4}$/.test(host.code), 'Codigo da sala invalido');
    const b = await newClient('visitante');
    b.send('join', {code:host.code, name:'Jogador B'});
    const guest = await b.wait((x)=>x.type==='joined');
    ensure(guest.code===host.code, 'Visitante entrou em sala errada');
    const lobby = await a.wait((x)=>x.type==='lobby' && x.players && x.players.length===2);
    ensure(lobby.hostId===host.you, 'Anfitriao nao reconhecido');
    a.send('start');
    const initialA = await a.wait((x)=>x.type==='start');
    const initialB = await b.wait((x)=>x.type==='start');
    ensure(initialA.tanks.length===2 && initialB.tanks.length===2, 'Partida nao iniciou com 2 tanques');
    ensure(initialA.turnId===host.you, 'Primeiro turno nao e do anfitriao');
    a.send('fire', {weapon:'shot', angle:45, power:65});
    const firedA = await a.wait((x)=>x.type==='fired');
    const firedB = await b.wait((x)=>x.type==='fired');
    ensure(firedA.shooterId===host.you && firedB.shooterId===host.you, 'Disparo nao replicado');
    ensure(Array.isArray(firedA.shells) && firedA.shells.length>0, 'Trajetoria ausente');
    ensure(firedB.tanks.length===2, 'Estado de tanques nao sincronizado');
    console.log('FRONTEND_HTTP=200');
    console.log('WEB_SOCKET=2_JOGADORES');
    console.log('SALA=CRIADA_E_COMPARTILHADA');
    console.log('TIRO=REPLICADO_EM_DOIS_CLIENTES');
    console.log('RESULTADO=' + (remote ? 'HILLSHOT_MULTIPLAYER_REMOTE_SMOKE_OK' : 'HILLSHOT_MULTIPLAYER_SMOKE_OK'));
  } finally {
    for (const s of clients) s.terminate();
    if (server) {
      server.kill('SIGTERM');
      await Promise.race([
        new Promise(r => server.exitCode!==null ? r() : server.once('exit', r)),
        sleep(1500)
      ]);
      if (server.exitCode===null) server.kill('SIGKILL');
    }
  }
})().catch((e) => {
  console.error('RESULTADO=HILLSHOT_MULTIPLAYER_SMOKE_FALHOU');
  console.error(e.stack || e);
  console.error(serverLog.slice(-2500));
  process.exitCode=1;
});
