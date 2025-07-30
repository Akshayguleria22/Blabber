import express from 'express'
import { authorize } from '../middlewares/auth.middlewares.js'
import { getMessages, getUserSidebar, sendMessage } from '../controllers/message.controllers.js'

const messageRouter = express.Router()

messageRouter.get('/users', authorize, getUserSidebar)
messageRouter.get('/:id',authorize,getMessages)

messageRouter.post('/send/:id', authorize, sendMessage)


export default messageRouter
