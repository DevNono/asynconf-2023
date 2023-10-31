'use client';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import Modal from '@/components/Modal';
import Range from '@/components/Range';
import Select from '@/components/Select';
import axios from 'axios';
import React, { useEffect } from 'react';

interface Data {
  vehicules: { model: string }[];
  energies: { name: string }[];
  mileagePerYears: { name: string }[];
  constructionYears: { name: string }[];
  passengers: { name: string }[];
}

export default function Home() {
  const progressBar = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [data, setData] = React.useState<Data>({} as Data);

  // Form input variables
  const [vehicule, setVehicule] = React.useState('');
  const [energy, setEnergy] = React.useState('');
  const [mileagePerYear, setMileagePerYear] = React.useState('');
  const [constructionYear, setConstructionYear] = React.useState('');
  const [passenger, setPassenger] = React.useState('');

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    // Avoid page reload
    e.preventDefault();

    // Make the button as "sent"
    setSubmitting(true);

    // Send request to axios with a progress bar
    axios
      .post(
        'api/rate',
        {
          vehicule,
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
        setSubmitting(false);

        // Save data to localstorage
        localStorage.setItem('data', JSON.stringify(res.data));
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
        // Set the data and stop the loader
        setData((prev) => ({ ...prev, ...res.data}));
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
            value={vehicule}
            onChange={setVehicule}
            options={
              data.vehicules ? data.vehicules?.map((v: { model: string }) => ({ label: v.model, value: v.model })) : []
            }
          />

          <Select
            label="Type d'énergie"
            value={energy}
            onChange={setEnergy}
            options={
              data.energies ? data.energies?.map((e: { name: string }) => ({ label: e.name, value: e.name })) : []
            }
          />


          <Range label="Kilométrage annuel" min={0} max={100000} step={1000} value={mileagePerYear} onChange={setMileagePerYear} />


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
