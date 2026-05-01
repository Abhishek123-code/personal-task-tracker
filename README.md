# Personal Task Tracker

A small microservice-based task tracker with:

- React/Vite frontend
- Express task service
- Express analytics service
- MongoDB via Prisma
- Docker images for each app
- Kubernetes manifests for local deployment

## Preview

![Task Dashboard preview](preview.svg)

## Project Structure

```text
frontend/             React dashboard
task-service/         Task API, Prisma, MongoDB
analytics-service/    Analytics API that reads from task-service
k8s-manifests/        Kubernetes Deployment and Service manifests
```

## Prerequisites

Install:

- Node.js 20+
- Docker
- Kubernetes locally, for example Docker Desktop Kubernetes
- kubectl
- A MongoDB connection string

If you use MongoDB Atlas, make sure your current IP address is allowed in Atlas Network Access.

## Environment Setup

Create a local environment file for the task service:

```bash
cp task-service/.env.example task-service/.env
```

Edit `task-service/.env`:

```bash
DATABASE_URL=mongodb+srv://USER:PASSWORD@HOST/taskService?retryWrites=true&w=majority
```

Do not commit `.env`. It is ignored by Git.

## Run Locally Without Kubernetes

Install dependencies:

```bash
cd task-service && npm install
cd ../analytics-service && npm install
cd ../frontend && npm install
```

Or from the repo root:

```bash
npm run install:all
```

Start the full local app from the repo root:

```bash
npm run dev
```

This starts:

- Task API on `http://localhost:3000/task`
- Analytics API on `http://localhost:3001/analytics`
- Frontend on the Vite URL shown in the terminal, usually `http://localhost:5173`

If you prefer separate terminals, use the commands below.

Generate the Prisma client and start the task service:

```bash
cd task-service
npx prisma generate
npm run dev
```

In another terminal, start analytics:

```bash
cd analytics-service
TASK_SERVICE_URL=http://localhost:3000 npm run dev
```

In another terminal, start the frontend:

```bash
cd frontend
VITE_TASK_API_URL=http://localhost:3000/task VITE_ANALYTICS_API_URL=http://localhost:3001/analytics npm run dev
```

Open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Docker Build

From the repo root:

```bash
docker build -t task-service:latest ./task-service
docker build -t analytics-service:latest ./analytics-service
docker build -t frontend:latest ./frontend
```

The `.dockerignore` files keep `node_modules`, `dist`, generated files, and `.env` out of the Docker build context.

## Run Locally with Docker Compose

You can easily run the entire stack (including a local MongoDB database) without manually configuring environment variables using Docker Compose:

```bash
docker compose up --build
```

Once started, you can access the services at:

- **Frontend**: `http://localhost:5173`
- **Task API**: `http://localhost:3000/task`
- **Analytics API**: `http://localhost:3001/analytics`

To stop the services and safely remove the containers, run:

```bash
docker compose down
```

## Deploy to Local Kubernetes

These steps are intended for Docker Desktop Kubernetes.

Check your context:

```bash
kubectl config current-context
```

Create or update the Kubernetes Secret from your local `.env`:

```bash
kubectl create secret generic task-service-secrets \
  --from-env-file=task-service/.env \
  --dry-run=client -o yaml | kubectl apply -f -
```

Apply the manifests:

```bash
kubectl apply -f k8s-manifests/
```

If your pods show `ErrImageNeverPull`, load the local Docker images into the Docker Desktop Kubernetes node:

```bash
docker save task-service:latest | docker exec -i desktop-control-plane ctr -n k8s.io images import -
docker save analytics-service:latest | docker exec -i desktop-control-plane ctr -n k8s.io images import -
docker save frontend:latest | docker exec -i desktop-control-plane ctr -n k8s.io images import -
```

Then restart the deployments:

```bash
kubectl rollout restart deployment/task-service deployment/analytics-service deployment/frontend
```

Wait for everything to be ready:

```bash
kubectl rollout status deployment/task-service
kubectl rollout status deployment/analytics-service
kubectl rollout status deployment/frontend
```

Check the result:

```bash
kubectl get pods,svc
```

## Open the App

The manifests expose:

- Frontend: `30000`
- Task API: `30001`
- Analytics API: `30002`

On some Docker Desktop Kubernetes setups, NodePort is not reachable directly from `localhost`. If `http://localhost:30000` refuses to connect, use port-forwarding.

Run these in three separate terminals and keep them open:

```bash
kubectl port-forward service/task-service 30001:3000
```

```bash
kubectl port-forward service/analytics-service 30002:3001
```

```bash
kubectl port-forward service/frontend 30000:5173
```

Then open:

```text
http://localhost:30000
```

## Updating After Code Changes

Rebuild images:

```bash
docker build -t task-service:latest ./task-service
docker build -t analytics-service:latest ./analytics-service
docker build -t frontend:latest ./frontend
```

Load them into the Docker Desktop Kubernetes node:

```bash
docker save task-service:latest | docker exec -i desktop-control-plane ctr -n k8s.io images import -
docker save analytics-service:latest | docker exec -i desktop-control-plane ctr -n k8s.io images import -
docker save frontend:latest | docker exec -i desktop-control-plane ctr -n k8s.io images import -
```

Restart deployments:

```bash
kubectl rollout restart deployment/task-service deployment/analytics-service deployment/frontend
```

## Useful Commands

View pods and services:

```bash
kubectl get pods,svc
```

View logs:

```bash
kubectl logs deployment/task-service
kubectl logs deployment/analytics-service
kubectl logs deployment/frontend
```

Delete the Kubernetes resources:

```bash
kubectl delete -f k8s-manifests/
kubectl delete secret task-service-secrets
```

## Notes

- `task-service/.env` is required locally but must not be committed.
- The Kubernetes deployment reads `DATABASE_URL` from the `task-service-secrets` Secret.
- The analytics service talks to the task service inside Kubernetes at `http://task-service:3000`.
- The frontend calls the APIs through `localhost:30001` and `localhost:30002`, which is why port-forwarding those services may be required.
