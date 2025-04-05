# 1) Use a Debian-based Node image
FROM node:18-bullseye

# 2) Let Puppeteer download its own Chromium just in case
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false

# 3) Install common dependencies for Chrome/Chromium
RUN apt-get update && apt-get install -y \
    wget gnupg ca-certificates \
    gconf-service libnss3 libx11-6 libx11-xcb1 libxcomposite1 \
    libxcursor1 libxdamage1 libxext6 libxi6 libxrandr2 libxfixes3 \
    fonts-liberation libappindicator1 libasound2 libatk-bridge2.0-0 \
    libatk1.0-0 libcups2 libdrm2 libgbm1 libgtk-3-0 libnspr4 libpango-1.0-0 \
    libxshmfence1 xdg-utils --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 4) (Optional) Also install Google Chrome stable.
#    This ensures that /usr/bin/google-chrome really exists.
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" \
     >> /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update \
  && apt-get install -y google-chrome-stable \
  && rm -rf /var/lib/apt/lists/*

# 5) Create /app folder
WORKDIR /app

# 6) Copy package.json files and install
COPY package*.json ./
RUN npm install

# 7) Copy the rest of your code
COPY . .

# 8) Confirm Chrome is really installed (for debugging)
RUN which google-chrome || echo "google-chrome NOT FOUND"
RUN google-chrome --version || echo "google-chrome not installed"

# 9) Expose the port & run
EXPOSE 3000
CMD ["node", "server.js"]