export default (value) => {
  const textArea = document.createElement('textarea');
  textArea.value = value;
  document.body.appendChild(textArea);
  textArea.select();

  try {
    document.execCommand('copy');
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }

  document.body.removeChild(textArea);
};
