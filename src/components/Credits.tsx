import { Fade } from 'react-awesome-reveal';

const Credits = ({
  className = '',
}: {
  /** An optional class name to add to the container */
  className?: string;
}) => (
  <Fade triggerOnce delay={200} className={className}>
    <div className="w-full text-center">
      <p>
        <a href="https://asynconf.fr">Site réalisé dans le cadre du tournoi de l'Asynconf 2023</a>
      </p>
    </div>
  </Fade>
);

export default Credits;
