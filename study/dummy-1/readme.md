#build the backend node files
webpack --mode=development --config .\webpack.backend.js

#run this on an XiaoMi HM4A phone

install termux (must be android 5.0+)

then run 
pkg install nodejs

pkg upgrade && pkg install autoconf automake bison bzip2 clang cmake \
coreutils diffutils flex gawk git grep gzip libtool make patch perl  \
sed silversearcher-ag tar wget pkg-config

download node-sqlite3 source code
(at the moment, I don't find any other alternatives for database on termux as light as sqlite)

git clone https://github.com/mapbox/node-sqlite3.git


npm install --build-from-source --python=/data/data/com.termux/files/usr/bin/python2

#this does not work for android, since it involves compiling sqlite3 code with node stub headers
#change to use 
http://kripken.github.io/sql.js/documentation/#http://kripken.github.io/sql.js/documentation/extra/README.md.html