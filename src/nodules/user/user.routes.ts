import  Express  from "express"
import { login, logout } from "./user.controller";
const router = Express.Router()

//login 
router.post('/login' , login )


router.post('/logout' , logout )






export const userRouter = router;