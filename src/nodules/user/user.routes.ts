import  Express  from "express"
import { login } from "./user.controller";
const router = Express.Router()

//login 
router.post('/login' , login )






export const userRouter = router;