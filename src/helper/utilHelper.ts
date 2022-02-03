const copyText = (text: string): void => {
  const el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  el.focus();
  document.execCommand('copy');
};

const isCopyByBrowserSupported = (): boolean => {
  return navigator.userAgent.indexOf('Firefox') !== 64;
};

const utilHelper = { copyText, isCopyByBrowserSupported };

export default utilHelper;
