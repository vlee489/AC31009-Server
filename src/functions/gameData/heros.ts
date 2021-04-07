/**
 * Returns data for heros
 */
import * as data from '../../static/gameData.json';

export var heroByID = {};
export var heros = data.heros;

for (let x in data.heros) {
    const hero = data.heros[x];
    heroByID[hero.id] = hero;
};

export default heroByID;