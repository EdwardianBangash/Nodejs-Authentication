module.exports = {
    authMiddleware : (req, res, next) => {
        if (req.isAuthenticated()) 
        { 
            return next() 
        }
        res.redirect("/login")
    },
    checkAuth: (req, res, next) => {
        if (req.isAuthenticated()) { 
            return res.redirect("/dashboard")
        }
       next()
    }
}