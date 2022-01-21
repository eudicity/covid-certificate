export const ICAO9309 = /^[A-Z<]*$/;

export const ISO8601 = /^(19|20)\d\d(-\d\d){2}$/;

export const ISO01 = /^[A-Z]{2}$/;

/**
  * Can be used to check whether an string is in ICAO 0930 format. Is used for given name and surname.
  */
export const isInICAO9309 = (str: string): boolean => {
  return ICAO9309.test(str);
};

/**
  * Can be used to check whether an date string is in ISO 8601. Is used for date of birth.
  */
export const isInISO8601 = (str: string): boolean => {
  return ISO8601.test(str);
};
