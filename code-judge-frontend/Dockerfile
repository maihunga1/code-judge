# Stage 1: Build the React application with Vite
FROM node:20 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the built application using a lightweight server
FROM node:20-alpine AS serve

# Install serve globally to serve the build directory
RUN npm install -g serve

# Copy the build output from the previous stage
COPY --from=build /app/dist /app/dist

# Expose the port that the application will run on
EXPOSE 80

# Command to serve the built application
CMD ["serve", "-s", "/app/dist", "-l", "80"]
