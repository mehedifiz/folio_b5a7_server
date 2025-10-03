import  Express  from "express"
import { createBlog, deleteBlog, getAll, getBlog, updateBlog } from "./blogs.controller";
import { authMiddleware } from "../../middlewares/auth";
const router = Express.Router()



router.post('/create' , authMiddleware, createBlog )
router.post('/delete/:id' , authMiddleware, deleteBlog )
router.put('/update/:id' , authMiddleware, updateBlog )
router.get('/get/:slug' , getBlog )

router.get('/getAll' ,  getAll )







export const blogRouter = router;