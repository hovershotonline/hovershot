#!/usr/bin/env bash
# Hover Shot: deploy incremental de arquivos estaticos; nunca remove versoes anteriores.
set -Eeuo pipefail
umask 077
RELEASE_DIR="$(realpath "$1")"
SOURCE_SHA="$2"
SOURCE_REPO="$(realpath "$3")"
HOST="186.244.144.164"
PORT="65002"
LOGIN="u415074840"
FINGERPRINT="SHA256:G2RdezrgBuMPq3bXfwulsyYLgfJ1j4L8qcRGJgEHW/M"
BASE="/home/u415074840/domains/_backups_todos_sites/hovershot.online"
STAGE=""
TMP=""
fail(){ echo "RESULTADO=DEPLOY_FALHOU:$1" >&2; exit 1; }
cleanup(){
  local status="$?"
  trap - EXIT
  if [[ -n "$STAGE" && -n "$TMP" ]]; then
    ssh -F "$TMP/config" hovershot-ssh \
      "if [[ -d '$STAGE' && ! -L '$STAGE' ]]; then rm -rf -- '$STAGE'; fi" \
      >/dev/null 2>&1 || true
  fi
  [[ -z "$TMP" ]] || rm -rf -- "$TMP"
  exit "$status"
}
trap cleanup EXIT
[[ "$SOURCE_SHA" =~ ^[a-f0-9]{40}$ ]] || fail SHA_INVALIDO
[[ -d "$RELEASE_DIR" && ! -L "$RELEASE_DIR" && -d "$SOURCE_REPO/.git" ]] || fail ARQUIVOS_AUSENTES
[[ -n "$HOVERSHOT_DEPLOY_SSH_PRIVATE_KEY" ]] || fail SEGREDO_SSH_AUSENTE
for cmd in git ssh ssh-keyscan ssh-keygen rsync curl realpath; do
  command -v "$cmd" >/dev/null || fail "DEPENDENCIA_$cmd"
done
for rel in index.html assets/home.css assets/home.js labs/guntanks/index.html labs/craterfall/index.html; do
  [[ -s "$RELEASE_DIR/$rel" && ! -L "$RELEASE_DIR/$rel" ]] || fail "BUILD_INCOMPLETO_$rel"
done
if find "$RELEASE_DIR" -type l -print -quit | grep -q .; then fail SYMLINK_NO_BUILD; fi
if find "$RELEASE_DIR" -type f \( -name '.env' -o -name '.env.*' -o -name '*.php' -o -name '*.pem' -o -name '*.map' -o -name 'id_ed25519' \) -print -quit | grep -q .; then fail ARQUIVO_PRIVADO_NO_BUILD; fi
[[ ! -e "$RELEASE_DIR/.git" && ! -e "$RELEASE_DIR/.hover-shot-source-commit" ]] || fail BUILD_CONTAMINADO
BUILD_SIZE="$(du -sb "$RELEASE_DIR" | awk '{print $1}')"
[[ "$BUILD_SIZE" -le 104857600 ]] || fail BUILD_MAIOR_QUE_100MB

LATEST="$(git -C "$SOURCE_REPO" ls-remote origin refs/heads/main | awk 'NR==1{print $1}')"
[[ "$LATEST" =~ ^[a-f0-9]{40}$ ]] || fail MAIN_NAO_ENCONTRADA
if [[ "$LATEST" != "$SOURCE_SHA" ]]; then
  echo "RESULTADO=DEPLOY_ANTIGO_IGNORADO"
  exit 0
fi
git -C "$SOURCE_REPO" fetch --quiet --depth 1 --no-tags origin site-build
BUILT_FROM="$(git -C "$SOURCE_REPO" show FETCH_HEAD:.hover-shot-source-commit | tr -d '\r\n')"
[[ "$BUILT_FROM" == "$SOURCE_SHA" ]] || fail SITE_BUILD_DESATUALIZADA

CARDS="$(grep -o 'class="version-card ' "$RELEASE_DIR/index.html" | wc -l | tr -d '[:space:]')"
EXTERNAL="$(grep -o 'class="btn btn-original"' "$RELEASE_DIR/index.html" | wc -l | tr -d '[:space:]')"
LOCAL="$(grep -o 'class="btn btn-main"' "$RELEASE_DIR/index.html" | wc -l | tr -d '[:space:]')"
[[ "$CARDS" -ge 3 && "$EXTERNAL" == "$CARDS" && "$LOCAL" -ge 2 ]] || fail CATALOGO_INCONSISTENTE
for marker in 'id="versao-hovershot"' 'href="/labs/guntanks/"' 'href="/labs/craterfall/"'; do
  grep -Fq "$marker" "$RELEASE_DIR/index.html" || fail CARD_OU_JOGO_AUSENTE
done
printf '%s\n' "$SOURCE_SHA" > "$RELEASE_DIR/.hover-shot-source-commit"

