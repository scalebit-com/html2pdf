# html2pdf

A simple and efficient command-line tool to convert HTML and TXT files to PDF using Puppeteer.

## Features

- 📄 Convert HTML files to PDF with full CSS support
- 📝 Convert plain text files to PDF with readable formatting
- 📁 **Recursive directory conversion** - batch convert all HTML files in a directory
- 🎨 Clean, styled output with proper margins and typography
- 📱 A4 format with professional 20mm margins
- 🚀 Fast conversion using headless Chrome with browser reuse for batch operations
- 🛡️ Robust error handling and validation
- 📊 Detailed logging with timestamps and conversion statistics
- ⏭️ Skips conversion if output PDF already exists
- 🔧 Configurable output filename patterns

## Installation

### Global Installation (Recommended)
```bash
npm install -g html2pdf
```

### Local Installation
```bash
npm install html2pdf
```

## Usage

### Command Line Interface

html2pdf provides two main commands:

#### Single File Conversion
```bash
html2pdf convert -i <input-file> -o <output-file>
```

#### Recursive Directory Conversion
```bash
html2pdf recurse -d <directory> [--skip-html-extension]
```

### Commands and Options

#### `convert` - Single File Conversion
- `-i, --input <path>` - Input file path (.html or .txt) **[required]**
- `-o, --output <path>` - Output PDF file path **[required]**

#### `recurse` - Recursive Directory Conversion
- `-d, --dir <path>` - Directory to scan recursively for HTML files **[required]**
- `-h, --skip-html-extension` - Skip .html in output filename (default: false)

#### Global Options
- `-V, --version` - Display version number
- `--help` - Display help information

### Examples

#### Single File Conversion
```bash
# Convert HTML to PDF
html2pdf convert -i document.html -o document.pdf

# Convert Text to PDF
html2pdf convert -i notes.txt -o notes.pdf

# Using relative and absolute paths
html2pdf convert -i ./src/index.html -o /Users/john/Downloads/output.pdf
```

#### Recursive Directory Conversion
```bash
# Convert all HTML files in a directory (creates body.html.pdf)
html2pdf recurse -d ./website

# Convert with clean filenames (creates body.pdf instead of body.html.pdf)
html2pdf recurse -d ./website --skip-html-extension

# Convert files in a specific path
html2pdf recurse -d /path/to/html/files
```

#### Filename Pattern Examples
```bash
# Default behavior (preserves .html in filename)
./website/index.html     → ./website/index.html.pdf
./website/about.html     → ./website/about.html.pdf

# With --skip-html-extension flag
./website/index.html     → ./website/index.pdf  
./website/about.html     → ./website/about.pdf
```

## Supported File Types

| Input Format | Description |
|--------------|-------------|
| `.html` | HTML files with full CSS support, images, and web fonts |
| `.txt` | Plain text files (automatically formatted with clean typography) |

## Output Format

- **Format**: PDF (A4 size)
- **Margins**: 20mm on all sides
- **Font**: System fonts (San Francisco on macOS, Segoe UI on Windows, Roboto on Linux)
- **Text**: Optimized for readability with proper line spacing

## Programmatic Usage

You can also use html2pdf programmatically in your Node.js applications:

```javascript
const { convertToPdf } = require('html2pdf');

async function example() {
  try {
    // Single file conversion
    await convertToPdf('input.html', 'output.pdf');
    console.log('Conversion successful!');
    
    // Batch conversion with shared browser instance
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ headless: 'new' });
    
    try {
      await convertToPdf('file1.html', 'file1.pdf', browser);
      await convertToPdf('file2.html', 'file2.pdf', browser);
      await convertToPdf('file3.html', 'file3.pdf', browser);
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Conversion failed:', error.message);
  }
}
```

## Requirements

- Node.js 14 or higher
- Chrome/Chromium (automatically installed with Puppeteer)

## How It Works

1. **File Validation**: Checks if input file exists and has supported extension
2. **Directory Creation**: Automatically creates output directories if they don't exist
3. **Content Processing**: 
   - HTML files are loaded directly with full CSS/JS support
   - TXT files are wrapped in a clean HTML template
4. **PDF Generation**: Uses Puppeteer's headless Chrome to generate high-quality PDFs
5. **Cleanup**: Properly closes browser instances and handles errors

## Error Handling

The tool provides clear error messages for common issues:

- ❌ Input file doesn't exist
- ❌ Unsupported file format
- ❌ Permission issues with output directory
- ❌ Browser launch failures

## Development

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd html2pdf

# Install dependencies
npm install

# Run locally with convert command
node index.js convert -i example.html -o example.pdf

# Run locally with recurse command
node index.js recurse -d testdata
```

### Testing with Task Runner

This project includes a Taskfile for common development tasks:

```bash
# Convert test HTML file to PDF
task render-testdata

# Clean generated PDF files
task clean-testdata

# Test conversion and verify output
task test-conversion
```

### Manual Testing
```bash
# Test single file conversion
echo '<h1>Hello World</h1>' > test.html
node index.js convert -i test.html -o test.pdf

# Test text file conversion
echo 'Hello World' > test.txt
node index.js convert -i test.txt -o test.pdf

# Test recursive conversion
mkdir -p test-dir
echo '<h1>Page 1</h1>' > test-dir/page1.html
echo '<h1>Page 2</h1>' > test-dir/page2.html
node index.js recurse -d test-dir

# Test skip behavior (run same command twice)
node index.js convert -i test.html -o test.pdf  # Creates PDF
node index.js convert -i test.html -o test.pdf  # Skips with warning

# Test filename patterns
node index.js recurse -d test-dir                    # Creates .html.pdf files
node index.js recurse -d test-dir --skip-html-extension  # Creates .pdf files
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

**Browser launch failed**
- Ensure you have sufficient disk space
- On Linux, you may need to install additional dependencies for Chrome

**Permission denied on output**
- Check write permissions for the output directory
- Use absolute paths to avoid confusion

**Output file already exists**
- The tool automatically skips conversion if the target PDF file already exists
- Use `rm output.pdf` to force regeneration, or choose a different output filename

**Large file conversion is slow**
- This is normal for complex HTML with many images or external resources
- Consider optimizing your HTML/CSS for faster rendering