# Use a lightweight Nginx image
FROM nginx:alpine

# Copy the pre-built dist folder to the Nginx directory
COPY dist /usr/share/nginx/html

# Expose port 8080
EXPOSE 8080

# Configure Nginx for Cloud Run and SPA routing
RUN sed -i 's/listen\(.*\)80;/listen 8080;/' /etc/nginx/conf.d/default.conf

# Add a basic Nginx configuration for SPA routing if needed
# (Optional: If the app uses client-side routing, we need to redirect 404s to index.html)
RUN echo 'server { \
    listen 8080; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
