import { useUserStore } from '../store';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const { logout } = useUserStore()
    const navigate = useNavigate()

    logout()
    navigate('/')


    return (
        <div>
            <h1>Se déconnecter</h1>
            <p>Ici la gestion du formulaire de déconnexion avec retour à l&apos;accueil ! On ne devrait pas voir ce composant s'afficher normalement !</p>
        </div>
    );
}