# 🦴🎉 WAF Party Game :
Project by  __ARCAS__ Manon, __DE AMEZAGA__ Bastien, __MACE__ Léo and __Barboteau__ Mathieu.

Welcome to the WAF Websocket project create for the Waf project ! <br>

This project is aimed at providing a web socket server for the app web waf.

This README will guide you through setting up your environment, installing the required packages, and starting the project.

## 🔧 Prerequisites :
- [node](https://nodejs.org/fr) installed on your system.
- [npm](https://www.npmjs.com) package manager installed.


## ​📋​ Data flow :

```plaintext
+-------+      +------+      +---------+
|  API  | <--> |  WS  | <--> | WEB APP |
+-------+      +------+      +---------+
```


## 💻 Starting the Project :

### 1. Clone the Repository
```bash
git clone https://github.com/Manon-Arc/WAF_WebSockets.git
```

### 2. Navigate to the Project Directory

```bash
cd WAF_WebSockets
```

### 3 . Install Required Packages
```bash
npm install
```

## 💻 Starting the project :

### 4. Start the Development Server
```bash
npm run dev
```
### 5. Access to websocket 
The link is ws://localhost:3000

## 💻 Use Docker for the project :
### 1. Clone the Repository
```bash
git clone https://github.com/Manon-Arc/WAF_WebSockets.git
```

### 2. Change the docker-compose.yml by:

```yaml
version: '3.8'

services:
  app:
    build:
      context: ./
      dockerfile: Dockerfile
    restart: always
    ports:
      - "6001:6001"

```

### 3. Build the Docker Image
```bash
docker-compose up -d
```

### 4. Access the game
The link is ws://localhost:3000
