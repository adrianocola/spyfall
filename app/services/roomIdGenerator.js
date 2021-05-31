const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export default () => {
  let text = '';

  for (let i = 0; i < 5; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};