TMP="$(mktemp -d "$RUNNER_TEMP/hovershot-ssh.XXXXXXXX")"
printf '%s\n' "$HOVERSHOT_DEPLOY_SSH_PRIVATE_KEY" > "$TMP/private_key"
chmod 600 "$TMP/private_key"
ssh-keygen -y -P '' -f "$TMP/private_key" >/dev/null 2>&1 || fail CHAVE_SSH_INVALIDA_OU_COM_SENHA

# Capture stderr do scan separadamente; valida o fingerprint antes de conectar.
ssh-keyscan -p "$PORT" -T 15 -t ed25519 "$HOST" > "$TMP/scan" 2> "$TMP/scan_errors" || fail SSH_SCAN_FALHOU
grep -E '^\[186\.244\.144\.164\]:65002[[:space:]]+ssh-ed25519[[:space:]]+' "$TMP/scan" | sort -u > "$TMP/known_hosts"
[[ "$(wc -l < "$TMP/known_hosts")" -eq 1 ]] || fail SSH_HOST_KEY_AUSENTE
ssh-keygen -lf "$TMP/known_hosts" -E sha256 | grep -Fq "$FINGERPRINT" || fail SSH_HOST_FINGERPRINT_DIVERGENTE
cat > "$TMP/config" <<SSHCONFIG
Host hovershot-ssh
 HostName $HOST
 User $LOGIN
 Port $PORT
 IdentityFile $TMP/private_key
 IdentitiesOnly yes
 BatchMode yes
 StrictHostKeyChecking yes
 UserKnownHostsFile $TMP/known_hosts
 ConnectTimeout 15
SSHCONFIG
chmod 600 "$TMP/config"

STAGE="$(ssh -F "$TMP/config" hovershot-ssh bash -s <<'PREFLIGHT'
set -Eeuo pipefail
umask 077
ROOT="/home/u415074840/domains/hovershot.online/public_html"
BASE="/home/u415074840/domains/_backups_todos_sites/hovershot.online"
[[ "$(id -un)" == "u415074840" ]] || exit 11
for dir in "$ROOT" "$ROOT/assets" "$BASE"; do [[ -d "$dir" && ! -L "$dir" ]] || exit 12; done
for cmd in rsync install flock cmp curl mktemp realpath; do command -v "$cmd" >/dev/null || exit 13; done
for rel in index.html .hover-shot-source-commit; do [[ -f "$ROOT/$rel" && ! -L "$ROOT/$rel" ]] || exit 14; done
grep -Fq HOVER "$ROOT/index.html" || exit 15
mktemp -d "$BASE/.github-actions.XXXXXXXX"
PREFLIGHT
)" || fail SSH_PREFLIGHT_FALHOU
[[ "$STAGE" =~ ^/home/u415074840/domains/_backups_todos_sites/hovershot.online/\.github-actions\.[a-zA-Z0-9]{8}$ ]] || fail STAGE_INESPERADO
rsync -rpt --checksum --chmod=D755,F644 \
  -e "ssh -F $TMP/config" "$RELEASE_DIR/" "hovershot-ssh:$STAGE/release/" || fail UPLOAD_FALHOU

ssh -F "$TMP/config" hovershot-ssh bash -s -- "$STAGE" "$SOURCE_SHA" <<'APPLY'
set -Eeuo pipefail
umask 077
STAGE="$1"
SHA="$2"
ROOT="/home/u415074840/domains/hovershot.online/public_html"
BASE="/home/u415074840/domains/_backups_todos_sites/hovershot.online"
[[ "$STAGE" =~ ^/home/u415074840/domains/_backups_todos_sites/hovershot.online/\.github-actions\.[a-zA-Z0-9]{8}$ ]] || exit 41
[[ -d "$STAGE/release" && ! -L "$STAGE/release" ]] || exit 42
[[ "$(tr -d '\r\n' < "$STAGE/release/.hover-shot-source-commit")" == "$SHA" ]] || exit 43
exec 9<"$BASE"
flock -w 90 9 || exit 44

CHANGED=0
mkdir -p "$STAGE/previous"
: > "$STAGE/old.list"
: > "$STAGE/new.list"
on_exit(){
  local status="$?"
  trap - EXIT
  if (( status != 0 && CHANGED == 1 )); then
    echo "==== ROLLBACK ===="
    local bad=0
    while IFS= read -r -d '' rel; do
      install -m 644 "$STAGE/previous/$rel" "$ROOT/$rel" || bad=1
    done < "$STAGE/old.list"
    while IFS= read -r -d '' rel; do
      rm -f -- "$ROOT/$rel" || bad=1
    done < "$STAGE/new.list"
    if (( bad == 0 )); then echo "ROLLBACK=RESTAURADO"; else echo "ROLLBACK=FALHA_REQUER_INSPECAO"; fi
  fi
  rm -rf -- "$STAGE"
  exit "$status"
}
trap on_exit EXIT
trap 'exit 143' HUP INT TERM

