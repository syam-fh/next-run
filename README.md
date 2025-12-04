# next-run

A command-line interface (CLI) tool designed to streamline the execution of Next.js project scripts (`npm run dev`, `npm run build`, `npm run start`), offering optional custom port configuration.

## Features

*   **Mode Selection**: Interactively choose between development (`dev`), build (`build`), or production start (`start`) modes.
*   **Custom Port Configuration**: Optionally specify a custom port number prior to execution.
*   **Simplified Execution**: Eliminates the need to manually type full `npm run` commands.

## Requirements

*   **Node.js**: Version 14.8.0 or higher is required (Node.js 18+ is recommended).
    *   This tool utilizes ECMAScript Modules (ESM) syntax.
    *   The CLI operates independently via Node.js, ensuring compatibility with projects using CommonJS or ESM.

To verify your Node.js version, execute:

```bash
node --version
```

## Prerequisites

Ensure that **Next.js** is installed in your project. `next-run` acts as a wrapper around the standard Next.js CLI commands.

To initialize a new Next.js project:

```bash
npx create-next-app@latest your-app
```

Your `package.json` must contain the standard Next.js scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

## Installation

Install the package globally to access the `next-run` command from any directory:

```bash
npm install -g next-run
```

## Usage

Navigate to your Next.js project directory and run:

```bash
next-run
```

Follow the interactive prompts to select the desired mode and optionally configure the port.

---

**Note**: This CLI leverages modern ESM features and dependencies (`chalk`, `inquirer`). It requires a Node.js runtime of version 14.8 or higher. No project configuration changes are necessary for compatibility.