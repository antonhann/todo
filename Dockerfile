# Step 1: Build the React frontend
FROM node:16 AS build

WORKDIR /app
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Step 2: Set up the Express backend
FROM node:16

WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN npm install

# Copy frontend build to backend
COPY --from=build /app/build /app/client/build

# Copy the backend server code
COPY server/ /app/

EXPOSE 3000
CMD ["node", "server.js"]
