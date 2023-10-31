'use client';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import Modal from '@/components/Modal';
import RangeInput from '@/components/RangeInput';
import Select from '@/components/Select';
import axios from 'axios';
import React, { useEffect } from 'react';
import { Data } from '@/types';

export default function Home() {
  const progressBar = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [data, setData] = React.useState<Data>({} as Data);

  // Form input variables
  const [vehicle, setVehicle] = React.useState<string | null>(null);
  const [energy, setEnergy] = React.useState<string | null>(null);
  const [mileagesPerYear, setMileagesPerYear] = React.useState<number | null>(null);
  const [constructionYear, setConstructionYear] = React.useState<number | null>(null);
  const [passenger, setPassenger] = React.useState<number | null>(null);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    // Avoid page reload
    e.preventDefault();

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
          mileagesPerYear,
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

          // Save data to localstorage
          localStorage.setItem('data', JSON.stringify(res.data));
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
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
        setMileagesPerYear(res.data.mileagesPerYear[0].minKilo);
        setPassenger(res.data.passengers[0].passengersNumber);

        // Stop the loader
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // If the data is not loaded yet, we show a loader
  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Modal>
        <form action="" onSubmit={submitForm} className="flex flex-col items-center justify-center w-full gap-8">
          <div className="flex flex-col">
            <h1 className="mb-4 text-5xl font-bold text-center">Simulateur de taux d'emprunt</h1>
            <h2 className="mb-4 -mt-3 text-2xl font-bold text-center text-neutral-400">
              Renseignez vos informations pour obtenir votre taux
            </h2>
          </div>

          <Select
            label="Type de véhicule"
            value={vehicle || ''}
            onChange={setVehicle}
            options={
              data.vehicles ? data.vehicles?.map((v: { model: string }) => ({ label: v.model, value: v.model })) : []
            }
          />

          <Select
            label="Type d'énergie"
            value={energy || ''}
            onChange={setEnergy}
            options={
              data.energies ? data.energies?.map((e: { name: string }) => ({ label: e.name, value: e.name })) : []
            }
          />

          <RangeInput
            label="Kilométrage annuel"
            // We set the min to the min value of the data
            min={data.mileagesPerYear && Math.min(...data.mileagesPerYear.map((m: { minKilo: number }) => m.minKilo))}
            // We set the max to the max value of the data
            max={data.mileagesPerYear && Math.max(...data.mileagesPerYear.map((m: { maxKilo: number }) => m.maxKilo))}
            // We calculate the step by dividing the difference between the max and the min by 1000
            step={Math.round((Math.max(...data.mileagesPerYear.map((m: { maxKilo: number }) => m.maxKilo)) - Math.min(...data.mileagesPerYear.map((m: { minKilo: number }) => m.minKilo))) / 1000)}
            unit="km/an"
            value={mileagesPerYear?.toString() || ''}
            onChange={(value) => setMileagesPerYear(parseInt(value))}
          />

          <Input
            label="Année de construction"
            type="number"
            placeholder="2023"
            value={constructionYear?.toString() || ''}
            onChange={(value) => setConstructionYear(parseInt(value))}
          />

          <RangeInput
            label="Nombre de passagers"
            // We set the min to the min value of the data
            min={data.passengers && Math.min(...data.passengers.map((p: { passengersNumber: number }) => p.passengersNumber))}
            // We set the max to the max value of the data
            max={data.passengers && Math.max(...data.passengers.map((p: { passengersNumber: number }) => p.passengersNumber))}
            unit={passenger > 1 ? "passagers" : "passager"}
            value={passenger?.toString() || ''}
            onChange={(value) => setPassenger(parseInt(value))} />

          <Button type="submit" className="flex gap-4" disabled={submitting}>
            Calculer mon taux
            {submitting ? <Loader className="!w-10 !h-auto" /> : null}
          </Button>
        </form>
        <div className="absolute bottom-0 w-full h-1 px-5">
          <div
            className="h-full transition-all duration-200 rounded-xl bg-main-gradient"
            ref={progressBar}
            style={{ width: 0 }}></div>
        </div>
      </Modal>
    </div>
  );
}
