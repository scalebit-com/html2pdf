# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js CLI tool called `html2pdf` that converts HTML and TXT files to PDF using Puppeteer. The project is published as an npm package with a binary entry point.

## Commands

### Installation and Development
```bash
# Install dependencies
npm install

# Run the tool directly
npm start -- -i input.html -o output.pdf

# Run as installed binary
html2pdf -i input.html -o output.pdf
```

### Development Commands
```bash
# Convert test HTML file to PDF
task render-testdata

# Clean generated PDF files
task clean-testdata

# Test conversion and verify output
task test-conversion
```

### Usage Commands
```bash
# Convert HTML to PDF
html2pdf -i example.html -o example.pdf

# Convert TXT to PDF
html2pdf -i document.txt -o document.pdf

# Note: Skips conversion if output PDF already exists
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
- Skips conversion if target PDF already exists (with warning log)
- Task runner integration for development workflow

### Dependencies

- `puppeteer`: Headless Chrome for PDF generation
- `commander`: CLI argument parsing
- `chalk`: Terminal output coloring

## File Structure

- `index.js`: Main entry point containing all functionality
- `package.json`: Package configuration with binary setup
- `Taskfile.yml`: Task runner configuration for development commands
- `testdata/`: Directory containing test files (PDFs are gitignored)
- `testdata/testfile.html`: Complex HTML test file with tables, styling, and layouts