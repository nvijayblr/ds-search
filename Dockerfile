# STEP 1 build binary
FROM golang:alpine AS builder

RUN apk update && apk add --no-cache git
RUN apk --no-cache add ca-certificates

WORKDIR /app
COPY . /app

# Fetch dependencies.
RUN go get -d -v

# Build the binary.
RUN CGO_ENABLED=0 GOOS=linux go build -o main

# STEP 2 build a small image
FROM scratch

# Copy static executable and certificates
COPY --from=builder /app/main /app/main
COPY --from=builder /app/www /www
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Run the hello binary.
ENTRYPOINT ["/app/main"]
