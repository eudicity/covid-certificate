import { CertLogicExpression } from 'certlogic-js';

export type BusinessRule = {
  AffectedFields: Array<string>,
  CertificateType: "Vaccination" | "Recovery" | "Test",
  Country: string,
  Description: Array<BusinessRuleDescription>,
  Engine: string,
  EngineVersion: string,
  Identifier: string,
  Logic: CertLogicExpression,
  SchemaVersion: string,
  Type: "Acceptance" | "Invalidation",
  ValidFrom: string,
  validTo: string,
  Version: string,
};

type BusinessRuleDescription = {
  desc: string,
  lang: string,
};
