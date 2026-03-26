#!/usr/bin/env bash
set -euo pipefail

# ─── Configuration ───────────────────────────────────────────
BACKUP_DIR="${BACKUP_DIR:-$HOME/backups/postgres}"
CONTAINER_NAME="creatif_db"
MAX_BACKUPS=10
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/creatifpro_${TIMESTAMP}.sql.gz"

# ─── Pre-flight checks ──────────────────────────────────────
mkdir -p "$BACKUP_DIR"

if ! docker inspect "$CONTAINER_NAME" --format '{{.State.Running}}' 2>/dev/null | grep -q true; then
  echo "ERROR: Container $CONTAINER_NAME is not running" >&2
  exit 1
fi

# Read DB credentials from .env
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: .env file not found at $ENV_FILE" >&2
  exit 1
fi

DB_NAME=$(grep '^POSTGRES_DB=' "$ENV_FILE" | cut -d= -f2-)
DB_USER=$(grep '^POSTGRES_USER=' "$ENV_FILE" | cut -d= -f2-)

# ─── Backup ─────────────────────────────────────────────────
echo "Backing up database '$DB_NAME' → $BACKUP_FILE"

docker exec "$CONTAINER_NAME" \
  pg_dump -U "$DB_USER" -d "$DB_NAME" --clean --if-exists --no-owner \
  | gzip > "$BACKUP_FILE"

SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "Backup complete: $BACKUP_FILE ($SIZE)"

# ─── Rotate old backups (keep last $MAX_BACKUPS) ────────────
BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/creatifpro_*.sql.gz 2>/dev/null | wc -l)
if [ "$BACKUP_COUNT" -gt "$MAX_BACKUPS" ]; then
  REMOVE_COUNT=$((BACKUP_COUNT - MAX_BACKUPS))
  ls -1t "$BACKUP_DIR"/creatifpro_*.sql.gz | tail -n "$REMOVE_COUNT" | xargs rm -f
  echo "Rotated: removed $REMOVE_COUNT old backup(s), keeping last $MAX_BACKUPS"
fi

echo "Done. Current backups: $(ls -1 "$BACKUP_DIR"/creatifpro_*.sql.gz | wc -l)"
