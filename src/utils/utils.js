export function processServerRequest(res) {
  if (res.ok) {
    return res.json().catch(() => {
      return Promise.reject(`Error: Received non-JSON response`);
    });
  }

  return res.text().then((text) => {
    if (text) {
      return Promise.reject(`Error: ${res.status} - ${text}`);
    } else {
      return Promise.reject(`Error: ${res.status} - No content returned`);
    }
  });
}
