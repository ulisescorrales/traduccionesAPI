FROM node
WORKDIR /app
COPY . /app
RUN npm install
RUN npm install -g typescript
CMD ["npm", "start"]