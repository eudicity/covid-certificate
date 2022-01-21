import { HealthCertificate } from "../health-certificate/HealthCertificate";
import { readCertificate } from "./readCertificate";
import { parseCoseCertificate } from "./parseCoseCertificate";
import { ValueSetsObject } from "../value-sets/ValueSets"

/**
 * Parse certificate string
 *
 * @example
 * ```js
 * const certificate = parse("HC1:your_data_from_QR_Code");
 * ```
 * @remarks
 *
 * This function will not verify the signature of the data.
 *
 * @param certificate
 */
export const parse = (
  certificate: string,
  valueSets: ValueSetsObject
): HealthCertificate => {
  return parseCoseCertificate(readCertificate(certificate), valueSets);
};
