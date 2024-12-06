# Stage 1: Build the Next.js application
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock for dependency installation
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN yarn build

# Stage 2: Serve the application
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/next.config.js /app/next.config.js

# Install production dependencies using Yarn
RUN yarn install --production

# Expose the port your Next.js app runs on
EXPOSE 3000

# Start the Next.js app
CMD ["yarn", "start"]
