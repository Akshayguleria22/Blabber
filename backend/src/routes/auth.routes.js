import express from 'express'
import passport from '../lib/passport.js'
import {
    signUpController,
    logInController,
    logOutController,
    updateprofile,
    checkAuth,
    oauthSuccessController
} from '../controllers/auth.controllers.js'
import { authorize } from '../middlewares/auth.middlewares.js'


const authRouter = express.Router()
authRouter.post('/signup', signUpController)
authRouter.post('/login', logInController)
authRouter.post('/logout', logOutController)

authRouter.put('/update-profile', authorize, updateprofile)
authRouter.get('/check', authorize, checkAuth)

// OAuth (no session)
authRouter.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
)

authRouter.get('/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=google`, session: false }),
    oauthSuccessController
)

authRouter.get('/github',
    passport.authenticate('github', { scope: ['user:email'], session: false })
)

authRouter.get('/github/callback',
    passport.authenticate('github', { failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=github`, session: false }),
    oauthSuccessController
)

export default authRouter
