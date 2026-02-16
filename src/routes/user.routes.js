import Router from "express"
import { UserRegister } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";

const router=Router();

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    UserRegister)

export default router