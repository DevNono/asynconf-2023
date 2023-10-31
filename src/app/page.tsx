'use client';
import Button from '@/components/Button';
import Credits from '@/components/Credits';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import Modal from '@/components/Modal';
import RangeInput from '@/components/RangeInput';
import Select from '@/components/Select';
import axios from 'axios';
import React, { useEffect } from 'react';
import { Data, Error } from '@/types';
import { useRouter } from 'next/navigation';
import { Fade } from 'react-awesome-reveal';

export default function Home() {
  const progressBar = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [data, setData] = React.useState<Data>({} as Data);
  const [error, setError] = React.useState<Error | null>(null);

  // Form input variables
  const [vehicle, setVehicle] = React.useState<string | null>(null);
  const [energy, setEnergy] = React.useState<string | null>(null);
  const [mileagePerYear, setMileagePerYear] = React.useState<number | null>(null);
  const [constructionYear, setConstructionYear] = React.useState<number | null>(null);
  const [passenger, setPassenger] = React.useState<number | null>(null);

  const router = useRouter();

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    // Avoid page reload
    e.preventDefault();

    // Reset the error
    setError(null);

    // Make the button as "sent"
    setSubmitting(true);

    // Reset the progress bar
    progressBar.current!.style.width = '0';

    // Send request to axios with a progress bar
    axios
      .post(
        'api/rate',
        {
          vehicle,
          energy,
          mileagePerYear,
          constructionYear,
          passenger,
        },
        {
          // We use the progress bar to show the progress of the request
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
            progressBar.current!.style.width = `${percentCompleted}%`;
          },
        },
      )
      .then((res) => {
        // Set a timeout of 1s to show the progress bar at 100% and to make the user feel like the request is sent
        setTimeout(() => {
          setSubmitting(false);

          // Reset the progress bar
          progressBar.current!.style.width = '0';

          if (res.data.error) {
            setError({
              message: res.data.error,
              field: res.data.field,
            });
            return;
          }

          if (res.data.value) {
            // Save data to localstorage in order to display it in the result page
            localStorage.setItem('percentage', res.data.value);

            // Redirect to the result page
            router.push('/result');

            return;
          }

          // No error, we redirect to the result page
          setError({
            message: "Une erreur inconnue s'est produite",
            field: null,
          });
        }, 1000);
      })
      .catch((err) => {
        // Set the error
        setError({
          message: "Une erreur s'est produite lors de l'envoi du formulaire",
          field: null,
        });
        // Log the error in the console
        console.log(err);
        // Stop the loader in the button
        setSubmitting(false);
      });
  };

  useEffect(() => {
    // Before showing the content, we make sure that we get the data from the api
    axios
      .get('api/rate')
      .then((res) => {
        // Set the data
        setData(res.data);

        // Set all the values to the first value of the data
        setVehicle(res.data.vehicles[0].model);
        setEnergy(res.data.energies[0].name);
        setMileagePerYear(res.data.mileagesPerYear[0].minKilo);
        setPassenger(res.data.passengers[0].passengersNumber);

        // Stop the loader after a delay of 500ms to make sure that the loader is shown as we are in local environment
        // Thus, we want to provide the closest experience to the production environment
        setTimeout(() => {
          setLoading(false);
        }, 500);
      })
      .catch((err) => {
        // Log the error in the console
        console.log(err);
      });
  }, []);

  // If the data is not loaded yet, we show a loader
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Modal>
        <form action="" onSubmit={submitForm} className="flex flex-col items-center justify-center w-full gap-8">
          <Fade triggerOnce delay={300} className="w-full">
            <div className="flex flex-col">
              <h1 className="mb-4 text-5xl font-bold text-center">Simulateur de taux d'emprunt</h1>
              <h2 className="mb-4 -mt-3 text-2xl font-bold text-center text-neutral-400">
                Renseignez vos informations pour obtenir votre taux
              </h2>
            </div>
          </Fade>

          <Fade triggerOnce delay={400} className="w-full">
            <Select
              error={error?.field === 'vehicle' ? error.message : ''}
              label="Type de véhicule"
              value={vehicle || ''}
              onChange={setVehicle}
              options={
                data.vehicles ? data.vehicles?.map((v: { model: string }) => ({ label: v.model, value: v.model })) : []
              }
            />
          </Fade>

          <Fade triggerOnce delay={500} className="w-full">
            <Select
              error={error?.field === 'energy' ? error.message : ''}
              label="Type d'énergie"
              value={energy || ''}
              onChange={setEnergy}
              options={
                data.energies ? data.energies?.map((e: { name: string }) => ({ label: e.name, value: e.name })) : []
              }
            />
          </Fade>

          <Fade triggerOnce delay={600} className="w-full">
            <RangeInput
              error={error?.field === 'mileagePerYear' ? error.message : ''}
              label="Kilométrage annuel"
              // We set the min to the min value of the data
              min={data.mileagesPerYear && Math.min(...data.mileagesPerYear.map((m: { minKilo: number }) => m.minKilo))}
              // We set the max to the max value of the data
              max={data.mileagesPerYear && Math.max(...data.mileagesPerYear.map((m: { maxKilo: number }) => m.maxKilo))}
              // We calculate the step by dividing the difference between the max and the min by 500
              step={Math.round(
                (Math.max(...data.mileagesPerYear.map((m: { maxKilo: number }) => m.maxKilo)) -
                  Math.min(...data.mileagesPerYear.map((m: { minKilo: number }) => m.minKilo))) /
                  500,
              )}
              unit="km/an"
              value={mileagePerYear?.toString() || ''}
              onChange={(value) => setMileagePerYear(parseInt(value))}
            />
          </Fade>

          <Fade triggerOnce delay={700} className="w-full">
            <Input
              error={error?.field === 'constructionYear' ? error.message : ''}
              label="Année de construction"
              type="number"
              placeholder="2023"
              value={constructionYear?.toString() || ''}
              onChange={(value) => setConstructionYear(parseInt(value))}
            />
          </Fade>

          <Fade triggerOnce delay={800} className="w-full">
            <RangeInput
              error={error?.field === 'passenger' ? error.message : ''}
              label="Nombre de passagers"
              // We set the min to the min value of the data
              min={
                data.passengers &&
                Math.min(...data.passengers.map((p: { passengersNumber: number }) => p.passengersNumber))
              }
              // We set the max to the max value of the data
              max={
                data.passengers &&
                Math.max(...data.passengers.map((p: { passengersNumber: number }) => p.passengersNumber))
              }
              unit={passenger > 1 ? 'passagers' : 'passager'}
              value={passenger?.toString() || ''}
              onChange={(value) => setPassenger(parseInt(value))}
            />
          </Fade>
          {error && error.field === null ? <p className="-mb-5 text-center text-red-600">{error.message}</p> : null}
          <Fade triggerOnce delay={900} className="flex items-center justify-center w-full">
            <Button type="submit" className="flex gap-4" disabled={submitting}>
              Calculer mon taux
              {submitting ? <Loader className="!w-10 !h-auto" /> : null}
            </Button>
          </Fade>
        </form>
        <div className="absolute bottom-0 w-full h-1 px-5">
          <div
            className="h-full transition-all duration-400 rounded-xl bg-main-gradient"
            ref={progressBar}
            style={{ width: 0 }}></div>
        </div>
      </Modal>
      <Credits />
    </>
  );
}
