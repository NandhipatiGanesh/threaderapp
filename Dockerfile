# Use a Node image with Debian/Ubuntu-based OS, for example:
    FROM node:18-bullseye

    # Install necessary dependencies for Chromium
    RUN apt-get update && apt-get install -y \
        gconf-service libnss3 libx11-6 libx11-xcb1 libxcomposite1 \
        libxcursor1 libxdamage1 libxext6 libxi6 libxrandr2 libxfixes3 \
        ca-certificates fonts-liberation libappindicator1 libasound2 \
        libatk-bridge2.0-0 libatk1.0-0 libcups2 libdrm2 \
        libgbm1 libgtk-3-0 libnspr4 libpango-1.0-0 libxshmfence1 xdg-utils \
        --no-install-recommends && rm -rf /var/lib/apt/lists/*
    
    # (Optional) If you want to install the official Google Chrome,
    # you can uncomment these lines:
    # RUN apt-get update && apt-get install -y wget gnupg
    # RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
    # RUN echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
    # RUN apt-get update && apt-get install -y google-chrome-stable
    
    # Create app directory
    WORKDIR /app
    
    # Copy package files and install dependencies
    COPY package*.json .
    RUN npm install
    
    # Copy the rest of your code
    COPY . .
    
    # Expose port (same as in your server.js, e.g., 3000)
    EXPOSE 3000
    
    # Start the server
    CMD [ "node", "server.js" ]
    