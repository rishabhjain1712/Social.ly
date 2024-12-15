import express from "express";
import { followUser, getAllOtherUsers, getUserById, loginUser, logoutUser, myNotifications, myProfile, registerUser, resendLoginOtp, resendOtp, searchUsers, unfollowUser, updatePassword, updateUser, verifyLoginOtp, verifyUser } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/verify/:id", verifyUser);

userRouter.get("/resend/:id", resendOtp);

userRouter.post("/login", loginUser);

userRouter.post("/login/verify/:id", verifyLoginOtp);

userRouter.get("/login/resend/:id", resendLoginOtp);

userRouter.get("/logout", isAuthenticated, logoutUser);

userRouter.get("/me", isAuthenticated, myProfile);

userRouter.get("/others", isAuthenticated, getAllOtherUsers);

userRouter.patch("/update/profile", isAuthenticated, updateUser);

userRouter.patch("/update/password", isAuthenticated, updatePassword);

userRouter.get("/search", isAuthenticated, searchUsers);



userRouter.get("/:id", isAuthenticated, getUserById);

userRouter.get("/follow/:id", isAuthenticated, followUser);

userRouter.get("/unfollow/:id", isAuthenticated, unfollowUser);

userRouter.get("/notifications/my", isAuthenticated, myNotifications);


export default userRouter