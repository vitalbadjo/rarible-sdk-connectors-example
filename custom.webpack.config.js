const fs = require('fs')

// WebPack.config File
const fileConfig = 'node_modules/react-scripts/config/webpack.config.js'

new Promise((resolve) => {
    fs.readFile(fileConfig, 'utf8', function (err, data) {
        if (err) {
            return console.log(err)
        }
        resolve(data)
    })
}).then((file) => {

    let CodeAsString = "resolve:{fallback: { 'buffer': false, 'os': false, 'url': false,'url': false,'https': false, 'http': false, 'assert': false, 'crypto': false, 'path': false, 'stream': false},"

    let regexCode = /resolve\: \{/g

    let result = file.replace(regexCode, CodeAsString)

    fs.writeFile(fileConfig, result, function (err) {
        if (err) return console.log(err)
        console.log('The webpack.config file was modifed!')
    })
})
