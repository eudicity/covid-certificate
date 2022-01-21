export type ValueSetsObject = Record<string, ValueSetObject>

export type ValueSetsCompactObject = Record<string, Array<string>>

type ValueSetObject = <string, ValueObject>

type ValueObject = {
  display: string;
  lang?: string;
  active?: boolean;
  version?: string;
  system?: string;
}
