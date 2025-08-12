import express from 'express'
import { signUpController, logInController, logOutController, updateprofile, checkAuth } from '../controllers/auth.controllers.js'
import { authorize } from '../middlewares/auth.middlewares.js'


const authRouter = express.Router()
authRouter.post('/signup', signUpController)
authRouter.post('/login', logInController)
authRouter.post('/logout', logOutController)

authRouter.put('/update-profile', authorize, updateprofile)

authRouter.get('/check',authorize,checkAuth)
export default authRouter
