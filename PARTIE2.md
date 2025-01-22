# Partie 2 de l'atelier sur JWT

---

## ATELIER PARTIE 2 - Partie frontend avec React

---

### Étape 1 : On installe le projet frontend

1. Allez dans le dossier du projet React :
   ```bash
   cd frontend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez le projet :
   ```bash
   npm run dev
   ```

Allez dans votre navigateur à `http://localhost:5173/`, pour vérifier qu'on a bien notre projet React qui fonctionne correctement. 

---

### Étape 2 : On mets en place un fichier env

Dans le dossier racine, on va créer un fichier `.env` qui contiendra le code suivant

- **.env** : contiendra nos variables d'environnement :
  ```js
  VITE_BACKEND_BASE_URL=http://localhost:3000
  ```

Nous n'allons avoir aucune dépendance à installer, tout sera gérer directement par notre bundler VITE. Notez que pour créer une variable d'environnement, il faut que la variable commence par `VITE_votre_variable=votre_valeur`.

Cela nous permettra d'éviter à chaque fois d'avoir à déclarer l'URL du backend. On pourra se reservir de cette variable à chaque fois qu'on aura besoin de faire une requête `fetch` vers notre backend.

---

### Étape 3 : On modifie notre store (la partie user)

Il va falloir modifier le store pour remplacer notre store `useUserStore`.

Voici le code à remplacer :

```jsx
export const useUserStore = create((set) => ({
    user: null,
    login: (username, jwtToken) => set(() => ({
        // todo : plus tard, on pourra aussi directement synchroniser le store avec le localStorage pour le conserver (voir la doc)
        user: { name: username, jwtToken: jwtToken }
    })),
    logout: () => set({ user: null }),
}))
```

On pourra ainsi se servir du store pour y stocker le token JWT.

---

### Étape 4 : On modifie la partie login

On va modifier uniquement la méthode `handleSubmit()`, changer le champs `username` par `email`, et tout le reste du code restera identique.


Voici le code complet de la page Login :


<details>
<summary>La page Login</summary>

- source du fichier **Login.jsx**

```jsx
import { useState } from "react";
import { useUserStore } from '../store';
import { useNavigate } from 'react-router-dom';

// ne pas oublier également l'import
import fetchPost from '../utils/fetch_post';

export default function Login() {
    // traitement pour le login
    // je vais avoir besoin de maj le state user ?!
    const { user, login } = useUserStore()
    const navigate = useNavigate()

    // BONUS : on évite que l'utilisateur déjà connecté, puisse passer par là !
    if (user)
        return navigate('/')

    // Je gère les champs du formulaire

    const handleSubmit = async (e) => {
        e.preventDefault()
    
        // je récupère l'URL vers le backend (dans le .env)
        const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
        // je fais une requête vers le backend pour le login
        const data = await fetchPost(`${baseUrl}/login`, { email, password });
    
        console.log('Voici les informations générées par le serveur')
        console.log(data)
    
        if (data) {
            // JWT + Username qui seront passés depuis le backend au login
            login(data.username, data.accessToken)
            //localStorage.setItem("jwtToken", data.accessToken);
            return navigate('/')
        }
    }

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <div>
            <h1>Se connecter</h1>
            <p>C&apos;est ici que tu pourras te connecter à ton profil utilisateur !</p>
            <p>Pour tester le formulaire [enzo@oclock.io, toto42oclock]</p>
            <form method="post" onSubmit={(e) => handleSubmit(e)}>
                <fieldset>
                    <label htmlFor="email">Utilisateur</label>
                    <input
                        type="text" id="email" name="email"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                </fieldset>
                <fieldset>
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password" id="password" name="password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                </fieldset>
                <input type="submit" value="Se connecter" />
            </form>
        </div>
    );
}
```
</details>

#### Notes

Vous pouvez noter l'utilisation de la variable .env, pour éviter d'avoir à réécrire complètement la base de l'URL du backend. Il existe également un dossier `src/utils`, où des méthodes ont été créées pour nous simplifier la vie. Une fois connecté, on récupère le token JWT du backend, et on l'envoi à notre store en utilisant la fonction login.

NB: On pourra mettre ce token également manuellement dans le localStorage (code commenté).

---

### Étape 5 : On ajoute une page profile

Dans le dossier `src/pages`, nous allons créer un nouveau composant `Profile`.

<details>
<summary>La page Profile</summary>

