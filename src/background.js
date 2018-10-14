async function onMessage({ action, payload }) {
  switch (action) {
    case 'screenshot': {
      const screenshotUrl = await browser.tabs.captureVisibleTab();
      const tab = await browser.tabs.create({
        url: `https://app.payfit.com/expenses/new?date=${payload.date}`,
      });
      await sendMessage(tab.id, { url: screenshotUrl });
      break;
    }
    default:
  }
}

try {
  browser.runtime.onMessage.addListener(onMessage);
} catch (e) {
  console.error(e);
}

async function sendMessage(tab, message) {
  try {
    await browser.tabs.sendMessage(tab, message);
    return message;
  } catch (e) {
    await wait(500);
    return sendMessage(tab, message);
  }
}

function wait(timeout) {
  return new Promise(resolve => setTimeout(() => resolve(), timeout));
}
