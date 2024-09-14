export function processServerRequest(res) {
  if (res.ok) {
    return res.json();
  }
  return res
    .text()
    .then((text) => Promise.reject(`Error: ${res.status} - ${text}`));
}
