import {
  specificationVersion,
  evaluate
} from "certlogic-js";
import semver from "semver";
import { BusinessRule } from "./BusinessRule";
import {
  BusinessRuleCheckResult,
  RuleBreak,
  CrossCheckRequired,
  Compliance
} from "./BusinessRuleCheckResult";
import { HealthCertificate } from "../health-certificate/HealthCertificate";
import { ValueSetsCompactObject } from "../value-sets/ValueSets";

/**
  * Check health certificate for compliance to business rules issued by each country
  *
  * @param hcert
  * @param rules
  * @param destinationCountry
  * @param valueSets
  * @param validationClock
  * @param externals
  */
export const checkForBusinessRules = (
  hcert: HealthCertificate,
  rules: Array<BusinessRule>,
  destinationCountry: string,
  valueSets: ValueSetsCompactObject = {},
  validationClock: Date = new Date(),
  externals?: any
): BusinessRuleCheckResult => {
  const dataContext = {
    payload: hcert.json[hcert.type][0],
    external: {
      validationClock: validationClock.toISOString(),
      valueSets: valueSets,
      exp: hcert.expirationDate.toISOString(),
      iat: hcert.issuedAt.toISOString(),
      countryCode: destinationCountry,
      issuerCountryCode: hcert.issuerCountry,
      ...externals
    }
  }

  let open = [];
  for (const rule of rules) {
    // if rule not compatible to hcert or certlogic version let it open
    if (
      rule.Engine !== 'CERTLOGIC' ||
      !semver.gte(hcert.version, rule.SchemaVersion) ||
      !semver.gte(specificationVersion, rule.EngineVersion)
    ) {
      open.push(rule);
      break;
    }

    const passed = evaluate(rule.Logic, dataContext);
    if (
      (rule.Type === 'Acceptance' && !passed) ||
      (rule.Type === 'Invalidation' && passed)
    ) {
      return new RuleBreak(rule);
    }
  }

  if (open.length > 0) {
    return new CrossCheckRequired(open);
  }

  return new Compliance();
}
