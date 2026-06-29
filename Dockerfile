# Use Node.js LTS Alpine image for a lightweight container
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (devDependencies are required to build the site)
RUN npm install

# Copy all project source files
COPY . .

# Build the production frontend (Vite) and backend (esbuild)
RUN npm run build

# Set environment variable for production
ENV NODE_ENV=production

# Start the unified production server
CMD ["npm", "run", "start"]
