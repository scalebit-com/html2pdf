# Use Node.js 24.4.1 on Debian Bullseye
FROM node:24.4.1-bullseye

# Install system dependencies and Chromium
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    chromium \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd -r html2pdf && useradd -r -g html2pdf -G audio,video html2pdf \
    && mkdir -p /home/html2pdf/Downloads \
    && chown -R html2pdf:html2pdf /home/html2pdf

# Set working directory
WORKDIR /app

# Copy application files
COPY package*.json ./
COPY index.js ./

# Create directory for input/output files with proper permissions
RUN mkdir -p /app/data && chown -R html2pdf:html2pdf /app

# Install production dependencies and Puppeteer with Chromium
RUN npm ci --only=production && npm cache clean --force

# Configure Puppeteer to use system Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Switch to non-root user
USER html2pdf

# Set default working directory for file operations
WORKDIR /app/data

# Expose a volume for input/output files
VOLUME ["/app/data"]

# Set entrypoint to use the CLI tool
ENTRYPOINT ["node", "/app/index.js"]

# Default command (shows help)
CMD ["--help"]