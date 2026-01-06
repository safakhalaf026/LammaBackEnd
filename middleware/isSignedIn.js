const jwt = require('jsonwebtoken')

// this is to verify the JSON WEB TOKEN !!!
const isSignedIn = (req, res, next) => {
    try {
        const header = req.headers.authorization

        // cleaner error handling
        if (!header) {
            return res.status(401).json({ err: 'Missing Authorization header' })
        }

        const token = header.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded.payload
        next()
    } catch (err) {
        console.log(err)
        res.status(401).json({ err: 'Invalid Token' })
    }
}

module.exports = isSignedIn
