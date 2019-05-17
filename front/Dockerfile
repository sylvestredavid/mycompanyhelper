FROM nginx:1.14.0

COPY /dist/front/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
