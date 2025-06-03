# Use this script to start a docker container for a local development Redis instance

# TO RUN ON WINDOWS:
# 1. Install WSL (Windows Subsystem for Linux) - https://learn.microsoft.com/en-us/windows/wsl/install
# 2. Install Docker Desktop or Podman Desktop
# - Docker Desktop for Windows - https://docs.docker.com/docker-for-windows/install/
# - Podman Desktop - https://podman.io/getting-started/installation
# 3. Open WSL - `wsl`
# 4. Run this script - `./start-redis.sh`

# On Linux and macOS you can run this script directly - `./start-redis.sh`

# import env variables from .env
set -a
source .env

REDIS_PORT=${REDIS_PORT:-6379}
REDIS_PASSWORD=${REDIS_PASSWORD:-password}
REDIS_CONTAINER_NAME=${REDIS_CONTAINER_NAME:-dev-redis}

if ! [ -x "$(command -v docker)" ] && ! [ -x "$(command -v podman)" ]; then
  echo -e "Docker or Podman is not installed. Please install docker or podman and try again.\nDocker install guide: https://docs.docker.com/engine/install/\nPodman install guide: https://podman.io/getting-started/installation"
  exit 1
fi

# determine which docker command to use
if [ -x "$(command -v docker)" ]; then
  DOCKER_CMD="docker"
elif [ -x "$(command -v podman)" ]; then
  DOCKER_CMD="podman"
fi

if ! $DOCKER_CMD info > /dev/null 2>&1; then
  echo "$DOCKER_CMD daemon is not running. Please start $DOCKER_CMD and try again."
  exit 1
fi

if command -v nc >/dev/null 2>&1; then
  if nc -z localhost "$REDIS_PORT" 2>/dev/null; then
    echo "Port $REDIS_PORT is already in use."
    exit 1
  fi
else
  echo "Warning: Unable to check if port $REDIS_PORT is already in use (netcat not installed)"
  read -p "Do you want to continue anyway? [y/N]: " -r REPLY
  if ! [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborting."
    exit 1
  fi
fi

if [ "$($DOCKER_CMD ps -q -f name=$REDIS_CONTAINER_NAME)" ]; then
  echo "Redis container '$REDIS_CONTAINER_NAME' already running"
  exit 0
fi

if [ "$($DOCKER_CMD ps -q -a -f name=$REDIS_CONTAINER_NAME)" ]; then
  $DOCKER_CMD start "$REDIS_CONTAINER_NAME"
  echo "Existing Redis container '$REDIS_CONTAINER_NAME' started"
  exit 0
fi

if [ "$REDIS_PASSWORD" = "password" ]; then
  echo "You are using the default Redis password"
  read -p "Should we generate a random password for you? [y/N]: " -r REPLY
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Generate a random URL-safe password
    REDIS_PASSWORD=$(openssl rand -base64 12 | tr '+/' '-_')
    # Update .env file
    if grep -q "^REDIS_PASSWORD=" .env; then
      sed -i '' "s/^REDIS_PASSWORD=.*/REDIS_PASSWORD=$REDIS_PASSWORD/" .env
    else
      echo "REDIS_PASSWORD=$REDIS_PASSWORD" >> .env
    fi
    echo "Random password set in .env"
  else
    echo "Please change the default password in the .env file and try again"
    exit 1
  fi
fi

# Update REDIS_DATABASE_URL in .env
REDIS_DATABASE_URL="redis://default:$REDIS_PASSWORD@localhost:$REDIS_PORT"
if grep -q "^REDIS_DATABASE_URL=" .env; then
  sed -i '' "s|^REDIS_DATABASE_URL=.*|REDIS_DATABASE_URL=$REDIS_DATABASE_URL|" .env
else
  echo "REDIS_DATABASE_URL=$REDIS_DATABASE_URL" >> .env
fi

$DOCKER_CMD run -d \
  --name $REDIS_CONTAINER_NAME \
  -p "$REDIS_PORT":6379 \
  docker.io/redis:7-alpine \
  --requirepass "$REDIS_PASSWORD" && echo "Redis container '$REDIS_CONTAINER_NAME' was successfully created"