import React, { FC, useEffect, useState } from 'react';
import { Theme } from '@mui/material/styles';
import Select from '../form/formik/Select';
import { DecisionTree } from '../../model/DecisionTree/DecisionTree';
import decisionTreeRepository from '../../firebase/database/decisionTreeRepository';

interface Props {
  showError: boolean;
  formik: React.MutableRefObject<any>;
  initialValue: string | null;
}

const DecisionTreeSelector: FC<Props> = ({
  initialValue,
  showError,
  formik,
}) => {
  const [decisionTrees, setDecisionTrees] = useState<DecisionTree[]>([]);

  useEffect(() => {
    if (!initialValue) {
      return;
    }
    const decisionTree = JSON.parse(initialValue) as DecisionTree;
    if (decisionTree && decisionTree.title) {
      formik.current?.setFieldValue('decisionTreeContent', decisionTree.title);
    }
  }, [formik, initialValue]);

  useEffect(() => {
    decisionTreeRepository
      .getDecisionTree(false)
      .then((trees) => trees.filter((tree) => !tree.markedForDeletion))
      .then(setDecisionTrees);
  }, []);

  const getDecisionTreeOptions = () => {
    return decisionTrees
      .map((value) => ({ id: value.title, title: value.title }))
      .reduce((obj, item) => Object.assign(obj, { [item.id]: item.title }), {});
  };

  if (!decisionTrees) {
    return null;
  }

  return (
    <Select
      required
      sx={{ marginTop: (theme: Theme) => theme.spacing(2) }}
      name="decisionTreeContent"
      label="Beslisboom"
      showError={showError}
      options={getDecisionTreeOptions()}
    />
  );
};

export default DecisionTreeSelector;
