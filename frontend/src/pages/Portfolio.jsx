import { getProjects } from '../store';
import { Link } from 'react-router-dom';

export default function Portfolio() {
    const projects = getProjects()

    return (
        <div>
            <h1>Mon portfolio</h1>
            <p>Voici une liste de projets, sur lesquels j&apos;ai développé mes compétences.</p>
            <div className="grid">
                {projects.map((project) => (
                    <article key={project.id}>
                        <img
                            src={project.image}
                            alt={`Illustration du projet numéro ${project.id}`}
                            style={{ height: '70%', objectFit: 'contain', marginBottom: '1rem' }}
                        />
                        <h2>{project.name}</h2>
                        <Link to={`/project/${project.id}`}> Détails</Link>
                    </article>
                ))}
            </div>
        </div>
    );
}