export interface Vehicle {
  model: string;
  minWeight: number;
  maxWeight: number;
  score?: number;
}

export interface Energy {
  name: string;
  score?: number;
}

export interface MileagePerYear {
  minKilo: number;
  maxKilo: number;
  score?: number;
}

export interface ConstructionYear {
  minYear: number;
  maxYear: number;
  score?: number;
}

export interface Passenger {
  passengersNumber: number;
  percentage?: number;
}

export interface BankInformation {
  minScore: number;
  maxScore: number;
  borrowingPercentage: number;
}

export interface Data {
  vehicles: Vehicle[];
  energies: Energy[];
  mileagesPerYear: MileagePerYear[];
  constructionYears: ConstructionYear[];
  passengers: Passenger[];
  bankInformations: BankInformation[];
}

export interface Error {
  field: string | null;
  message: string;
}
