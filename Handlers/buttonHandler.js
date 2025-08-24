async function loadButtons(client) {
    const { loadFiles } = require("../Functions/fileLoader");

    if (!client.buttons) client.buttons = new Map();
    else client.buttons.clear();

    const files = await loadFiles("Buttons");

    files.forEach((file) => {
        const button = require(file);

        if (!button || !button.data || !button.data.name) {
            console.warn(`[WARNING] El archivo "${file}" no tiene la propiedad "data.name".`);
            return;
        }

        client.buttons.set(button.data.name, button);
    });

    console.log('✅ Buttons Loaded');
}

// 👇 ESTA PARTE ES CLAVE
module.exports = { loadButtons };
