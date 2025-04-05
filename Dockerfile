# ...
FROM node:18-bullseye

# Install dependencies
RUN apt-get update && apt-get install -y \
    gconf-service libnss3 libx11-6 libx11-xcb1 libxcomposite1 \
    libxcursor1 libxdamage1 libxext6 libxi6 libxrandr2 libxfixes3 \
    ca-certificates fonts-liberation libappindicator1 libasound2 \
    libatk-bridge2.0-0 libatk1.0-0 libcups2 libdrm2 \
    libgbm1 libgtk-3-0 libnspr4 libpango-1.0-0 libxshmfence1 xdg-utils \
    wget gnupg --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install official Google Chrome
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" \
     >> /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update \
  && apt-get install -y google-chrome-stable \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
# ...
FROM node:18-bullseye

# Install dependencies
RUN apt-get update && apt-get install -y \
    gconf-service libnss3 libx11-6 libx11-xcb1 libxcomposite1 \
    libxcursor1 libxdamage1 libxext6 libxi6 libxrandr2 libxfixes3 \
    ca-certificates fonts-liberation libappindicator1 libasound2 \
    libatk-bridge2.0-0 libatk1.0-0 libcups2 libdrm2 \
    libgbm1 libgtk-3-0 libnspr4 libpango-1.0-0 libxshmfence1 xdg-utils \
    wget gnupg --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install official Google Chrome
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" \
     >> /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update \
  && apt-get install -y google-chrome-stable \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3000
CMD ["node", "server.js"]