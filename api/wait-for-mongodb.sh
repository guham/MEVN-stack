#!/bin/sh
# wait-for-mongodb.sh

set -e

cmd="$1"

until mongo $MONGODB_URI --eval "quit()"; do
  >&2 echo "MongoDB is unavailable - waiting"
  sleep 1
done

>&2 echo "MongoDB is up - executing command"
exec $cmd
