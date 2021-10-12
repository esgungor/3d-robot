FROM node:16.4 as build-deps
WORKDIR /usr/src/app
COPY ./package.json  ./
RUN yarn
COPY ./ ./
RUN yarn run build

FROM nginx:stable-alpine
COPY --from=build-deps /usr/src/app/build /var/www
COPY --from=build-deps /usr/src/app/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]