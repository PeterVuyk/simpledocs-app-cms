import React from 'react';
import { useHistory } from 'react-router-dom';

function useNavigate() {
  const history = useHistory();

  /**
   * When updating the code below, remember the _blank security flaw: https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/
   */
  const openInNewTab = (path: string) => {
    const newWindow = window.open(path, '_blank', 'noopener,noreferrer');
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  const navigateBack = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<SVGSVGElement, MouseEvent>
      | React.MouseEvent<HTMLLIElement>
      | React.MouseEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLDivElement>,
    path: string
  ) => (e.ctrlKey ? openInNewTab(path) : history.goBack());

  const navigate = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<SVGSVGElement, MouseEvent>
      | React.MouseEvent<HTMLLIElement>
      | React.MouseEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLDivElement>,
    path: string
  ) => (e.ctrlKey ? openInNewTab(path) : history.push(path));

  return { navigate, navigateBack, history };
}

export default useNavigate;
