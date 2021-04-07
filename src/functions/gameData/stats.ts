/**
 * Returns data on stats
 */
import * as data from '../../static/gameData.json';

export var statByID = {};
export var stats = data.stats;

for(let x in data.stats){
    const stat = data.stats[x];
    statByID[stat.id] = stat.name;
}

export default statByID;