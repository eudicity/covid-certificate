import * as x509 from "@peculiar/x509";
import {
  Valid,
  VerificationError,
  VerificationResult,
} from "./VerificationResult";
import { IssuerCertificateData } from "../issuer/certificates";
import ECDS256SignatureVerifier from "../cose/ECDS256SignatureVerifier";
import { SingleSignedMessage } from "../cose/SingleSignedMessage";

export const verifySignature = (
  certificate: SingleSignedMessage,
  issuerCert: IssuerCertificateData,
  validationClock: Date = new Date()
): VerificationResult => {

  const x509cert = new x509.X509Certificate(issuerCert.rawData);

  if (
    x509cert.notBefore > validationClock ||
    x509cert.notAfter < validationClock
  ) {
    return new VerificationError("Certificate is not valid")
  }

  const sigVerifier = new ECDS256SignatureVerifier();
  const verificationResult = sigVerifier.verify(
    certificate,
    x509cert.publicKey.rawData
  );

  if (!verificationResult) {
    return new VerificationError("Signature is tempered");
  }

  return new Valid();
};
