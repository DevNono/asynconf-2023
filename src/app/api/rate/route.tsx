/* eslint-disable @typescript-eslint/no-unused-vars */
import { BankInformation, ConstructionYear, Energy, MileagePerYear, Passenger, Vehicle } from '@/types';
import fs from 'fs';

// Get json file and parse it (as it's in the beginning of the fil, it's state will be preserved on each call)
const json = JSON.parse(fs.readFileSync('@/../public/data.json', 'utf8'));

// Get parameters from json file
const vehiules = json.vehicles as Vehicle[];
const energies = json.energies as Energy[];
const mileagesPerYear = json.mileagesPerYear as MileagePerYear[];
const constructionYears = json.constructionYears as ConstructionYear[];

// Get bonuses and maluses from json file (as passengers)
const passengers = json.passengers as Passenger[];

// Get bank informations from json file in order to calculate the borrowing rate
const bankInformations = json.bankInformations as BankInformation[];

// We use the same file for the GET call as it's a small project
export async function GET() {
  // Prepare data to send back by removing score from vehiules, energies, mileagesPerYear, constructionYears and passengers
  // Indeed score is a sensitive data and we don't need it
  const safeVehiules = vehiules.map(({ score, ...rest }) => rest);
  const safeEnergies = energies.map(({ score, ...rest }) => rest);
  const safeMileagesPerYear = mileagesPerYear.map(({ score, ...rest }) => rest);
  const safeConstructionYears = constructionYears.map(({ score, ...rest }) => rest);
  const safePassengers = passengers.map(({ percentage, ...rest }) => rest);

  // Send back the result without bankInformations as it contains sensitive data and we don't need them
  return Response.json({
    vehicles: safeVehiules,
    energies: safeEnergies,
    mileagesPerYear: safeMileagesPerYear,
    constructionYears: safeConstructionYears,
    passengers: safePassengers,
  });
}

// Use the api route as a POST request
export async function POST(request: Request) {
  // Name from the client are in singular
  const { vehicle, energy, mileagePerYear, constructionYear, passenger } = await request.json();

  // Get the vehicle score, if the vehicle is not found, then return an error
  const vehicleScore = vehiules.find((v) => v.model === vehicle)?.score;

  if (!vehicleScore) return Response.json({ error: "Le type de véhicule n'a pas été trouvé", field: 'vehicle' });

  // Get the energy score, if the energy is not found, then return an error
  const energyScore = energies.find((e) => e.name === energy)?.score;

  if (!energyScore) return Response.json({ error: "Le type d'énergie n'a pas été trouvé", field: 'energy' });

  // Get the mileagePerYear minimal and maximal score
  const minKilo = Math.min(...mileagesPerYear.map((m) => m.minKilo));
  const maxKilo = Math.max(...mileagesPerYear.map((m) => m.maxKilo));

  // Get the mileagePerYear score, if the mileagePerYear is not found, then return an error
  const mileagePerYearScore = mileagesPerYear.find((m) => mileagePerYear >= m.minKilo && mileagePerYear <= m.maxKilo)
    ?.score;

  if (!mileagePerYearScore) {
    if (mileagePerYear < minKilo || mileagePerYear > maxKilo) {
      return Response.json({
        error: `Le kilométrage annuel doit être compris entre ${minKilo} et ${maxKilo}`,
        field: 'mileagePerYear',
      });
    }

    // Else return a generic error
    return Response.json({ error: "Le kilométrage annuel n'a pas été trouvé", field: 'mileagePerYear' });
  }

  // Get the constructionYear minimal and maximal score
  // We handle the case where the minYear or the maxYear is null meaning that there is no limit
  const minYears = constructionYears.map((c) => c.minYear);
  let minYear = Math.min(...minYears);
  if (minYears.includes(null)) minYear = -Infinity;

  const maxYears = constructionYears.map((c) => c.maxYear);
  let maxYear = Math.max(...maxYears);
  if (maxYears.includes(null)) maxYear = new Date().getFullYear();

  // Get the constructionYear score, if the constructionYear is not found, then return an error
  // We consider the null value that means that there is no limit
  const constructionYearScore = constructionYears.find(
    (c) =>
      (constructionYear >= c.minYear || c.minYear === null) && (constructionYear <= c.maxYear || c.maxYear === null),
  )?.score;

  if (!constructionYearScore) {
    if (constructionYear < minYear || constructionYear > maxYear) {
      return Response.json({
        error: `L'année de construction doit être comprise entre ${minYear} et ${maxYear}`,
        field: 'constructionYear',
      });
    }

    // else return a generic error
    return Response.json({ error: "L'année de construction n'a pas été trouvé", field: 'constructionYear' });
  }

  // Calculate the score with the vehicle, energy, mileagePerYear and constructionYear scores
  const score = vehicleScore + energyScore + mileagePerYearScore + constructionYearScore;

  // Get the bankInformations borrowing rate, if the bankInformations is not found, then return an error
  const borrowingPercentage = bankInformations.find((b) => score >= b.minScore && score <= b.maxScore)
    ?.borrowingPercentage;

  if (!borrowingPercentage)
    return Response.json({
      error: "Erreur interne liée au calcul de votre taux d'emprunt. Veuillez réessayer plus tard.",
      field: null,
    });

  // Get the passenger minimal and maximal score
  const minPassenger = Math.min(...passengers.map((p) => p.passengersNumber));
  const maxPassenger = Math.max(...passengers.map((p) => p.passengersNumber));

  // Get the passenger bonus/malus score, if the passenger is not found, then return an error
  // We consider that all range of passengers are covered by the data (ex: 1 to 5 passengers without any gap)
  const passengerPercentage = passengers.find((p) => p.passengersNumber === passenger)?.percentage;

  if (!passengerPercentage) {
    if (passenger < minPassenger || passenger > maxPassenger) {
      return Response.json({
        error: `Le nombre de passagers doit être compris entre ${minPassenger} et ${maxPassenger}`,
        field: 'passenger',
      });
    }

    // Else return a generic error
    return Response.json({ error: "Le nombre de passagers n'a pas été trouvé", field: 'passenger' });
  }

  // Calculate the score with the passenger bonus/malus score and limit to 2 decimals
  const finalBorrowingPercentage = (borrowingPercentage + passengerPercentage).toFixed(2);

  // Send back the result as there are no errors
  return Response.json({ value: finalBorrowingPercentage });
}
