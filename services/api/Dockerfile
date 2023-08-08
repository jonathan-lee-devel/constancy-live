FROM --platform=linux/x86_64 node:20.5.0-alpine3.18 as base

# Add package file
COPY package.json ./
COPY package-lock.json ./

# Install deps
RUN npm install

# Copy source
COPY src ./src
COPY tsconfig.json ./tsconfig.json
COPY openapi.yml ./openapi.yml

# Build dist
RUN npm build

# Start production image build
FROM --platform=linux/x86_64 node:20.5.0-alpine3.18

# Copy node modules and build directory
COPY --from=base ./node_modules ./node_modules
COPY --from=base /dist /dist
COPY --from=base ./openapi.yml ./openapi.yml

# Copy static files
COPY src/public dist/src/public

# Expose port 3000
EXPOSE 3000
CMD ["dist/server.js"]
