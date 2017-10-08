const fs = require('fs')
const path = require('path')
const _ = require('highland')
const chalk = require('chalk')

const source = fs.createReadStream(path.join(__dirname, 'input', 'emails.in'))
const dest = fs.createWriteStream(path.join(__dirname, 'output', 'emails.out'))

const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g

const start = Date.now()
console.log(chalk.bold.green('Process starting'))

_(source)
  .split()
  .compact()
  .map(line => {
    const match = line.match(EMAIL_REGEX)
    return match ? match[0] : null
  })
  .compact()
  .map(email => email.trim().toLowerCase())
  .sort()
  .collect()
  .map(list => Array.from(new Set(list)))
  .tap(list => console.log(chalk.bold.green(`Registered ${list.length} emails`)))
  .map(list => list.join('\n'))
  .errors(err => console.error(chalk.bold.red(err)))
  .pipe(dest)

dest.on('close', () => console.log(chalk.bold.green(`Finished processing in ${Date.now() - start}ms`)))
