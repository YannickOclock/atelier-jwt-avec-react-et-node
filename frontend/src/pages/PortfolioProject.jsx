import { getProjectById } from '../store';
import { Link, useParams } from 'react-router-dom';

export default function PortfolioProject() {
    const { projectId } = useParams()
    const project = getProjectById(parseInt(projectId))
    console.log(project)

    return (
        <div>
            <h1>Projet numéro {project.id}</h1>
            <div>
                <div style={{ marginTop: '2rem' }}>
                    <p>{project.description}</p>
                </div>
                <img
                    src={project.image}
                    alt={`Illustration du projet numéro ${project.id}`}
                />
                <div style={{ marginTop: '2rem' }}>
                    <Link to={`/portfolio`}>Revenir au portfolio</Link>
                </div>
            </div>
        </div >
    );
}