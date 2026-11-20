import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source=(path)=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const workflow=source('.github/workflows/ci.yml');
const deploy=source('scripts/deploy-hostinger.sh');

test('o deploy so executa depois do build e do QA multiplayer aprovados',()=>{
  assert.match(workflow,/needs: \[build, hillshot-multiplayer-qa\]/);
  assert.match(workflow,/deploy-hostinger:\s*\n\s*name: Publicar hovershot\.online por SSH\s*\n\s*needs: preparar-publicacao/);
  assert.match(workflow,/github\.event_name != 'pull_request'/);
  assert.match(workflow,/workflow_dispatch:/);
  assert.match(workflow,/cancel-in-progress: false/);
});
test('deploy depende de segredo e falha fechada quando nao configurado',()=>{
  assert.match(workflow,/secrets\.HOVERSHOT_DEPLOY_SSH_PRIVATE_KEY/);
  assert.match(workflow,/steps\.credential\.outputs\.ready == 'true'/);
  assert.match(workflow,/DEPLOY=AGUARDANDO_CREDENCIAL_SSH/);
  assert.match(deploy,/CHAVE_SSH_INVALIDA_OU_COM_SENHA/);
  assert.doesNotMatch(deploy,/set -x/);
});
test('publicacao e idempotente e valida host e origem de compilacao',()=>{
  assert.match(deploy,/ssh-keygen -lf/);
  assert.match(deploy,/SSH_HOST_FINGERPRINT_DIVERGENTE/);
  assert.match(deploy,/SITE_BUILD_DESATUALIZADA/);
  assert.match(deploy,/DEPLOY_ANTIGO_IGNORADO/);
  assert.match(deploy,/--checksum/);
  assert.doesNotMatch(deploy,/^\s*rsync[^\n]*--delete/m);
  assert.match(deploy,/flock -w 90/);
});
test('rollback temporario e caminhos restritos ao site',()=>{
  assert.match(deploy,/domains\/hovershot\.online\/public_html/);
  assert.match(deploy,/domains\/_backups_todos_sites\/hovershot\.online/);
  assert.match(deploy,/ROLLBACK=RESTAURADO/);
  assert.match(deploy,/BACKUP_PERMANENTE=NAO/);
  assert.match(deploy,/ARQUIVOS_ANTERIORES=PRESERVADOS/);
  assert.match(deploy,/MYSQL=INALTERADO/);
  assert.match(deploy,/OUTROS_DOMINIOS=INALTERADOS/);
});
test('build nao remove versoes ja publicadas',()=>{
  assert.match(deploy,/labs\/guntanks\/index\.html/);
  assert.match(deploy,/labs\/craterfall\/index\.html/);
  assert.match(deploy,/class="btn btn-original"/);
  assert.match(deploy,/id="versao-hovershot"/);
});
