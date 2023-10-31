'use client';
import Button from '@/components/Button';
import Credits from '@/components/Credits';
import Modal from '@/components/Modal';
import React, { useEffect } from 'react';
import { Fade } from 'react-awesome-reveal';

export default function Result() {
  const [percentage, setPercentage] = React.useState(0.0);
  const [targetPercentage, setTargetPercentage] = React.useState(1.0);

  useEffect(() => {
    // Get the percentage from the local storage
    const percent = localStorage.getItem('percentage');
    setTargetPercentage(() => parseFloat(percent));
    console.log(targetPercentage);

    setTimeout(() => {
      animateToTarget();
    }, 2000);
  }, [targetPercentage]);

  function animateToTarget() {
    // Set the percentage to 0
    setPercentage(0.0);

    // Animate to the target percentage
    const interval = setInterval(() => {
      setPercentage((percentage) => {
        console.log(percentage);
        if (percentage < targetPercentage) {
          return percentage + 0.01 * Math.exp(percentage);
        } else {
          clearInterval(interval);
          return targetPercentage;
        }
      });
    }, 10);
  }

  return (
    <>
      <div className="pt-16 lg:pt-0">
        <Modal
          topHexagon
          topHexagonTop="Votre"
          topHexagonMiddle={
            <>
              {percentage.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              <span className="text-3xl font-normal">%</span>
            </>
          }
          topHexagonBottom="Taux"
          backArrow
          redirectionLink="/">
          <Fade triggerOnce delay={500}>
            <h1 className="mb-4 text-5xl font-bold text-center">Félicitations !</h1>
          </Fade>
          <Fade triggerOnce delay={800}>
            <p className="text-2xl">
              Vous pouvez obtenir, pour votre nouveau véhicule, un taux d’emprunt exceptionnel de{' '}
              <span className="font-bold text-primary">
                {percentage.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                %
              </span>
              .
              <br />
              <br />
              <br />
              Pour en profiter, merci de cliquer sur le bouton ci-dessous ou bien rendez-vous sur{' '}
              <a className="font-bold text-secondary" href="https://asynconf.fr">
                asynconf.fr
              </a>
              .
            </p>
          </Fade>
          <Fade triggerOnce delay={900}>
            <Button onClick={() => window.open('https://asynconf.fr', '_blank')}>EN PROFITER</Button>
          </Fade>
        </Modal>
      </div>
      <Credits className="lg:absolute lg:bottom-5" />
    </>
  );
}
