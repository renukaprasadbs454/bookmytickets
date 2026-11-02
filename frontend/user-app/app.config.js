const fs = require('node:fs');
module.exports = ({config}) => {
 const file=process.env.GOOGLE_SERVICES_FILE;
 if(file&&!fs.existsSync(file))throw new Error('GOOGLE_SERVICES_FILE was set but is not mounted in the build container');
 return {...config,android:{...config.android,...(file?{googleServicesFile:file}:{})}};
};
