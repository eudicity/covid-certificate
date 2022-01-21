import {
  Algorithm,
} from "../health-certificate/HealthCertificate";
import { CoseAlgorithm } from "../cose/algorithms";

export const translateAlgorithm = (alg: CoseAlgorithm): Algorithm => {
  const t = {
    [CoseAlgorithm.ECDS_256]: Algorithm["ECDSA-256"],
  };

  return t[alg];
};