apply_file(){
  local rel="$1" src="$STAGE/release/$1" dest="$ROOT/$1"
  local parent="$(dirname "$dest")" cursor
  [[ -f "$src" && ! -L "$src" ]] || return 51
  cursor="$parent"
  while [[ "$cursor" != "$ROOT" ]]; do
    [[ "$cursor" == "$ROOT/"* && ! -L "$cursor" ]] || return 52
    cursor="$(dirname "$cursor")"
  done
  # Somente diretorios ausentes, em ordem ascendente; nenhum modo existente e alterado.
  local -a missing=()
  cursor="$parent"
  while [[ "$cursor" != "$ROOT" && ! -d "$cursor" ]]; do
    missing+=("$cursor")
    cursor="$(dirname "$cursor")"
  done
  for ((i=${#missing[@]}-1;i>=0;i--)); do mkdir -m 755 -- "${missing[$i]}"; done
  [[ ! -L "$dest" ]] || return 53
  if [[ -e "$dest" ]]; then
    [[ -f "$dest" ]] || return 54
    if cmp -s "$src" "$dest"; then return 0; fi
    mkdir -p "$STAGE/previous/$(dirname "$rel")"
    cp -p -- "$dest" "$STAGE/previous/$rel"
    printf '%s\0' "$rel" >> "$STAGE/old.list"
  else
    printf '%s\0' "$rel" >> "$STAGE/new.list"
  fi
  CHANGED=1
  install -m 644 "$src" "$dest"
  cmp -s "$src" "$dest" || return 55
  echo "ATUALIZADO=$rel"
}
find "$STAGE/release" -type f -print0 | LC_ALL=C sort -z > "$STAGE/file-list"
while IFS= read -r -d '' src; do
  rel="$(realpath --relative-to="$STAGE/release" "$src")"
  [[ "$rel" == ".hover-shot-source-commit" ]] && continue
  apply_file "$rel"
done < "$STAGE/file-list"
apply_file .hover-shot-source-commit

[[ "$(tr -d '\r\n' < "$ROOT/.hover-shot-source-commit")" == "$SHA" ]] || exit 57
grep -Fq 'id="versao-hovershot"' "$ROOT/index.html" || exit 58
curl -fsSL --retry 2 --connect-timeout 8 --max-time 40 \
  "https://hovershot.online/?githubdeploy=$SHA" -o "$STAGE/home.html"
grep -Fq 'id="versao-hovershot"' "$STAGE/home.html" || exit 59
# A URL com ?githubdeploy= deve ter a mesma home estática recém-publicada.
cmp -s "$STAGE/home.html" "$ROOT/index.html" || { echo "RESULTADO=HTML_CACHE_INCONSISTENTE" >&2; exit 59; }
grep -Eq 'href="/assets/home.css\?v=[a-f0-9]{12}"' "$STAGE/home.html" || exit 59
grep -Eq 'src="/assets/home.js\?v=[a-f0-9]{12}"' "$STAGE/home.html" || exit 59
# Falha fechada caso Apache entregue um módulo como texto (regressão de 20/11).
for path in /assets/home.css /assets/home.js /assets/playtest-model.js; do
  curl -fsSL --retry 2 --connect-timeout 8 --max-time 25 \
    -D "$STAGE/content-headers" -o "$STAGE/content-body" \
    "https://hovershot.online$path?githubdeploy=$SHA" || exit 61
  if [[ "$path" == *.css ]]; then
    tr -d '\r' < "$STAGE/content-headers" | grep -Eiq '^content-type:[[:space:]]*text/css([[:space:];]|$)' || { echo "RESULTADO=MIME_CSS_INVALIDO" >&2; exit 62; }
    grep -Fq '.version-card' "$STAGE/content-body" || exit 62
  else
    tr -d '\r' < "$STAGE/content-headers" | grep -Eiq '^content-type:[[:space:]]*[^;]*javascript' || { echo "RESULTADO=MIME_JS_INVALIDO" >&2; exit 63; }
  fi
  echo "MIME_OK=$path"
done
for route in /assets/home.css /assets/home.js /labs/guntanks/ /labs/craterfall/; do
  curl -fsSL --retry 2 --connect-timeout 8 --max-time 25 \
    "https://hovershot.online$route?githubdeploy=$SHA" -o /dev/null || exit 60
  echo "HTTP_OK=$route"
done
echo "SOURCE_SHA=$SHA"
echo "MYSQL=INALTERADO"
echo "OUTROS_DOMINIOS=INALTERADOS"
echo "ARQUIVOS_ANTERIORES=PRESERVADOS"
echo "BACKUP_PERMANENTE=NAO"
echo "RESULTADO=HOVER_SHOT_DEPLOY_ONLINE"
APPLY
echo "RESULTADO=GITHUB_ACTIONS_DEPLOY_VALIDADO"
