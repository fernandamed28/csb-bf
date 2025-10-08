declare module "country-telephone-data" {
  export const allCountries: {
    name: string;
    iso2: string;
    dialCode: string;
    priority: number;
    areaCodes: string[] | null;
  }[];

  export const iso2Lookup: Record<
    string,
    {
      name: string;
      iso2: string;
      dialCode: string;
      priority: number;
      areaCodes: string[] | null;
    }
  >;
}
