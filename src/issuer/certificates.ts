export type IssuerCertificateData = {
  certificateType?: string;
  country?: string;
  kid: string;
  rawData: string;
  signature?: string;
  thumbprint?: string;
  timestamp?: string;
};
