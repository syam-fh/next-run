#!/usr/bin/env node

/*!
 * next-server v1.0.0
 * (c) 2025 Syam Farijal
 * Released under the MIT License
 */

import { execSync } from 'child_process'
import inquirer from 'inquirer'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const DEFAULT_PORT = 3000

const log = {
  info: (msg) => console.log(chalk.cyan(msg)),
  success: (msg) => console.log(chalk.green(msg)),
  error: (msg) => console.log(chalk.red(msg)),
  title: (msg) => console.log(chalk.bold.magenta(msg)),
}

function isNextJsProject() {
  try {
    const pkgPath = path.join(process.cwd(), 'package.json')
    const content = fs.readFileSync(pkgPath, 'utf8')
    const projectPkg = JSON.parse(content)
    return (
      (projectPkg.dependencies && projectPkg.dependencies.next) ||
      (projectPkg.devDependencies && projectPkg.devDependencies.neuxt)
    )
  } catch {
    return false
  }
}

function showHelp() {
  console.log(`
${chalk.bold('next-server')} – CLI tool to manage Next.js development and production workflows.

${chalk.bold('Interactive mode (default):')}
  next-server                → Display interactive menu

${chalk.bold('Non-interactive mode:')}
  next-server --dev [--host <addr>] [--port <num>]
  next-server --build
  next-server --start

${chalk.bold('Host options:')}
  --host 127.0.0.1    → Local only (secure, default in interactive mode)
  --host 0.0.0.0      → Accessible on local network (use cautiously)

${chalk.bold('Examples:')}
  next-server --dev --host 127.0.0.1 --port 4000
  next-server --dev --host 0.0.0.0 --port 3001

${chalk.bold('Other:')}
  next-server --help    → Show this help
  next-server --version → Show version

${chalk.dim('Note: Uses "npx next" to ensure local Next.js CLI is used.')}
`)
  process.exit(0)
}

function showVersion() {
  console.log(pkg.version)
  process.exit(0)
}

function runCommand(cmd) {
  try {
    execSync(cmd, { stdio: 'inherit' })
  } catch (err) {
    log.error(`❌ Command failed: ${cmd}`)
    process.exit(1)
  }
}

function getPortFromEnv() {
  try {
    const envPath = path.join(process.cwd(), '.env.local')
    const content = fs.readFileSync(envPath, 'utf8')
    const match = content.match(/PORT\s*=\s*(\d+)/)
    return match ? parseInt(match[1], 10) : null
  } catch {
    return null
  }
}

async function selectHost() {
  const { hostChoice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'hostChoice',
      message: 'Select host binding:',
      choices: [
        { name: '🔒 Secure (localhost only) — 127.0.0.1', value: '127.0.0.1' },
        { name: '🌐 Open (network accessible) — 0.0.0.0', value: '0.0.0.0' },
        { name: '✏️ Custom host (e.g., 192.168.x.x)', value: 'custom' },
      ],
    },
  ])

  if (hostChoice === 'custom') {
    const { customHost } = await inquirer.prompt([
      {
        type: 'input',
        name: 'customHost',
        message: 'Enter custom host address:',
        validate: (input) => {
          const trimmed = input.trim()
          return trimmed ? true : 'Host address cannot be empty.'
        },
      },
    ])
    return customHost.trim()
  }

  return hostChoice
}

async function devMode(port = null, host = null) {
  let finalPort = port
  let finalHost = host

  // Port selection
  if (finalPort === null) {
    const envPort = getPortFromEnv()
    const suggestedPort = envPort || DEFAULT_PORT
    const { userPort } = await inquirer.prompt([
      {
        type: 'input',
        name: 'userPort',
        message: 'Enter port for the development server:',
        default: suggestedPort.toString(),
        validate: (input) => {
          const num = parseInt(input, 10)
          return !isNaN(num) && num > 0 && num < 65536
            ? true
            : 'Please enter a valid port number between 1 and 65535.'
        },
      },
    ])
    finalPort = parseInt(userPort, 10)
  }

  // Host selection
  if (finalHost === null) {
    finalHost = await selectHost()
  }

  log.info(`🚀 Starting Next.js dev server on ${finalHost}:${finalPort}...`)

  // Use npx to ensure local next binary is used
  const devCommand = `npx next dev --port ${finalPort} --hostname ${finalHost}`
  runCommand(devCommand)
}

