import fs from 'fs';

// Get json file and parse it
const json = JSON.parse(fs.readFileSync('@/../public/data.json', 'utf8'));

// Get parameters from json file
const vehiules = json.vehicules as Array<{ model: string, minWeight: number, maxWeight: number, score: number }>;
const energies = json.energies as Array<{ name: string, score: number }>;
const mileagesPerYear = json.mileagesPerYear as Array<{ minKilo: number, maxKilo: number, score: number }>;
const constructionYears = json.constructionYears as Array<{ minYear: number, maxYear: number, score: number }>;

// Get bonuses and maluses from json file (as passengers)
const passengers = json.passengers as Array<{ passengersNumber: string, percentage: number }>;

// Get bank informations from json file in order to calculate the borrowing rate
const bankInformations = json.bankInformations as Array<{ minScore: number, maxScore: number, borrowingPercentage: number }>;

// We use the same file for the GET call as it's a small project
export async function GET() {
    // Send back the result without bankInformations and passengers as there are sensitive data and we don't need them
    return Response.json({ vehiules, energies, mileagesPerYear, constructionYears });
}


// Use the api route as a POST request
export async function POST(request: Request) {
    const { vehicule, energy, mileagePerYear, constructionYear, passenger } =  await request.json();

    // Get the vehicule score, if the vehicule is not found, then return an error
    const vehiculeScore = vehiules.find((v) => v.model === vehicule)?.score;

    if(!vehiculeScore) return Response.json({ error: `Le type de véhicule n'a pas été trouvé`, formerror: 'vehicule' });

    // Get the energy score, if the energy is not found, then return an error
    const energyScore = energies.find((e) => e.name === energy)?.score;

    if(!energyScore) return Response.json({ error: `Le type d'énergie n'a pas été trouvé`, formerror: 'energy' });

    // Get the mileagePerYear minimal and maximal score
    const minKilo = Math.min(...mileagesPerYear.map((m) => m.minKilo));
    const maxKilo = Math.max(...mileagesPerYear.map((m) => m.maxKilo));
    
    // Get the mileagePerYear score, if the mileagePerYear is not found, then return an error
    const mileagePerYearScore = mileagesPerYear.find((m) => mileagePerYear >= m.minKilo && mileagePerYear <= m.maxKilo)?.score;

    if(!mileagePerYearScore) {
        if(mileagePerYear < minKilo || mileagePerYear > maxKilo) {
            return Response.json({ error: `Le kilométrage annuel doit être compris entre ${minKilo} et ${maxKilo}`, formerror: 'mileagePerYear' });
        }

        // else return a generic error
        return Response.json({ error: `Le kilométrage annuel n'a pas été trouvé`, formerror: 'mileagePerYear' });
    }


    // Get the constructionYear minimal and maximal score
    const minYear = Math.min(...constructionYears.map((c) => c.minYear));
    const maxYear = Math.max(...constructionYears.map((c) => c.maxYear));

    // Get the constructionYear score, if the constructionYear is not found, then return an error
    const constructionYearScore = constructionYears.find((c) => constructionYear >= c.minYear && constructionYear <= c.maxYear)?.score;

    if(!constructionYearScore) {
        if(constructionYear < minYear || constructionYear > maxYear) {
            return Response.json({ error: `L'année de construction doit être comprise entre ${minYear} et ${maxYear}`, formerror: 'constructionYear' });
        }

        // else return a generic error
        return Response.json({ error: `L'année de construction n'a pas été trouvé`, formerror: 'constructionYear' });
    }

    // Calculate the score with the vehicule, energy, mileagePerYear and constructionYear scores
    const score = vehiculeScore + energyScore + mileagePerYearScore + constructionYearScore;

    // Get the bankInformations borrowing rate, if the bankInformations is not found, then return an error
    const borrowingPercentage = bankInformations.find((b) => score >= b.minScore && score <= b.maxScore)?.borrowingPercentage;

    if(!borrowingPercentage) return Response.json({ error: `Erreur interne liée au calcul de votre taux d'emprunt. Veuillez réessayer plus tard.`, formerror: null });

    // Get the passenger bonus/malus score, if the passenger is not found, then return an error
    const passengerPercentage = passengers.find((p) => p.passengersNumber === passenger)?.percentage;

    if(!passengerPercentage) return Response.json({ error: `Erreur interne liée au calcul de votre bonus/malus. Veuillez réessayer plus tard.`, formerror: null });

    // Calculate the score with the passenger bonus/malus score
    const finalBorrowingPercentage = borrowingPercentage + passengerPercentage;

    // Send back the result as there are no errors
    return Response.json({ value: finalBorrowingPercentage });
}