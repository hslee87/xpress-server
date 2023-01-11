#!/bin/sh

SERVER_NAME='server-app-starter'

YMDHIS=`date '+%Y%m%d-%H%M%S'`

rm -f ${SERVER_NAME}*.zip

zip -r ${SERVER_NAME}.zip . \
    -x './node_modules/*' -x 'sql/*' -x 'test/*' -x 'logs/*' \
    -x '.secrets*' -x '.DS*' -x 'uploads/*' -x README.md -x '*.sh' \
    -x '.docker*' '.Docker*' -x '.git*' -x '.js*'

echo "============================================="
echo "To deploy for production, Please check ENV !!"
echo
echo "  NODE_ENV=production"
echo "  DB_SERVER = _DB_SERVER_ "
echo "  DB_USER = _DB_USER_ "
echo "  DB_PASS = _DB_PASSWORD_ "
echo "  DB_NAME = _DATABASE_"
echo "============================================="