function buildMode() {
  log.info('📦 Building Next.js application for production...')
  runCommand('npm run build')
  log.success('✅ Build completed successfully.')
}

function startMode() {
  log.info('▶️ Starting production server...')
  runCommand('npm start')
}

async function showMenu() {
  if (!isNextJsProject()) {
    log.error(
      '❌ This does not appear to be a Next.js project.\n   Make sure "next" is listed in your package.json dependencies.'
    )
    process.exit(1)
  }

  log.title('\n✨ Next.js Development Helper')
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Select an option:',
      choices: [
        { name: 'Start development server', value: 'dev' },
        { name: 'Build for production', value: 'build' },
        { name: 'Start production server', value: 'start' },
        { name: 'Show help', value: 'help' },
        { name: 'Exit', value: 'exit' },
      ],
    },
  ])

  switch (action) {
    case 'dev':
      await devMode()
      break
    case 'build':
      buildMode()
      break
    case 'start':
      startMode()
      break
    case 'help':
      showHelp()
      break
    case 'exit':
      log.info('Goodbye! Happy coding! 💻✨')
      process.exit(0)
  }
}

// === Main execution logic ===
const args = process.argv.slice(2)

if (args.includes('--help') || args.includes('-h')) {
  showHelp()
}
if (args.includes('--version') || args.includes('-v')) {
  showVersion()
}

// Interactive mode
if (args.length === 0) {
  console.clear()
  await showMenu()
  process.exit(0)
}

// Parse CLI flags
const hasDev = args.includes('--dev')
const hasBuild = args.includes('--build')
const hasStart = args.includes('--start')

const portIndex = args.indexOf('--port')
const portValue = portIndex !== -1 ? args[portIndex + 1] : null

const hostIndex = args.indexOf('--host')
const hostValue = hostIndex !== -1 ? args[hostIndex + 1] : null

// Validate port
let parsedPort = null
if (portValue !== null) {
  if (!/^\d+$/.test(portValue)) {
    log.error('❌ --port must be followed by a valid integer.')
    process.exit(1)
  }
  parsedPort = parseInt(portValue, 10)
  if (parsedPort <= 0 || parsedPort >= 65536) {
    log.error('❌ Port must be between 1 and 65535.')
    process.exit(1)
  }
}

// Validate host
let parsedHost = null
if (hostValue !== null) {
  const trimmed = hostValue.trim()
  if (!trimmed) {
    log.error('❌ --host must be followed by a valid host address.')
    process.exit(1)
  }
  parsedHost = trimmed
}

// --port and --host only allowed with --dev
if ((portValue !== null || hostValue !== null) && !hasDev) {
  log.error('❌ --port and --host can only be used with --dev.')
  process.exit(1)
}

// Validate exactly one mode
const modes = [hasDev, hasBuild, hasStart].filter(Boolean)
if (modes.length === 0) {
  log.error('❌ Please specify one of: --dev, --build, or --start.')
  process.exit(1)
}
if (modes.length > 1) {
  log.error('❌ Only one mode can be specified at a time.')
  process.exit(1)
}

// Safety check for non-interactive mode
if (!isNextJsProject()) {
  log.error('❌ This does not appear to be a Next.js project.')
  process.exit(1)
}

// Execute
if (hasDev) {
  devMode(parsedPort, parsedHost)
} else if (hasBuild) {
  buildMode()
} else if (hasStart) {
  startMode()
}
