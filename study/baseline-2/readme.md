#build the backend node files
webpack --mode=development --config .\webpack.backend.js

#build the frontend node files
webpack --mode=development --config .\webpack.frontend.js
