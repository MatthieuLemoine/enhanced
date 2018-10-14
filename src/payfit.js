const run = async (url) => {
  try {
    const { date } = parseQueries();
    const typeSelect = document.querySelector('.Select-control');
    // Not loaded
    if (!typeSelect) {
      setTimeout(run.bind(this, url), 500);
      return;
    }
    // Type
    triggerMouseEvent(typeSelect, 'mousedown');
    const option = document.querySelector('#react-select-2--option-4');
    if (!option) {
      setTimeout(run.bind(this, url), 500);
      return;
    }
    triggerMouseEvent(option, 'mousedown');
    // Date + name + amount
    const inputs = Array.from(document.querySelectorAll('form input'));
    const spendingDate = date || new Date().toLocaleString('fr-FR').split(' ')[0];
    const values = [spendingDate, `Spotify - ${spendingDate}`, '9.99', '1.67'];
    values.forEach((value, index) => {
      fill(inputs[index], value);
    });
    // TVA
    triggerMouseEvent(
      document.querySelectorAll('.Select-control')[1],
      'mousedown',
    );
    triggerMouseEvent(
      document.querySelector('#react-select-3--option-3'),
      'mousedown',
    );
    // Add file
    const file = await toFile(url);
    const fileInput = document.querySelector('input[type="file"]');
    const dT = new ClipboardEvent('').clipboardData || new DataTransfer();
    dT.items.add(file);
    fileInput.files = dT.files;
    fileInput.dispatchEvent(new Event('change'));
    // Submit form
    const submit = document.querySelector('form > div > button');
    submit.click();
  } catch (e) {
    console.error(e);
  }
};

browser.runtime.onMessage.addListener(message => run(message.url));

function fill(element, value) {
  // eslint-disable-next-line no-param-reassign
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
}

function triggerMouseEvent(node, eventType) {
  const clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
}

function parseQueries() {
  return document.location.search
    .slice(1)
    .split('&')
    .reduce((queries, item) => {
      const [key, value] = item.split('=');
      return {
        ...queries,
        [key]: value,
      };
    }, {});
}

function toFile(url) {
  const mimeType = (url.match(/^data:([^;]+);/) || '')[1];
  return fetch(url)
    .then(res => res.arrayBuffer())
    .then(buf => new File([buf], 'file.png', { type: mimeType }));
}
