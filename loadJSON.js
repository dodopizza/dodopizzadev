(() => {
    const jsons = document.querySelectorAll('script[jsonObject],script[jsonCallback]');
    for (const i in jsons) {
        if (!jsons[i] || !jsons[i].getAttribute) continue;
        const j = jsons[i];
        const jsonPath = j.getAttribute('src');
        const objName = j.getAttribute('jsonObject');
        const callbackName = j.getAttribute('jsonCallback');
        const callback = window[callbackName] || null;

        fetch(jsonPath)
            .then(response => response.json())
            .then(json => {
                if (typeof callback === 'function')
                    callback(json);
                if (objName)
                    window[objName] = json;
            })
            // eslint-disable-next-line no-console
            .catch(console.error);
    }
})()