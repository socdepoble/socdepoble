FROM ubuntu:22.04

# --- Configuració bàsica ---
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get upgrade -y

# --- Dependències del sistema per a Playwright (WebKit) ---
RUN apt-get install -y \
    wget \
    curl \
    git \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libatspi2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    libwayland-client0 \
    libwayland-cursor1 \
    libwayland-egl1 \
    libx11-xcb1 \
    libx11-6 \
    libxcb1 \
    libxext6 \
    libxrender1 \
    libxi6 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    libappindicator1 \
    libindicator7 \
    fonts-liberation \
    libgcc-s1 \
    libgcc1 \
    libstdc++6 \
    ca-certificates \
    gnupg \
    libwebkit2gtk-4.0-37 \
    libjavascriptcoregtk-4.0-18 \
    libssl-dev \
    make \
    gcc \
    pkg-config

# --- Instal·lar Node.js 18.x (LTS) ---
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# --- Instal·lar mkcert per a HTTPS local ---
RUN npm install -g mkcert
RUN mkdir -p /root/.local/share/mkcert && \
    mkcert -install && \
    mkcert localhost 127.0.0.1 ::1

# --- Configurar directori de treball ---
WORKDIR /app

# --- Comandament per defecte (arrenca Vite en segon pla) ---
CMD ["/bin/bash", "-c", "npm run dev -- --host 0.0.0.0 --port 5173 --https /app/certs/cert.pem /app/certs/key.pem & sleep 5 && npx playwright test --project=webkit"]
