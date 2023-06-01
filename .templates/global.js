const packageJson = require('../package.json')

module.exports = () => {
  return {
    prefix: "tp",
    projectName: packageJson.name
  }
}
