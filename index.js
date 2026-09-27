#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import process from 'node:process'
import * as p from '@clack/prompts'

const templateDir = path.join(import.meta.dirname, 'template')

const usage = [
  'Usage: npm create arsh-electron@latest [project-name] [--yes]',
  '',
  '  --yes   Skip prompts and use defaults (git init included)',
].join('\n')

function slugify(name) {
  return name.trim().toLowerCase().replace(/[^a-z\d-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

function toProductName(name) {
  return name
    .split(/[^a-zA-Z\d]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('') || 'ArshApp'
}

function isEmptyDir(dir) {
  return !fs.existsSync(dir) || fs.readdirSync(dir).length === 0
}

function emptyDir(dir) {
  for (const entry of fs.readdirSync(dir)) {
    fs.rmSync(path.join(dir, entry), { recursive: true, force: true })
  }
}

function gitAvailable() {
  try {
    execFileSync('git', ['--version'], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function initGit(projectDir) {
  const run = (args) => execFileSync('git', args, { cwd: projectDir, stdio: 'ignore' })
  run(['init'])
  run(['add', '-A'])
  try {
    run(['commit', '-m', 'chore: initial commit'])
  } catch {
    p.log.warn('git commit skipped — set user.name / user.email, then commit manually')
  }
}

function applyRenames(projectDir, { packageName, productName, appId }) {
  const replace = (file, pairs) => {
    const file_ = path.join(projectDir, file)
    let content = fs.readFileSync(file_, 'utf8')
    for (const [from, to] of pairs) content = content.split(from).join(to)
    fs.writeFileSync(file_, content)
  }
  replace('package.json', [['"name": "arsh-electron-app"', `"name": "${packageName}"`]])
  replace('electron-builder.json5', [['com.arshdelight.arshapp', appId], ['"productName": "ArshApp"', `"productName": "${productName}"`]])
  replace('index.html', [['Arsh Electron', productName]])
  replace('src/App.tsx', [['brand="Arsh Electron"', `brand="${productName}"`]])
  replace('README.md', [['# Arsh Electron', `# ${productName}`]])
}

async function main() {
  const args = process.argv.slice(2)
  if (args.includes('-h') || args.includes('--help')) {
    console.log(usage)
    return
  }

  const yes = args.includes('--yes')
  const positional = args.find((a) => !a.startsWith('-'))
  const nonInteractive = !process.stdout.isTTY || yes

  p.intro('create-arsh-electron')

  let projectName = positional
  if (!projectName) {
    if (nonInteractive) {
      p.log.error(`Project name is required in non-interactive mode.\n${usage}`)
      process.exitCode = 1
      return
    }
    const res = await p.text({
      message: 'Project name',
      placeholder: 'my-app',
      validate: (v) => {
        if (!v || !v.trim()) return 'Please enter a project name'
        if (!slugify(v)) return 'Must contain letters or digits'
      },
    })
    if (p.isCancel(res)) return
    projectName = res
  }

  const slug = slugify(projectName)
  if (!slug) {
    p.log.error('Project name must contain letters or digits')
    process.exitCode = 1
    return
  }
  const projectDir = path.resolve(process.cwd(), slug)
  const packageName = slug
  const productName = toProductName(slug)
  const appId = `com.arshdelight.${slug.replace(/-/g, '')}`

  if (!isEmptyDir(projectDir)) {
    let overwrite = yes
    if (process.stdout.isTTY && !yes) {
      const res = await p.confirm({
        message: `Directory "${slug}" is not empty. Remove existing files and continue?`,
        initialValue: false,
      })
      if (p.isCancel(res)) return
      overwrite = res
    }
    if (!overwrite) {
      p.log.warn('Cancelled — directory left untouched')
      return
    }
    emptyDir(projectDir)
  }

  const spinner = p.spinner()
  spinner.start('Scaffolding project…')
  fs.cpSync(templateDir, projectDir, { recursive: true })
  applyRenames(projectDir, { packageName, productName, appId })

  let gitNote = ''
  if (gitAvailable()) {
    let doGit = true
    if (process.stdout.isTTY && !yes) {
      const res = await p.confirm({ message: 'Initialize a git repository and make the first commit?', initialValue: true })
      if (p.isCancel(res)) return
      doGit = res
    }
    if (doGit) {
      try {
        initGit(projectDir)
        gitNote = 'git repository initialized with a first commit'
      } catch {
        gitNote = 'git initialization failed — you can run it manually'
      }
    }
  } else {
    gitNote = 'git not found — skipped version control setup'
  }
  spinner.stop('Project scaffolded')

  const nextSteps = [
    `cd ${slug}`,
    'npm install',
    'npm run dev',
  ]
  p.note(
    [
      ...nextSteps,
      '',
      'Then open the project with any AI coding tool —',
      'AGENTS.md is a bootstrap: the first AI session will interview you',
      'and write the project conventions.',
      gitNote,
    ].join('\n'),
    'Next steps',
  )
  p.outro(`Done. Build something marvelous with ${productName}.`)
}

main().catch((err) => {
  p.log.error(String(err?.message ?? err))
  process.exitCode = 1
})
