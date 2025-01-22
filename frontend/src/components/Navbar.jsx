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
            <li><Link to="/logout">Se déconnecter</Link></li>
          </>
        }
      </ul>
    </nav>
  );
}