export type PetSpecies = "cat" | "dog";

export type PetType = {
  id: number;
  name: string;
  species: PetSpecies;
  headImage: string;
  petImage: string;
};

export type BookedPet = {
  petName: string;
  ownerName: string;
  ownerPhone?: string;
  petType: PetType;
  checkIn: string;
  checkInTimestamp: number;
  duration: number;
  notes?: string;
};

export type CargoSlot = {
  id: number;
  pet: BookedPet | null;
};

export type ActivityLog = {
  id: number;
  type: "checkin" | "checkout" | "added" | "removed";
  message: string;
  timestamp: number;
};
