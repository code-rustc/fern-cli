import * as core from '../../core';
import { NewPet, newPet, newPetRequest, newPetResponse } from './new-pet';

export interface Pet extends NewPet {
  id: number;
}

/**
 * Cast schema for the Pet model — a bare identity (see cast.ts): this
 * export is never itself used for wire<->app rename, only referenced by name from other files.
 */
export const pet = core.cast.identity<Pet>();

/**
 * Cast schema for mapping API responses to the Pet application shape.
 * Renames wire keys to idiomatic property names; performs no validation (see cast.ts).
 */
export const petResponse = core.cast.object(
  (raw: any): any => {
    if (raw === null || raw === undefined) {
      return raw;
    }
    const __declaredKeys = new Set<string>(['name', 'tag', 'id']);
    const __extras: { [key: string]: unknown } = {};
    for (const __key of globalThis.Object.keys(raw as object)) {
      if (!__declaredKeys.has(__key)) {
        __extras[__key] = (raw as { [key: string]: unknown })[__key];
      }
    }
    return { ...__extras, name: raw['name'], tag: raw['tag'], id: raw['id'] };
  },
  ['name', 'id'],
);

/**
 * Cast schema for mapping the Pet application shape to API requests.
 * Renames idiomatic property names back to wire keys; performs no validation (see cast.ts).
 */
export const petRequest = core.cast.object(
  (raw: any): any => {
    if (raw === null || raw === undefined) {
      return raw;
    }
    return { name: raw['name'], tag: raw['tag'], id: raw['id'] };
  },
  ['name', 'id'],
);
