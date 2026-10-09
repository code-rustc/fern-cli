import { NewPet, newPet } from '../common/new-pet';

export interface ListPetsRequest {
  limit?: number;
}

export interface GetPetRequest {
  petId: number;
}
