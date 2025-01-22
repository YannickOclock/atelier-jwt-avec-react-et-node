import { useState } from "react";
import { useUserStore } from '../store';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    // traitement pour le login
    // je vais avoir besoin de maj le state user ?!
    const { user, login } = useUserStore()
    const navigate = useNavigate()

    // BONUS : on évite que l'utilisateur déjà connecté, puisse passer par là !
    if (user)
        return navigate('/')

    // Je gère les champs du formulaire

    const handleSubmit = (e) => {
        e.preventDefault()

        // Comment je fais pour me logger ?
        login(username, password)

        // redirection
        return navigate('/')
    }

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    return (
        <div>
            <h1>Se connecter</h1>
            <p>C&apos;est ici que tu pourras te connecter à ton profil utilisateur !</p>
            <p>Pour tester le formulaire [enzo@oclock.io, toto42oclock]</p>
            <form method="post" onSubmit={(e) => handleSubmit(e)}>
                <fieldset>
                    <label htmlFor="username">Utilisateur</label>
                    <input
                        type="text" id="username" name="username"
                        value={username} onChange={(e) => setUsername(e.target.value)}
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