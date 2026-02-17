import Router from "express"
import { UserLogin, UserLogout, UserRegister } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";
import { VerifyJWT } from "../middleware/auth.middleware.js";

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

router.route("/login").post(UserLogin)
router.route("/logout").post(VerifyJWT,UserLogout)

export default router