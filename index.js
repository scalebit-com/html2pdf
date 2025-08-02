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

async function convertToPdf(inputPath, outputPath) {
  let browser;
  
  try {
    logger.info(`Starting PDF conversion: ${inputPath} -> ${outputPath}`);
    
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file does not exist: ${inputPath}`);
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

    logger.info('Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new'
    });
    
    const page = await browser.newPage();
    
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
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    logger.info(`PDF generated successfully: ${outputPath}`);
    
  } catch (error) {
    logger.error(`Failed to convert file: ${error.message}`);
    throw error;
  } finally {
    if (browser) {
      logger.debug('Closing browser...');
      await browser.close();
    }
  }
}

async function main() {
  const program = new Command();
  
  program
    .name('topdf')
    .description('Convert HTML and TXT files to PDF using Puppeteer')
    .version('1.0.0')
    .requiredOption('-i, --input <path>', 'input file path (.html or .txt)')
    .requiredOption('-o, --output <path>', 'output PDF file path')
    .parse();

  const options = program.opts();
  
  try {
    await convertToPdf(options.input, options.output);
    process.exit(0);
  } catch (error) {
    logger.error(`Conversion failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { convertToPdf, Logger };