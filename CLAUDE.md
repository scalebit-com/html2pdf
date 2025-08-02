# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js CLI tool called `topdf` that converts HTML and TXT files to PDF using Puppeteer. The project is published as an npm package with a binary entry point.

## Commands

### Installation and Development
```bash
# Install dependencies
npm install

# Run the tool directly
npm start -- -i input.html -o output.pdf

# Run as installed binary
topdf -i input.html -o output.pdf
```

### Usage Commands
```bash
# Convert HTML to PDF
topdf -i example.html -o example.pdf

# Convert TXT to PDF
topdf -i document.txt -o document.pdf
```

## Architecture

### Core Components

- **CLI Interface**: Uses `commander` for argument parsing with required `-i` (input) and `-o` (output) options
- **Logger Class**: Custom logging with timestamp and colored output using `chalk`
- **PDF Conversion**: Single `convertToPdf` function that handles both HTML and TXT files
- **File Processing**: 
  - HTML files are loaded directly into Puppeteer
  - TXT files are wrapped in HTML template with basic styling for readability

### Key Features

- Supports both `.html` and `.txt` file inputs
- Automatic output directory creation
- A4 format with 20mm margins
- Network idle waiting for HTML rendering
- Graceful error handling and cleanup
- Modular exports for programmatic use

### Dependencies

- `puppeteer`: Headless Chrome for PDF generation
- `commander`: CLI argument parsing
- `chalk`: Terminal output coloring

## File Structure

- `index.js`: Main entry point containing all functionality
- `package.json`: Package configuration with binary setup