const run = () => {
  const receiptContainer = document.querySelector('.receipt-container');
  // Wrong page
  if (!receiptContainer) {
    return;
  }
  // Guess receipt date
  const date = new Date(
    new Date().setDate(
      document.querySelector('.receipt-data-value').innerText.split(' ')[0],
    ),
  )
    .toLocaleString('fr-FR')
    .split(' ')[0];
  // For dev purpose
  const oldButton = document.querySelector('#payfit-button');
  if (oldButton) {
    oldButton.parentNode.removeChild(oldButton);
  }
  const header = document.querySelector('.page-header');
  addStyle(header, {
    display: 'flex',
    justifyContent: 'space-between',
  });
  // Generate button
  const button = document.createElement('div');
  button.id = 'payfit-button';
  button.onclick = () => browser.runtime.sendMessage({ action: 'screenshot', payload: { date } });
  const image = document.createElement('img');
  image.src = 'https://assets.payfit.com/hr-apps/user/master/static/media/payfit-icon-blue.9b6b3b10.svg';
  addStyle(image, {
    width: '30px',
  });
  button.appendChild(image);
  addStyle(button, {
    display: 'flex',
    cursor: 'pointer',
  });
  header.appendChild(button);
};

try {
  run();
} catch (e) {
  console.error(e);
}

function addStyle(element, style) {
  return Object.assign(element.style, style);
}
