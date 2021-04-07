import{default as data} from '../static/gameData.json';

export const gameData = async  (req, res) => {
    res.send(data)
    return
};

export default gameData;