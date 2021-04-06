export const getInfo = async  (req, res) => {
    res.send({
        success: true,
        version: `${process.env.npm_package_version}`
    })
    return
};

export default getInfo;