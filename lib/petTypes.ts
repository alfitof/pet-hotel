import { PetType } from "./types";

export const DEFAULT_PET_TYPES: PetType[] = [
  {
    id: 1,
    name: "Doggo Classic",
    species: "dog",
    headImage: "/assets/pet-head-1.svg",
    petImage: "/assets/pet-1.svg",
  },
  {
    id: 5,
    name: "Doggo Fluffy",
    species: "dog",
    headImage: "/assets/pet-head-5.svg",
    petImage: "/assets/pet-5.svg",
  },
  {
    id: 6,
    name: "Doggo Spotted",
    species: "dog",
    headImage: "/assets/pet-head-6.svg",
    petImage: "/assets/pet-6.svg",
  },
  {
    id: 2,
    name: "Kitty Stripe",
    species: "cat",
    headImage: "/assets/pet-head-2.svg",
    petImage: "/assets/pet-2.svg",
  },
  {
    id: 3,
    name: "Kitty Fluffy",
    species: "cat",
    headImage: "/assets/pet-head-3.svg",
    petImage: "/assets/pet-3.svg",
  },
  {
    id: 4,
    name: "Kitty Tuxedo",
    species: "cat",
    headImage: "/assets/pet-head-4.svg",
    petImage: "/assets/pet-4.svg",
  },
];

export const PET_BOTTOM_OFFSET: Record<number, number> = {
  1: 27,
  2: 29,
  3: 32,
  4: 28,
  5: 24,
  6: 25,
};
