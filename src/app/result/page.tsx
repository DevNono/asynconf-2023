'use client';
import Button from '@/components/Button';
import Modal from '@/components/Modal';

export default function Result() {
  return (
    <div>
      <Modal
        topHexagon
        topHexagonTop="Votre"
        topHexagonMiddle={
          <>
            2,04<span className="text-3xl font-normal">%</span>
          </>
        }
        topHexagonBottom="Taux"
        backArrow
        redirectionLink="/">
        <h1 className="mb-4 text-5xl font-bold text-center">Félicitations !</h1>
        <p className="text-2xl">
          Vous pouvez obtenir pour votre véhicule un taux d’emprunt exceptionnel de{' '}
          <span className="font-bold text-primary">3,07%</span>.
          <br />
          <br />
          <br />
          Pour en profiter, merci de cliquer sur le bouton ci-dessous ou bien rendez-vous sur{' '}
          <a className="font-bold text-secondary" href="https://asynconf.fr">
            asynconf.fr
          </a>
          .
        </p>
        <Button onClick={() => window.open('https://asynconf.fr', '_blank')}>EN PROFITER</Button>
      </Modal>
    </div>
  );
}
