'use strict';
require.config({
    paths: {
        lodash: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.0/lodash.min'
    }
});

require([
    'game'
], (Game) => {
    const GAME_INSTANCE = new Game();
    GAME_INSTANCE.initialize();
});
