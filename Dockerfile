# Use the official Node.js 18 (LTS) image as the base image
FROM node:18

# Set the working directory inside the container to /app
WORKDIR /app

# Copy the package.json (and package-lock.json, if available) to /app
COPY package*.json ./

# Install dependencies defined in package.json
RUN npm install

# Copy the rest of your application's source code to /app
COPY . .

# The command to run your application
CMD ["npm", "start"]
