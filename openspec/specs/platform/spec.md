# platform Specification

## Purpose

Provides a Docker-based local development stack, Makefile developer commands, a single production image that serves frontend and backend together, and Kubernetes manifests for deploying that image.

## Requirements

### Requirement: Local development with Docker Compose
The project SHALL provide Docker Compose configuration that starts the backend, the frontend, and PostgreSQL for local development. The frontend MUST be able to call the backend API while this stack is running.

#### Scenario: Start the local stack
- **WHEN** a developer starts the Compose stack
- **THEN** PostgreSQL, the backend, and the frontend become available locally

#### Scenario: Frontend reaches the API
- **WHEN** the local stack is running
- **THEN** the Vue app can load catalog data from the backend API

### Requirement: Makefile developer commands
The project SHALL include a Makefile with commands sufficient for local development and production image build. At minimum the Makefile MUST expose targets to start and stop the local stack, apply database migrations, and build the production image.

#### Scenario: Start via Makefile
- **WHEN** a developer runs the Makefile target that starts the local stack
- **THEN** the Docker Compose stack starts

#### Scenario: Build the production image via Makefile
- **WHEN** a developer runs the Makefile production-image build target
- **THEN** a single Docker image containing frontend and backend is built

### Requirement: Single production image
Production SHALL package the Vue frontend (built static assets) and the Node.js backend in one Docker image. That image MUST serve the SPA and the HTTP API from the same process or reverse-proxy layout so a single container is enough to run the application, with PostgreSQL remaining an external dependency.

#### Scenario: Run the production image
- **WHEN** the production image is started with a reachable PostgreSQL connection string
- **THEN** the container serves the SPA and the API without a separate frontend container

### Requirement: Kubernetes deployment
The project SHALL provide Kubernetes manifests that deploy the production image and connect it to PostgreSQL. The manifests MUST define at least a Deployment and a Service for the application.

#### Scenario: Apply Kubernetes manifests
- **WHEN** the Kubernetes manifests are applied to a cluster that has PostgreSQL reachable as configured
- **THEN** the application Deployment and Service are created
