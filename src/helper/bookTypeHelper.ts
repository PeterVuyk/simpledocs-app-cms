import {
  BT_BRANCHERICHTLIJN_MEDISCHE_HULPVERLENING,
  BT_INSTRUCTION_MANUAL,
  BT_REGULATIONS_ONTHEFFING_GOEDE_TAAKUITVOERING,
  BT_REGULATIONS_REGELING_OGS_2009,
  BT_REGULATIONS_RVV_1990,
  BookType,
} from '../model/BookType';

const getTitleByBookType = (bookType: BookType) => {
  switch (bookType) {
    case BT_BRANCHERICHTLIJN_MEDISCHE_HULPVERLENING:
      return 'Brancherichtlijn medische hulpverlening';
    case BT_REGULATIONS_REGELING_OGS_2009:
      return 'Regeling OGS 2009';
    case BT_REGULATIONS_RVV_1990:
      return 'RVV 1990';
    case BT_REGULATIONS_ONTHEFFING_GOEDE_TAAKUITVOERING:
      return 'Ontheffing goede taakuitoefening';
    case BT_INSTRUCTION_MANUAL:
    default:
      return 'Handboek';
  }
};

const dashedPathToBookType = (path: string): BookType => {
  switch (path) {
    case 'instruction-manual':
      return BT_INSTRUCTION_MANUAL;
    case 'regeling-ogs-2009':
      return BT_REGULATIONS_REGELING_OGS_2009;
    case 'ontheffing-goede-taakuitoefening':
      return BT_REGULATIONS_ONTHEFFING_GOEDE_TAAKUITVOERING;
    case 'brancherichtlijn-medische-hulpverlening':
      return BT_BRANCHERICHTLIJN_MEDISCHE_HULPVERLENING;
    case 'rvv-1990':
    default:
      return BT_REGULATIONS_RVV_1990;
  }
};

const bookTypeToDashedPath = (bookType: BookType): string => {
  switch (bookType) {
    case BT_REGULATIONS_REGELING_OGS_2009:
      return 'regeling-ogs-2009';
    case BT_REGULATIONS_ONTHEFFING_GOEDE_TAAKUITVOERING:
      return 'ontheffing-goede-taakuitoefening';
    case BT_BRANCHERICHTLIJN_MEDISCHE_HULPVERLENING:
      return 'brancherichtlijn-medische-hulpverlening';
    case BT_REGULATIONS_RVV_1990:
      return 'rvv-1990';
    case BT_INSTRUCTION_MANUAL:
    default:
      return 'instruction-manual';
  }
};

const bookTypeHelper = {
  dashedPathToBookType,
  bookTypeToDashedPath,
  getTitleByBookType,
};

export default bookTypeHelper;
