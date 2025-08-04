#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { Command } = require('commander');
const chalk = require('chalk');

class Logger {
  log(level, message, colorFunc) {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    console.log(`${timestamp} ${colorFunc(level)} ${message}`);
  }

  info(message) {
    this.log('INFO', message, chalk.green);
  }

  error(message) {
    this.log('ERROR', message, chalk.red);
  }

  warn(message) {
    this.log('WARN', message, chalk.yellow);
  }

  debug(message) {
    this.log('DEBUG', message, chalk.cyan);
  }
}

const logger = new Logger();

async function convertToPdf(inputPath, outputPath, browser = null) {
  let localBrowser = null;
  const shouldCloseBrowser = !browser;
  
  try {
    logger.info(`Starting PDF conversion: ${inputPath} -> ${outputPath}`);
    
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file does not exist: ${inputPath}`);
    }

    if (fs.existsSync(outputPath)) {
      logger.warn(`Output file already exists, skipping conversion: ${outputPath}`);
      return false;
    }

    const ext = path.extname(inputPath).toLowerCase();
    if (!['.html', '.txt'].includes(ext)) {
      throw new Error(`Unsupported file format: ${ext}. Only .html and .txt files are supported.`);
    }

    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      logger.info(`Creating output directory: ${outputDir}`);
      fs.mkdirSync(outputDir, { recursive: true });
    }

    if (!browser) {
      logger.info('Launching browser...');
      localBrowser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      browser = localBrowser;
    }
    
    const page = await browser.newPage();
    
    try {
      const fileContent = fs.readFileSync(inputPath, 'utf8');
      
      if (ext === '.html') {
        logger.info('Processing HTML file...');
        await page.setContent(fileContent, {
          waitUntil: 'networkidle2'
        });
      } else if (ext === '.txt') {
        logger.info('Processing TXT file...');
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Text to PDF</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 20px;
      padding: 20px;
    }
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  </style>
</head>
<body>
  <pre>${fileContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body>
</html>`;
        await page.setContent(htmlContent, {
          waitUntil: 'networkidle2'
        });
      }

      logger.info('Generating PDF...');
      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        scale: 0.7,
        margin: {
          top: '20mm',
          right: '5mm',
          bottom: '20mm',
          left: '5mm'
        }
      });

      logger.info(`PDF generated successfully: ${outputPath}`);
      return true;
    } finally {
      await page.close();
    }
    
  } catch (error) {
    logger.error(`Failed to convert file: ${error.message}`);
    throw error;
  } finally {
    if (shouldCloseBrowser && localBrowser) {
      logger.debug('Closing browser...');
      await localBrowser.close();
    }
  }
}

function findHtmlFiles(dir) {
  const htmlFiles = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stat.isFile() && path.extname(item).toLowerCase() === '.html') {
        htmlFiles.push(fullPath);
      }
    }
  }
  
  scanDirectory(dir);
  return htmlFiles;
}

function generateOutputPath(inputPath, skipHtmlExtension) {
  if (skipHtmlExtension) {
    return inputPath.replace(/\.html$/i, '.pdf');
  } else {
    return inputPath + '.pdf';
  }
}

async function convertCommand(options) {
  try {
    await convertToPdf(options.input, options.output);
    process.exit(0);
  } catch (error) {
    logger.error(`Conversion failed: ${error.message}`);
    process.exit(1);
  }
}

async function recurseCommand(options) {
  try {
    if (!fs.existsSync(options.dir)) {
      logger.error(`Directory does not exist: ${options.dir}`);
      process.exit(1);
    }

    if (!fs.statSync(options.dir).isDirectory()) {
      logger.error(`Path is not a directory: ${options.dir}`);
      process.exit(1);
    }

    logger.info(`Scanning directory recursively: ${options.dir}`);
    const htmlFiles = findHtmlFiles(options.dir);
    
    if (htmlFiles.length === 0) {
      logger.info('No HTML files found in the specified directory');
      process.exit(0);
    }

    logger.info(`Found ${htmlFiles.length} HTML files`);
    
    let browser;
    let convertedCount = 0;
    
    try {
      logger.info('Launching browser for batch conversion...');
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      for (const htmlFile of htmlFiles) {
        const outputPath = generateOutputPath(htmlFile, options.skipHtmlExtension);
        logger.info(`Processing: ${htmlFile} -> ${outputPath}`);
        
        try {
          const converted = await convertToPdf(htmlFile, outputPath, browser);
          if (converted) {
            convertedCount++;
          }
        } catch (error) {
          logger.error(`Failed to convert ${htmlFile}: ${error.message}`);
        }
      }
    } finally {
      if (browser) {
        logger.debug('Closing browser...');
        await browser.close();
      }
    }

    logger.info(`Conversion complete. Found: ${htmlFiles.length} files, Converted: ${convertedCount} files`);
    process.exit(0);
  } catch (error) {
    logger.error(`Recursive conversion failed: ${error.message}`);
    process.exit(1);
  }
}

async function main() {
  const program = new Command();
  
  program
    .name('html2pdf')
    .description('Convert HTML and TXT files to PDF using Puppeteer')
    .version('1.2.0');

  program
    .command('convert')
    .description('Convert a single HTML or TXT file to PDF')
    .requiredOption('-i, --input <path>', 'input file path (.html or .txt)')
    .requiredOption('-o, --output <path>', 'output PDF file path')
    .action(convertCommand);

  program
    .command('recurse')
    .description('Recursively convert all HTML files in a directory to PDF')
    .requiredOption('-d, --dir <path>', 'directory to scan recursively for HTML files')
    .option('-h, --skip-html-extension', 'skip .html in the output filename (body.html -> body.pdf instead of body.html.pdf)', false)
    .action(recurseCommand);

  program.parse();
}

if (require.main === module) {
  main();
}

module.exports = { convertToPdf, Logger };