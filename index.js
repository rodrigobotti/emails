const fs = require('fs')
const path = require('path')
const _ = require('highland')
const chalk = require('chalk')

const source = fs.createReadStream(path.join(__dirname, 'input', 'emails.in'))
const dest = fs.createWriteStream(path.join(__dirname, 'output', 'emails.out'))

const start = Date.now()
console.log(chalk.bold.green('Process starting'))

_(source)
  .split()
  .compact()
  .filter(line => line.includes('@'))
  .map(line => line.split('|')[0])
  .map(email => email.trim().toLowerCase())
  .sort()
  .collect()
  .map(list => Array.from(new Set(list)).join('\n'))
  .errors(err => console.error(chalk.bold.red(err)))
  .pipe(dest)

dest.on('close', () => console.log(chalk.bold.green(`Finished processing in ${Date.now() - start}ms`)))
