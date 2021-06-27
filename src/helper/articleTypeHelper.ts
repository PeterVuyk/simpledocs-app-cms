import {
  ArticleType,
  AT_BRANCHERICHTLIJN_MEDISCHE_HULPVERLENING,
  AT_INSTRUCTION_MANUAL,
  AT_REGULATIONS_ONTHEFFING_GOEDE_TAAKUITVOERING,
  AT_REGULATIONS_REGELING_OGS_2009,
  AT_REGULATIONS_RVV_1990,
} from '../model/ArticleType';

const getTitleByArticleType = (articleType: ArticleType) => {
  switch (articleType) {
    case AT_BRANCHERICHTLIJN_MEDISCHE_HULPVERLENING:
      return 'Brancherichtlijn medische hulpverlening';
    case AT_REGULATIONS_REGELING_OGS_2009:
      return 'Regeling OGS 2009';
    case AT_REGULATIONS_RVV_1990:
      return 'RVV 1990';
    case AT_REGULATIONS_ONTHEFFING_GOEDE_TAAKUITVOERING:
      return 'Ontheffing goede taakuitoefening';
    case AT_INSTRUCTION_MANUAL:
    default:
      return 'Handboek';
  }
};

const dashedPathToArticleType = (path: string): ArticleType => {
  switch (path) {
    case 'instruction-manual':
      return AT_INSTRUCTION_MANUAL;
    case 'regeling-ogs-2009':
      return AT_REGULATIONS_REGELING_OGS_2009;
    case 'ontheffing-goede-taak-uitoefening':
      return AT_REGULATIONS_ONTHEFFING_GOEDE_TAAKUITVOERING;
    case 'brancherichtlijn-medische-hulpverlening':
      return AT_BRANCHERICHTLIJN_MEDISCHE_HULPVERLENING;
    case 'rvv-1990':
    default:
      return AT_REGULATIONS_RVV_1990;
  }
};

const articleTypeToDashedPath = (articleType: ArticleType): string => {
  switch (articleType) {
    case AT_REGULATIONS_REGELING_OGS_2009:
      return 'regeling-ogs-2009';
    case AT_REGULATIONS_ONTHEFFING_GOEDE_TAAKUITVOERING:
      return 'ontheffing-goede-taak-uitoefening';
    case AT_BRANCHERICHTLIJN_MEDISCHE_HULPVERLENING:
      return 'brancherichtlijn-medische-hulpverlening';
    case AT_REGULATIONS_RVV_1990:
      return 'rvv-1990';
    case AT_INSTRUCTION_MANUAL:
    default:
      return 'instruction-manual';
  }
};

const articleTypeHelper = {
  dashedPathToArticleType,
  articleTypeToDashedPath,
  getTitleByArticleType,
};

export default articleTypeHelper;
