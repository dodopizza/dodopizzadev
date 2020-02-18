(() => {
  const jsons = document.querySelectorAll('script[json]');
  window.awaitJSON = window.awaitJSON || {};
  window.getLoadedJSON = (objectName) => {
    if (objectName in window.awaitJSON)
      return window.awaitJSON[objectName];
    return Promise.resolve(window[objectName])
  };
  for (const i in jsons) {
    if (!jsons[i] || !jsons[i].getAttribute) continue;
    const j = jsons[i];
    const jsonPath = j.getAttribute('json');
    const objName = j.getAttribute('jsonObject');
    const callbackName = j.getAttribute('jsonCallback');
    const callback = window[callbackName] || null;

    if (!objName && !callbackName)
      continue;

    const fetchPromise = fetch(jsonPath)
      .then(response => response.json())
      .then(json => {
        deleteAwaiter()
        if (typeof callback === 'function')
          callback(json);
        if (objName)
          window[objName] = json;
        return json;
      })
      // eslint-disable-next-line no-console
      .catch(console.error);

    window.awaitJSON[objName || callbackName] = fetchPromise
    const deleteAwaiter = () => {
      delete window.awaitJSON[objName || callbackName]
    }
  }
})()