- source du fichier **Profile.jsx**

```jsx
import { useEffect, useState } from 'react'
import fetchGet from '../utils/fetch_get';
import { useUserStore } from '../store';

export default function Profile() {

    const { user } = useUserStore()
    const [profileData, setProfileData] = useState()

    const getProfile = async () => {
        const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
        const json = await fetchGet(`${baseUrl}/profile`, {
            credentials: "include",
            headers: {
                // Toutes les requêtes authentifiées doivent contenir le token
                "Authorization": `Bearer ${user.jwtToken}`
            }
        });
        setProfileData(json.data)
    }

    useEffect(() => {
        if (user)
            getProfile()
    }, [])

    return (
        <div>
            <h1>Ma page de profil</h1>
            <p>Mes informations personnelles</p>
            {profileData ?
                <>
                    <div>On peut voir mes informations ici s&apos;affichées</div>
                    <article style={{ marginTop: '2rem' }}>
                        <p>Mon adresse : {profileData.address.streetAddress}</p>
                        <p>Mon code postal : {profileData.address.postCode}</p>
                        <p>Ma ville : {profileData.address.city}</p>
                    </article>
                </>
                :
                <div>Accès interdit ! Il faut se connecter !</div>
            }
        </div>
    );
}
```
</details>

#### Notes

Vous noterez ici l'utilisation d'une requête fetch de type GET, où on vient spécifier le token JWT récupéré lors de la connexion. Chaque fois qu'il faudra faire une requête authentifié, il faudra donc penser à passer ce fameux token JWT (header Authorization). 

#### Exemple de code (extrait du composant)

```jsx
const json = await fetchGet(`${baseUrl}/profile`, {
        credentials: "include",
        headers: {
            // Toutes les requêtes authentifiées doivent contenir le token
            "Authorization": `Bearer ${user.jwtToken}`
        }
    });
```

Cela permettra à notre back que vous êtes bien authentifié (est-ce que j'ai bien l'autorisation de faire l'opération demandée ?) et ne pas laisser tout le monde accéder à vos données personnelles de votre compte (sécurité).

---

### Étape 6 : Modification de la Navbar

On va rajouter Dans la `navbar` le lien `Link` vers le profil (/profile) pour pouvoir y accéder une fois connecté.

<details>
<summary>Code de la navbar (complet)</summary>

- source du fichier **Navbar.jsx**

```jsx
import { React } from 'react'
import { Link } from 'react-router-dom';
import { useUserStore } from '../store';

export default function Navbar() {
  // j'ai besoin d'un state ici !
  // que je vais avoir besoin de maj depuis le composant login ?!
  const { user } = useUserStore()

  return (
    <nav>
      <ul>
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/portfolio">Portfolio</Link></li>
        <li><Link to="/about">À propos</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
      <ul>
        {!user ?
          <li><Link to="/login">Se connecter</Link></li>
          :
          <>
            <li>Bienvenue {user.name}</li>
            <li><Link to="/profile">Voir mon profil</Link></li>
            <li><Link to="/logout">Se déconnecter</Link></li>
          </>
        }
      </ul>
    </nav>
  );
}
```
</details>

---

### Étape 7 : Modification du main

On va modifier enfin le `main.jsx` pour y ajouter la route vers le composant `Profile` pour que le lien de l'étape 6 puisse fonctionner.

```jsx
// ne pas oublier l'import
import Profile from './pages/Profile.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/project/:projectId" element={<PortfolioProject />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
```

---

### Étape 7 : Testons notre login !

- Ouvrez le projet sur `http://localhost:5173/`
- Naviguez sur le bouton **Se connecter**
- Rentrez en login les informations suivantes :

```sh
Login : enzo@oclock.io
Mot de passe : toto42oclock
```

- Constatez que vous êtes bien redirigés sur la page d'accueil en étant connecté
- Essayez de naviguer sur les pages **A propos** et **Contact** pour constater qu'on est toujours connecté
- Cliquez sur **Voir mon profil**
- On devrait pouvoir visualiser les informations de l'adresse
- Si c'est bien le cas, c'est tout bon !

Votre app fonctionne, vous avez réussi à centraliser la connexion dans un store, tout en utilisant un backend et un token JWT ! Prenez un moment pour admirer votre travail, vous êtes désormais prêt(e) à créer vos propres projets, en utilisant cette base de travail. Bravo ! 🎉






