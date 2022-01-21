export type HCertJSON = {
  nam: Name;
  dob: string;
  v?: Array<VaccinatedCertificateJSON>;
  t?: Array<TestCertificateJSON>;
  r?: Array<RecoveredCertificateJSON>;
  ver: string;
};

export type Name = {
  fnt: string;
  fn?: string;
  gn?: string;
  gnt?: string;
};

export type VaccinatedCertificateJSON = {
  tg: string;
  vp: string;
  mp: string;
  ma: string;
  dn: number;
  sd: number;
  dt: string;
  co: string;
  is: string;
  ci: string;
};

export type RecoveredCertificateJSON = {
  ci: string;
  is: string;
  co: string;
  tg: string;
  fr: string;
  df: string;
  du: string;
};

export type TestCertificateJSON = {
  tg: string;
  tt: string;
  nm?: string;
  ma?: string;
  sc: string;
  tr: string;
  tc?: string;
  co: string;
  is: string;
  ci: string;
};
