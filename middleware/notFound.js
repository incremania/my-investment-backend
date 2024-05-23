const appNotFound = (req, res) => res.status(404).json({error:'route not found' })

module.exports = appNotFound