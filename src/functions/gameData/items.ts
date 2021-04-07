/**
 * Returns data for items
 */
import * as data from '../../static/gameData.json';

export var itemByID = {};
export var items = data.items;

for (let x in data.items) {
    const item = data.items[x];
    itemByID[item.id] = item;
};

export default itemByID;