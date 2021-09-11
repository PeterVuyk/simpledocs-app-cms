export const BT_INSTRUCTION_MANUAL = 'instructionManual';
export const BT_REGULATIONS_RVV_1990 = 'RVV1990';
export const BT_REGULATIONS_REGELING_OGS_2009 = 'regelingOGS2009';
export const BT_BRANCHERICHTLIJN_MEDISCHE_HULPVERLENING =
  'brancherichtlijnMedischeHulpverlening';
export const BT_REGULATIONS_ONTHEFFING_GOEDE_TAAKUITVOERING =
  'ontheffingGoedeTaakuitoefening';

export type BookType =
  | 'instructionManual'
  | 'RVV1990'
  | 'regelingOGS2009'
  | 'brancherichtlijnMedischeHulpverlening'
  | 'ontheffingGoedeTaakuitoefening';

export function isBookType(value: string): value is BookType {
  return [
    BT_INSTRUCTION_MANUAL,
    BT_REGULATIONS_RVV_1990,
    BT_REGULATIONS_REGELING_OGS_2009,
    BT_BRANCHERICHTLIJN_MEDISCHE_HULPVERLENING,
    BT_REGULATIONS_ONTHEFFING_GOEDE_TAAKUITVOERING,
  ].includes(value);
}
