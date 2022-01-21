import { SingleSignedMessage } from "../cose/SingleSignedMessage";
import {
  HealthCertificate,
  Type,
  RecoveredCertificate,
  TestCertificate,
  VaccinationCertificate,
} from "../health-certificate/HealthCertificate";
import { decode } from "cbor";
import { schema } from "../validate/dcc/DCC-json-schema";
import ChainValidator from "../validate/ChainValidator";
import PayloadValidator from "../validate/dcc/PayloadValidator";
import DccJsonValidator from "../validate/dcc/DccJsonValidator";
import { HCertJSON } from "../health-certificate/jsonTypes";
import { ValueSetsObject, ValueSetObject } from "../value-sets/ValueSets";

/**
 * Parse a single signed COSE message
 *
 * @param message
 */
export const parseCoseCertificate = (
  message: SingleSignedMessage,
  valueSets?: ValueSetsObject
): HealthCertificate => {
  // should be data as specified in https://github.com/ehn-dcc-development/hcert-spec
  const data = decode(message.getPayload());

  // validate data in cose message
  const validator = new ChainValidator([
    new PayloadValidator(),
    new DccJsonValidator(schema),
  ]);

  const validationResult = validator.validate(data);

  if (!validationResult.isValid()) {
    throw new Error(
      "Data in COSE message not valid: " + validationResult.getMessage()
    );
  }

  const hcertData: HCertJSON = data.get(-260).get(1);

  return {
    expirationDate: new Date(data.get(4) * 1000),
    issuedAt: new Date(data.get(6) * 1000),
    dateOfBirth: hcertData.dob,
    name: {
      surname: hcertData.nam.fnt,
      givenName: hcertData.nam.gnt,
    },
    issuerCountry: data.get(1).toString(),
    recovered: convertRecoveredData(hcertData, valueSets),
    tests: convertTestData(hcertData, valueSets),
    vaccinations: convertVaccinationData(hcertData, valueSets),
    version: hcertData.ver,
    type: getType(hcertData),
    json: hcertData,
  };
};

/**
  * Returns type of certificate
  *
  * @param data
  */
const getType = (data: HCertJSON): Type => {
  if (data.v) {
    return "v";
  }
  if (data.r) {
    return "r";
  }
  return "t";
}

/**
 * Convert recovered data into an array of RecoveredCertificate's
 *
 * @param data
 */
const convertRecoveredData = (
  data: HCertJSON,
  valueSets: ValueSetsObject
): Array<RecoveredCertificate> => {
  if (!data.r) {
    return [];
  }

  return data.r.map((r) => {
    return {
      id: r.ci,
      target: translate(valueSets, "disease-agent-target", r.tg),
      firstDetectedDate: new Date(r.fr),
      countryOfTest: r.co,
      issuer: r.is,
      dateValidFrom: new Date(r.df),
      dateValidUntil: new Date(r.du),
    };
  });
};

const convertVaccinationData = (
  data: HCertJSON,
  valueSets: ValueSetsObject
): Array<VaccinationCertificate> => {
  if (!data.v) {
    return [];
  }

  return data.v.map((v) => {
    return {
      target: translate(valueSets, "disease-agent-target", v.tg),
      vaccineType: translate(valueSets, "sct-vaccines-covid-19", v.vp),
      medicinalProduct: translate(valueSets, "vaccines-covid-19-names", v.mp),
      manufacturer: translate(valueSets, "vaccines-covid-19-auth-holders", v.ma),
      doseNumber: v.dn,
      totalDoses: v.sd,
      date: new Date(v.dt),
      country: v.co,
      issuer: v.is,
      id: v.ci,
    };
  });
};

const convertTestData = (
  data: HCertJSON,
  valueSets: ValueSetsObject
): Array<TestCertificate> => {
  if (!data.t) {
    return [];
  }

  return data.t.map((t) => {
    return {
      target: translate(valueSets, "disease-agent-target", t.tg),
      testType: translate(valueSets, "covid-19-lab-test-type", t.tt),
      name: t.nm || "",
      manufacturer: translate(valueSets, "covid-19-lab-test-manufacturer-and-name", t.ma),
      date: new Date(t.sc),
      result: translate(valueSets, "covid-19-lab-result", t.tr),
      testingCentre: t.tc || "",
      country: t.co,
      issuer: t.is,
      id: t.ci,
    };
  });
};

const translate = (sets: ValueSetsObject, setId: string, value: string = "") => {
  if (sets && sets[setId] && sets[setId][value] && sets[setId][value].display) {
    return sets[setId][value].display
  }
  return value;
}
