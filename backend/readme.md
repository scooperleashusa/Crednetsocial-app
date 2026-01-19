```markdown
# Crednet frontend rebuild

This branch reconstructs the frontend and a minimal backend (Firebase Functions) from the repository's encoded `frontend` file content. Files were reconstructed as a best-effort. Please review and run locally:

1. Frontend
   - cd frontend
      - npm ci
         - npm run dev

         2. Functions (backend)
            - cd functions
               - npm ci
                  - npm run serve

                  Notes:
                  - Environment variables: copy frontend/.env.local.example to frontend/.env.local and fill with your Firebase project values or add secrets in CI.
                  - I did not modify firebase.json or hosting settings; adjust firebase.json to match your hosting strategy before deploying.
                  ```