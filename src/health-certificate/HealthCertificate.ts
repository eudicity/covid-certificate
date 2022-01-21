import { HCertJSON } from './jsonTypes';

/**
 * Electronic Health Certificate Specification
 *
 */
export type HealthCertificate = {
  issuerCountry: string;
  expirationDate: Date;
  issuedAt: Date;
  dateOfBirth: string;
  name: Name;
  vaccinations: Array<VaccinationCertificate>;
  tests: Array<TestCertificate>;
  recovered: Array<RecoveredCertificate>;
  version: string;
  type: Type;
  json: HCertJSON;
};

export type Type = "v" | "t" | "r";

export type Name = {
  surname: string;
  givenName?: string;
};

export type VaccinationCertificate = {
  target: string;
  vaccineType: string;
  medicinalProduct: string;
  manufacturer: string;
  doseNumber: number;
  totalDoses: number;
  date: Date;
  country: string;
  issuer: string;
  id: string;
};

export type TestCertificate = {
  target: string;
  testType: string;
  name: string;
  manufacturer: string;
  date: Date;
  result: string;
  testingCentre: string;
  country: string;
  issuer: string;
  id: string;
};

export type RecoveredCertificate = {
  id: string;
  target: string;
  firstDetectedDate: Date;
  countryOfTest: string;
  issuer: string;
  dateValidFrom: Date;
  dateValidUntil: Date;
};

export enum Algorithm {
  /**
   * Elliptic curve digital signing algorithm with sha256 hash
   */
  "ECDSA-256" = "ECDSA-256",
};
