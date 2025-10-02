import  Express  from "express"
import { createBlog, deleteBlog, getAll, getBlog } from "./blogs.controller";
import { authMiddleware } from "../../middlewares/auth";
const router = Express.Router()



router.post('/create' , authMiddleware, createBlog )
router.post('/delete/:id' , authMiddleware, deleteBlog )
router.get('/get/:slug' , getBlog )

router.get('/getAll' ,  getAll )







export const blogRouter = router;