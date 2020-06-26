FROM node:-alpine
# Add our configuration files and scripts
WORKDIR /dabber
COPY . .
RUN npm install
CMD ["now"]
