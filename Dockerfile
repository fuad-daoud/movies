### go
FROM golang:1.23 AS gobuild

WORKDIR /app
COPY ./go ./
RUN CGO_ENABLED=0 GOOS=linux go build -o ./main ./main.go
RUN chmod +x ./main


FROM node:lts-alpine AS reactbuild

WORKDIR /app
COPY ./ ./
RUN npm install
RUN npm run build

# FROM scratch AS runapp
FROM golang:1.23 AS runapp

WORKDIR ./

COPY --from=reactbuild /app/dist ./dist/

COPY --from=gobuild /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=gobuild /app/main ./main


EXPOSE 8080
ENTRYPOINT ["./main"]

# CMD ["./main", "--addr", "redis-19904.c304.europe-west1-2.gce.redns.redis-cloud.com:19904", "--password", 'AxTR!n5Br9ihbUE', "--key", "prodData", "--username", "server", "--broker-url", "amqps://gmjjgtbg:np0rKbXrfaNdrEddr2D4sLSPwx6K3Sq4@dog.lmq.cloudamqp.com/gmjjgtbg"]
