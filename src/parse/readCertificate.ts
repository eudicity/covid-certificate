import { SingleSignedMessage } from "../cose/SingleSignedMessage";
import { inflate as zlib_inflate } from "pako";
import { decode as base45_decode } from "./base45";
import { strip_header } from "./strip_header";
import { decode as cbor_decode } from "cbor";
import { extractAlgorithm, extractKid } from "../cose/header/headers"
import ChainValidator from "../validate/ChainValidator";
import IsCoseSingleSignedMessageValidator from "../validate/cbor/IsCoseSingleSignedMessageValidator";
import { translateAlgorithm } from "./translate";
import { CoseAlgorithm } from "../cose/algorithms";

/**
 * Parse a certificate string into a COSE single signed message
 *
 * @example
 * Here is an example:
 * ```
 * const cert = readCertificate("HC1:data_from_QR_scanner");
 * ```
 *
 * @param certificate - The base45 encoded, zlib deflated, CBor encoded string. Normally one can obtain
 * such string by scanning a QR-code
 */
export const readCertificate = (certificate: string): SingleSignedMessage => {
  const coseMessage = zlib_inflate(base45_decode(strip_header(certificate)));
  const data = cbor_decode(coseMessage);

  // Create validator
  const cborValidator = new ChainValidator([
    new IsCoseSingleSignedMessageValidator(),
  ]);

  // Validate data
  const validationResult = cborValidator.validate(data);

  if (!validationResult.isValid()) {
    throw new Error(
      "Given certificate string not valid: " + validationResult.getMessage()
    );
  }

  // Create single signed cose message
  const [protectedHeaders, unprotectedHeaders, payload, signature] = data.value;
  const message = new SingleSignedMessage();
  message.setProtectedHeaders(protectedHeaders);
  message.setUnprotectedHeaders(unprotectedHeaders);

  let kid = "";
  // try to extract kid from the headers
  try {
    kid = extractKid(protectedHeaders, unprotectedHeaders);
  } catch (error) {
    throw new Error("No kid in headers");
  }

  if (kid.length === 0) {
    throw new Error("Kid is an empty string");
  }
  message.setKid(kid);

  let alg: number;
  try {
    alg = extractAlgorithm(protectedHeaders, unprotectedHeaders);
  } catch (error) {
    throw new Error("Algorithm not set in headers");
  }

  if (alg !== CoseAlgorithm.ECDS_256) {
    throw new Error("Algorithm is not known");
  }
  message.setAlgorithm(translateAlgorithm(alg))

  message.setPayload(payload);
  message.setSignature(signature);

  return message;
};
