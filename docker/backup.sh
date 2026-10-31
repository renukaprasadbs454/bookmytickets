#!/bin/sh
set -eu
umask 077
stamp=$(date -u +%Y%m%dT%H%M%SZ)
dest="/backups/bmt-$stamp"
mkdir "$dest"
pg_dump -Fc --file="$dest/database.dump"
tar -czf "$dest/media.tar.gz" -C /media .
printf '%s\n' 'Database and media backup. Restore requires the matching APP_KEY stored separately.' > "$dest/README.txt"
echo "Backup saved to $dest"
