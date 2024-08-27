# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Install a simple HTTP server to serve static content
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3001

# Start the app
CMD ["serve", "-s", "build"]
