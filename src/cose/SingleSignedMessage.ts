import { Buffer } from "buffer";
import {
  CosePayload,
  CoseProtectedHeaders,
  CoseSignature,
  CoseUnprotectedHeaders,
} from "./cose";
import { Algorithm } from "../health-certificate/HealthCertificate";

/**
 * A single signed COSE message
 *
 */
export class SingleSignedMessage {
  private unprotectedHeaders: CoseUnprotectedHeaders;
  private protectedHeaders: CoseProtectedHeaders;
  private kid: string;
  private algorithm: Algorithm;
  private payload: CosePayload;
  private signature: CoseSignature;

  /**
   * Get the array that has to be signed, defined by the COSE
   * definition. See: https://datatracker.ietf.org/doc/html/rfc8152#section-4.4
   */
  toSign(): Array<Buffer | string> {
    return ["Signature1", this.protectedHeaders, Buffer.alloc(0), this.payload];
  }

  /* Getters and setters */
  getUnprotectedHeaders(): Map<number, Buffer> {
    return this.unprotectedHeaders;
  }

  setUnprotectedHeaders(unprotectedHeaders: Map<number, Buffer>) {
    this.unprotectedHeaders = unprotectedHeaders;
  }

  getProtectedHeaders(): Buffer {
    return this.protectedHeaders;
  }

  setProtectedHeaders(protectedHeaders: Buffer) {
    this.protectedHeaders = protectedHeaders;
  }

  getKid(): string {
    return this.kid;
  }

  setKid(kid: string) {
    this.kid = kid;
  }

  getAlgorithm(): Algorithm {
    return this.algorithm;
  }

  setAlgorithm(algorithm: Algorithm) {
    this.algorithm = algorithm;
  }

  getPayload(): Buffer {
    return this.payload;
  }

  setPayload(payload: Buffer) {
    this.payload = payload;
  }

  getSignature(): Buffer {
    return this.signature;
  }

  setSignature(signature: Buffer) {
    this.signature = signature;
  }
}
