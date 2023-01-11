
const fs = require('fs')
const commandLineUsage = require('command-line-usage')

let commandOptions = {}

function showUsage() {
    const sections = [{
            header: 'Main App',
            content: 'Main Server'
        },
        {
            header: 'Options',
            optionList: [{
                    name: 'port',
                    alias: 'p',
                    type: Number,
                    typeLabel: '{underline portNo}',
                    description: '동작 포트 설정'
                }
            ]
        }
    ]

    const usage = commandLineUsage(sections)
    console.log(usage)
}

const commandLineArgs = require('command-line-args')

let optionDefs = [
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'port', alias: 'p', type: Number }
]

try {
    commandOptions = commandLineArgs(optionDefs)

    if (commandOptions.help) {
        let cmd = process.argv[0]
        if (process.argv[0] == 'node') {
            cmd = process.argv[0] + ' ' + process.argv[1]
        }
        // console.log(`${cmd} <Options>`)
        showUsage()
        process.exit(0)
    }
    
    if (commandOptions.port < 0) {
        // 
        showUsage()
        process.exit(-1)
    }
}
catch (e) {
    // console.log(e)
    showUsage()
    process.exit(-1)
}

module.exports = commandOptions