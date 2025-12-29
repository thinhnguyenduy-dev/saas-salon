---
description: How to run locally and deploy to cloud
---

## Local Development

1.  **Start Infrastructure**:
    ```bash
    pnpm docker:up
    ```
    This starts MongoDB (port 27017) and Redis (port 6379).

2.  **Install Dependencies**:
    ```bash
    pnpm install
    ```

3.  **Run Development Server**:
    ```bash
    pnpm dev
    ```
    -   Web: http://localhost:3000
    -   API: http://localhost:3001
    -   Swagger: http://localhost:3001/api/docs

## Initial Setup & Push to GitHub

1.  **Reset Git History (Optional)**:
    If you want to start fresh and remove all previous commits:
    ```bash
    rm -rf .git
    git init
    git add .
    git commit -m "feat: initial commit"
    ```

2.  **Create Repository**:
    Go to GitHub and create a new **empty** repository (don't select "Initialize with README").

3.  **Push Code**:
    Run the following commands in your terminal:
    ```bash
    # Add the remote repository (replace URL with your own)
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

    # Rename branch to main
    git branch -M main

    # Push to GitHub
    git push -u origin main
    ```

## Cloud Deployment (Render.com)

1.  **Create `render.yaml` in root**:
    We will create a Blueprint for:
    -   API (Node.js Service)
    -   Web (Node.js Service)
    -   Redis (Service)
    -   MongoDB (Managed or Service)

2.  **Push to GitHub**.

3.  **Connect to Render**:
    -   Go to Dashboard > Blueprints > New Blueprint Instance.
    -   Select Repository.
    -   Approve.
