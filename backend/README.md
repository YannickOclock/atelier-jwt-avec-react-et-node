# Authentication

## Installation

```bash
# Check Node.js version (>= 20.12.0)
node -v

# Install dependencies
npm install

# Setup SQLite database
npm run db:reset

# Run in dev mode
npm run dev

# Test it from a browser
curl http://localhost:3000
```

## Explanation

Demonstration de l'authentification avec un token JWT

- JWT (= access token) est généré par le serveur 
- Le client récupère ce token après la phase de login et le stocke dans le localStorage ou le state
- Le client accède à des informations sécurisées du backend en ajoutant ce token sur chaque requête (Authentization: Bearer <valeur_du_token>)
