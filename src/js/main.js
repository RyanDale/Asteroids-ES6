'use strict';
require.config({
    paths: {
        _: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.0/lodash.min'
    }
});

require([
    'game'
], function(Game){
    let gameInstance = new Game();
    gameInstance.initialize();
});