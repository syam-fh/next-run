# `next-server`

A simple CLI tool to quickly run `npm run dev`, `npm run build`, or `npm run start` in your Next.js projects—with optional custom **PORT** support.

## ✨ Features

- Choose your mode: **dev**, **build**, or **start**.
- Optionally specify a custom **PORT** before running the command.
- Skip typing full `npm run ...` commands—just run `next-server` and go!

## 📌 Requirements

- **Node.js ≥ 14.8.0** (recommended: **Node.js 18+**)
  - This tool uses **ECMAScript Modules (ESM)** via `import` syntax.
  - Older Node.js versions (<14.8) **do not support ESM in CLI scripts** and will fail.

> 💡 Check your version with:  
> ```bash
> node --version
> ```

## 📦 Prerequisites

Your project must already have **Next.js** installed, as `next-server` wraps the standard Next.js CLI (`next dev`, `next build`, `next start`).

To create a new Next.js project:

```bash
npx create-next-app@latest your-app
```

Ensure your `package.json` includes the standard scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

## 🚀 Installation & Usage

### Option 1: Install globally (recommended for frequent use)

```bash
npm install -g https://github.com/syam-fh/next-server.git
```

> 💡 This package uses:
> - [`chalk@5`](https://www.npmjs.com/package/chalk) — **ESM-only**, for terminal styling  
> - [`inquirer@12`](https://www.npmjs.com/package/inquirer) — **ESM-only**, for interactive prompts  
>
> Since both are listed in `dependencies`, **npm installs them automatically** during global install. No extra steps needed!

Then, from any Next.js project directory:

```bash
next-server
```

### Option 2: Run directly with `npx` (no install required)

```bash
npx syam-fh/next-server
```

Great for quick use or testing—npx handles dependency installation temporarily under the hood.

---

> ⚠️ **Note**: Because this tool uses modern ESM (`import` syntax) and ESM-only dependencies, it **will not work** in CommonJS-only environments or with Node.js < 14.8. Make sure your runtime environment meets the requirements above.

---