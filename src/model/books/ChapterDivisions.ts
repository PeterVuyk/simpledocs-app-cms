export type ChapterDivision =
  | 'chapter'
  | 'section'
  | 'subSection'
  | 'subHead'
  | 'subSubSection';

const ChapterDivisions = {
  chapter: 'Hoofdstuk',
  section: 'Paragraaf',
  subSection: 'Subparagraaf',
  subSubSection: 'Sub-subparagraaf',
  subHead: 'Tussenkop',
};

export default ChapterDivisions;
