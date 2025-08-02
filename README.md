# topdf

A simple and efficient command-line tool to convert HTML and TXT files to PDF using Puppeteer.

## Features

- 📄 Convert HTML files to PDF with full CSS support
- 📝 Convert plain text files to PDF with readable formatting
- 🎨 Clean, styled output with proper margins and typography
- 📱 A4 format with professional 20mm margins
- 🚀 Fast conversion using headless Chrome
- 🛡️ Robust error handling and validation
- 📊 Detailed logging with timestamps

## Installation

### Global Installation (Recommended)
```bash
npm install -g topdf
```

### Local Installation
```bash
npm install topdf
```

## Usage

### Command Line Interface

```bash
topdf -i <input-file> -o <output-file>
```

#### Options
- `-i, --input <path>` - Input file path (.html or .txt) **[required]**
- `-o, --output <path>` - Output PDF file path **[required]**
- `-V, --version` - Display version number
- `-h, --help` - Display help information

### Examples

#### Convert HTML to PDF
```bash
topdf -i document.html -o document.pdf
```

#### Convert Text to PDF
```bash
topdf -i notes.txt -o notes.pdf
```

#### Using relative and absolute paths
```bash
topdf -i ./src/index.html -o /Users/john/Downloads/output.pdf
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

You can also use topdf programmatically in your Node.js applications:

```javascript
const { convertToPdf } = require('topdf');

async function example() {
  try {
    await convertToPdf('input.html', 'output.pdf');
    console.log('Conversion successful!');
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

# Run locally
node index.js -i example.html -o example.pdf
```

### Testing
```bash
# Test with HTML file
echo '<h1>Hello World</h1>' > test.html
node index.js -i test.html -o test.pdf

# Test with text file
echo 'Hello World' > test.txt
node index.js -i test.txt -o test.pdf
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

**Large file conversion is slow**
- This is normal for complex HTML with many images or external resources
- Consider optimizing your HTML/CSS for faster rendering