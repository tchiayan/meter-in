FROM nginx:1.23.3-alpine-slim

# copy nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# copy ssl certificate
COPY steadcom_ddns_net.pem /etc/nginx/public.pem
COPY steadcom.key /etc/nginx/private.pem