# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm install -g serve

# Build the TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 6001

# Command to run the app
CMD ["npm", "deploy"]
