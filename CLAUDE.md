# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js CLI tool called `html2pdf` that converts HTML and TXT files to PDF using Puppeteer. The project supports both single file conversion and recursive directory processing with optimized browser instance reuse for batch operations.

## Commands

### Installation and Development
```bash
# Install dependencies
npm install

# Run the tool directly (convert subcommand)
npm start -- convert -i input.html -o output.pdf

# Run the tool directly (recurse subcommand)
npm start -- recurse -d directory

# Run as installed binary (convert subcommand)
html2pdf convert -i input.html -o output.pdf

# Run as installed binary (recurse subcommand)
html2pdf recurse -d directory
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

#### Single File Conversion
```bash
# Convert HTML to PDF
html2pdf convert -i example.html -o example.pdf

# Convert TXT to PDF
html2pdf convert -i document.txt -o document.pdf
```

#### Recursive Directory Conversion
```bash
# Convert all HTML files in directory (creates .html.pdf files)
html2pdf recurse -d ./website

# Convert with clean filenames (creates .pdf files)
html2pdf recurse -d ./website --skip-html-extension

# Convert specific directory
html2pdf recurse -d /path/to/html/files
```

#### CLI Help
```bash
# Show main help
html2pdf --help

# Show convert subcommand help
html2pdf convert --help

# Show recurse subcommand help
html2pdf recurse --help
```

#### Notes
- Skips conversion if output PDF already exists (with warning log)
- Recursive mode uses single browser instance for performance
- Directory validation with clear error messages
- Conversion statistics logged after batch operations

## Architecture

### Core Components

- **CLI Interface**: Uses `commander` with subcommands (`convert` and `recurse`)
  - `convert`: Single file conversion with `-i` (input) and `-o` (output) options
  - `recurse`: Directory scanning with `-d` (directory) and optional `--skip-html-extension`
- **Logger Class**: Custom logging with timestamp and colored output using `chalk`
- **PDF Conversion**: Core `convertToPdf` function with optional browser instance parameter
- **Directory Scanner**: `findHtmlFiles` function for recursive HTML file discovery
- **Filename Generator**: `generateOutputPath` function with configurable extension handling
- **File Processing**: 
  - HTML files are loaded directly into Puppeteer
  - TXT files are wrapped in HTML template with basic styling for readability

### Key Features

- **Dual Operation Modes**: Single file and recursive directory conversion
- **Browser Optimization**: Reuses browser instance for batch operations to improve performance
- **Configurable Output**: Optional clean filename generation (skip .html extension)
- **Enhanced Logging**: File paths, conversion progress, and statistics reporting
- **Robust Validation**: Directory existence checks and proper error handling
- **Smart Skipping**: Detects existing PDFs and skips conversion with warnings
- **Supports both `.html` and `.txt` file inputs**
- **Automatic output directory creation**
- **A4 format with 20mm margins**
- **Network idle waiting for HTML rendering**
- **Graceful error handling and cleanup**
- **Modular exports for programmatic use**
- **Task runner integration for development workflow**

### Dependencies

- `puppeteer`: Headless Chrome for PDF generation
- `commander`: CLI argument parsing
- `chalk`: Terminal output coloring

## File Structure

- `index.js`: Main entry point containing all functionality including:
  - `convertToPdf()`: Core conversion function with browser reuse support
  - `findHtmlFiles()`: Recursive directory scanner
  - `generateOutputPath()`: Filename pattern generator
  - `convertCommand()`: Single file conversion handler
  - `recurseCommand()`: Batch conversion handler
  - `main()`: CLI setup with subcommands
- `package.json`: Package configuration with binary setup
- `Taskfile.yml`: Task runner configuration for development commands
- `testdata/`: Directory containing test files (PDFs are gitignored)
- `testdata/testfile.html`: Complex HTML test file with tables, styling, and layouts

## Function Reference

### `convertToPdf(inputPath, outputPath, browser = null)`
- **Purpose**: Convert single HTML/TXT file to PDF
- **Parameters**:
  - `inputPath`: Path to input file (.html or .txt)
  - `outputPath`: Path for output PDF file
  - `browser`: Optional Puppeteer browser instance for reuse
- **Returns**: Boolean indicating if conversion occurred (false if skipped)

### `findHtmlFiles(dir)`
- **Purpose**: Recursively find all HTML files in directory
- **Parameters**: `dir` - Directory path to scan
- **Returns**: Array of absolute paths to HTML files

### `generateOutputPath(inputPath, skipHtmlExtension)`
- **Purpose**: Generate output PDF filename
- **Parameters**:
  - `inputPath`: Original HTML file path
  - `skipHtmlExtension`: Boolean to control filename pattern
- **Returns**: Generated PDF file path
- **Behavior**:
  - `false`: `body.html` → `body.html.pdf`
  - `true`: `body.html` → `body.pdf`