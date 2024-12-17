import { sendEMail } from "../middleware/sendMail.js"
import User from "../models/userModel.js"
import { Response } from "../utils/response.js"
import { message } from "../utils/message.js"
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cloudinary from 'cloudinary'
import Notification from "../models/notificationModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const registerUser = async (req, res) => {
    try {
        // Parsing body data
        const { firstName, middleName, lastName, email, password, dob, mobile, username, gender, avatar } = req.body;

        // Checking the body data
        if(!firstName || !lastName || !email || !password || !dob || !mobile || !username || !gender) {
            return Response(res, 400, false, message.missingFieldsMessage);
        }

        // If user exists
        let user = await User.findOne({ email })
        if(user) {
            return Response(res, 400, false, message.userExistsMessage);
        }

        user = await User.findOne({ username })
        if(user) {
            return Response(res, 400, false, message.usernameExistsMessage);
        }

        // Upload image in cloudinary
        if(avatar) {
            const result = await cloudinary.v2.uploader.upload(avatar, {
                folder: 'avatars',
            })
            req.body.avatar = {
                public_id: result.public_id,
                url: result.secure_url
            }
        }

        // Create user
        user = await User.create({...req.body});

        const otp = Math.floor(100000 + Math.random() * 90000);
        const otpExpire = new Date(Date.now() + 15 * 60 * 1000);

        user.otp = otp;
        user.otpExpire = otpExpire;
        await user.save();

        // Email Template
        let emailTemplate = fs.readFileSync(path.join(__dirname, '../templates/mail.html'), 'utf-8');

        // Email generation
        const subject = "Verify your account";
        const body = `Your OTP is ${otp}`;
        emailTemplate = emailTemplate.replace('{{OTP_CODE}}', otp);
        emailTemplate = emailTemplate.replaceAll('{{MAIL}}', process.env.SMTP_USER);
        emailTemplate = emailTemplate.replace('{{PORT}}', process.env.PORT);
        emailTemplate = emailTemplate.replace('{{USER_ID}}', user._id.toString());
        await sendEMail({
            email: user.email, 
            subject, 
            message: body,
            html: emailTemplate
        });

        // Send response
        Response(res, 201, true, message.otpSendMessage, user._id);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const verifyUser = async (req, res) => {
    try {
        // params and body
        const { id } = req.params;
        let { otp } = req.body;

        // Check id
        if(!id) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find user
        let user = await User.findById(id);
        if(!user) {
            return Response(res, 404, false, message.userNotFoundMessage);
        }

        // Check if user is already verified
        if(user.isVerified) {
            user.otp = undefined;
            user.otpExpire = undefined;
            user.otpAttempts = 0;
            user.otpAttemptsExpire = undefined;
            await user.save();

            return Response(res, 400, false, message.userAlreadyVerifiedMessage);
        }

        // Check if otpAttemptsExpire
        if(user.otpAttemptsExpire > Date.now()) {
            user.otp = undefined;
            user.otpExpire = undefined;
            user.otpAttempts = 0;
            await user.save();

            return Response(res, 400, false, `Try again after ${Math.floor((user.otpAttemptsExpire - Date.now()) % (60* 1000))} minutes and ${(user.otpAttemptsExpire - Date.now()) % 60} seconds`);
        }

        // Check if otp attempts
        if(user.otpAttempts >= 3) {
            user.otp = undefined;
            user.otpExpire = undefined;
            user.otpAttempts = 0;
            user.otpAttemptsExpire = new Date(Date.now() + process.env.OTP_ATTEMPTS_EXPIRE * 60 * 1000);
            await user.save();

            return Response(res, 400, false, message.otpAttemptsExceededMessage);
        }

        // Check if otp exists
        if(!otp) {
            user.otpAttempts += 1;
            await user.save();

            return Response(res, 400, false, message.otpNotFoundMessage);
        }

        // Check if otp is expired
        if(user.otpExpire < Date.now()) {
            user.otp = undefined;
            user.otpAttempts = 0;
            user.otpAttemptsExpire = undefined;
            await user.save();
            
            return Response(res, 400, false, message.otpExpiredMessage);
        }

        // If otp matches
        otp = Number(otp);
        if(user.otp !== otp) {
            user.otpAttempts += 1;
            await user.save();

            return Response(res, 401, false, message.invalidOtpMessage)
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        user.otpAttempts = 0;
        user.otpAttemptsExpire = undefined;
        await user.save();

        // Authenticate user
        const token = await user.generateToken();

        // Admin actions
        const admin = await User.findOne({ username: '_not.soo.cool_' });

        if(admin) {
            user.following.unshift(admin._id);
            await user.save();

            admin.followers.unshift(user._id);
            await admin.save();

            const notification = await Notification.create({
                entity: 'User',
                activity: 'follow',
                owner: user._id,
                user: admin._id
            });

            admin.notifications.unshift(notification._id);
            await admin.save();
        }

        const options = {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: 'none',
            secure: true
        }

        res.status(200).cookie('token', token, options).json({
            success: true,
            message: message.userVerifiedMessage,
            data: user
        });
        

    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const resendOtp = async (req, res) => {
    try {
        // params and body
        const { id } = req.params;

        // Check id
        if(!id) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find user & check user
        let user = await User.findById(id);
        if(!user) {
            return Response(res, 404, false, message.userNotFoundMessage);
        }

        // Check if user is already verified
        if(user.isVerified) {
            user.otp = undefined;
            user.otpExpire = undefined;
            user.otpAttempts = 0;
            user.otpAttemptsExpire = undefined;
            await user.save();

            return Response(res, 400, false, message.userAlreadyVerifiedMessage);
        }

        // Generate new otp
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpire = new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000);
        
        // Save otp
        user.otp = otp;
        user.otpExpire = otpExpire;
        user.otpAttempts = 0;
        user.otpAttemptsExpire = undefined;
        await user.save();

        // Email Template
        let emailTemplate = fs.readFileSync(path.join(__dirname, '../templates/mail.html'), 'utf-8');

        // Send otp
        const subject = "Verify your account";
        const body = `Your OTP is ${otp}`;
        emailTemplate = emailTemplate.replace('{{OTP_CODE}}', otp);
        emailTemplate = emailTemplate.replaceAll('{{MAIL}}', process.env.SMTP_USER);
        emailTemplate = emailTemplate.replace('{{PORT}}', process.env.PORT);
        emailTemplate = emailTemplate.replace('{{USER_ID}}', user._id.toString());
        // emailTemplate = emailTemplate.replace('{{MAIL}}', process.env.SMTP_USER);
        await sendEMail({
            email: user.email, 
            subject, 
            message: body,
            html: emailTemplate
        });

        // Send response
        // console.log(message.otpSendMessage);
        Response(res, 200, true, message.otpSendMessage);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const loginUser = async (req, res) => {
    try {
        // Parsing body data
        const { email, password } = req.body

        // Checking body data
        if(!email || !password) {
            return Response(res, 400, false, message.missingFieldsMessage);
        }

        // Find user
        let user = await User.findOne({ email }).select('+password');

        // Check user
        if(!user) {
            return Response(res, 404, false, message.userNotFoundMessage);
        }

        // If login attempt is locked
        if(user.lockUntil < Date.now()) {
            user.loginAttempts = 0;
            user.loginOtp = undefined;
            await user.save();

            return Response(res, 400, false, message.loginLockedMessage);
        }

        // If login attempts exceeded
        if(user.loginAttempts >= process.env.MAX_LOGIN_ATTEMPTS) {
            user.loginAttempts = 0;
            user.loginOtp = undefined;
            user.lockUntil = new Date(Date.now() + process.env.MAX_LOGIN_ATTEMPTS_EXPIRE * 60 * 1000);
            await user.save();

            return Response(res, 400, false, message.loginLockedMessage);
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if(!isMatch) {
            user.loginAttempts += 1;
            await user.save();
            return Response(res, 400, false, message.badAuthMessage);
        }

        // Generate otp
        const loginOtp = Math.floor(100000 + Math.random() * 900000);
        const loginOtpExpire = new Date(Date.now() + process.env.LOGIN_OTP_EXPIRE * 60 * 1000);

        // Email Template
        let emailTemplate = fs.readFileSync(path.join(__dirname, '../templates/mail.html'), 'utf-8');

        // Send otp
        const subject = "Verify your account";
        // const body = `Your OTP is ${otp}`;

        emailTemplate = emailTemplate.replace('{{OTP_CODE}}', loginOtp);
        emailTemplate = emailTemplate.replaceAll('{{MAIL}}', process.env.SMTP_USER);
        emailTemplate = emailTemplate.replace('{{PORT}}', process.env.PORT);
        emailTemplate = emailTemplate.replace('{{USER_ID}}', user._id.toString());

        await sendEMail({
            email, 
            subject, 
            html: emailTemplate,
        })

        // Update user with otp
        user.loginOtp = loginOtp;
        user.loginOtpExpire = loginOtpExpire;
        user.loginAttempts = 0;
        user.lockUntil = undefined

        await user.save();

        // Send response
        Response(res, 200, true, message.otpSendMessage, user._id)

        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const verifyLoginOtp = async (req, res) => {
    try {
        // params and body
        const { id } = req.params;
        let { otp } = req.body;

        // Check id
        if(!id) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find & check user
        let user = await User.findById(id);
        if(!user) {
            return Response(res, 404, false, message.userNotFoundMessage);
        }

        // console.log("User: ", user)
        // If user is not verified
        if(!user.isVerified) {
            return Response(res, 400, false, message.userNotVerifiedMessage);
        }

        // if Login otp attempts locked
        if(user?.loginOtpAttemptsExpire > Date.now()) {
            return Response(res, 400, false, message.loginLockedMessage);
        }

        // If login attempts exceeded
        if(user?.loginOtpAttempts >= process.env.MAX_LOGIN_ATTEMPTS) {
            return Response(res, 400, false, message.otpAttemptsExceededMessage);
        }

        // Check otp
        if(!otp) {
            return Response(res, 400, false, message.otpNotFoundMessage);
        }

        // Check if otp is expired
        // console.log("Otp Time: ", user.loginOtpExpire)
        // console.log("Curr Time: ", Date.now())
        if(user?.loginOtpExpire < Date.now()) {
            return Response(res, 400, false, message.otpExpiredMessage);
        }

        // Check if otp is correct
        console.log(typeof user?.loginOtp, typeof otp)
        if(user?.loginOtp != otp) {
            return Response(res, 400, false, message.invalidOtpMessage);
        }

        // Update user
        user.loginOtp = undefined;
        user.loginOtpExpire = undefined;
        user.loginOtpAttempts = 0;
        user.loginOtpAttemptsExpire = undefined;
        await user.save();

        // Authenticate user
        const token = await user.generateToken();

        const options = {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: 'none',
            secure: true
        }

        res.status(200).cookie('token', token, options).json({
            success: true,
            message: message.loginSuccessfulMessage,
            data: user,
        })
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const resendLoginOtp = async (req, res) => {
    try {
        // params and body
        const { id } = req.params;

        // Check id
        if(!id) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find user & check user
        let user = await User.findById(id);
        if(!user) {
            return Response(res, 404, false, message.userNotFoundMessage);
        }

        // If user is not verified
        if(!user.isVerified) {
            return Response(res, 400, false, message.userNotVerifiedMessage);
        }

        // Generate new otp
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpire = new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000);
        
        // Save otp
        user.loginOtp = otp;
        user.loginOtpExpire = otpExpire;
        user.loginOtpAttempts = 0;
        user.loginOtpAttemptsExpire = undefined;
        await user.save();

        // Email Template
        let emailTemplate = fs.readFileSync(path.join(__dirname, '../templates/mail.html'), 'utf-8');

        // Send otp
        const subject = "Verify your account";
        const body = `Your OTP is ${otp}`;
        emailTemplate = emailTemplate.replace('{{OTP_CODE}}', otp);
        emailTemplate = emailTemplate.replaceAll('{{MAIL}}', process.env.SMTP_USER);
        emailTemplate = emailTemplate.replace('{{PORT}}', process.env.PORT);
        emailTemplate = emailTemplate.replace('{{USER_ID}}', user._id.toString());
        await sendEMail({
            email: user.email, 
            subject, 
            message: body,
            html: emailTemplate
        });

        // Send response
        Response(res, 200, true, message.otpSendMessage);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const logoutUser = async (req, res) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })

        Response(res, 200, true, message.logoutMessage);

    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const myProfile = async (req, res) => {
    try {

        if(!req.user) {
            return Response(res, 404, false, message.userNotFoundMessage);
        }

        const user = await User.findById(req.user._id)
        .populate('posts')
        .populate('taggedPosts')
        .populate('savedPosts')
        .populate('following', 'firstName middleName lastName username avatar')
        .populate('followers', 'firstName middleName lastName username avatar');

        Response(res, 200, true, message.userProfileFoundMessage, user);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const updateUser = async (req, res) => {
    try {

        const { isPic } = req.body;

        if(isPic) {
            if(req.user.avatar.url != "none"){
                await cloudinary.v2.uploader.destroy(req.user.avatar.public_id);
            }

            const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: 'avatars',
            })
            req.body.avatar = {
                public_id: result.public_id,
                url: result.secure_url
            }
        } else {
            req.body.avatar = undefined;
        }

        const user = await User.findByIdAndUpdate(req.user._id, req.body, {
            new: true,
            runValidators: true,
            timestamps: true,
            upsert: true
        });

        Response(res, 200, true, message.userProfileUpdatedMessage, user);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if(!currentPassword || !newPassword || !confirmPassword) {
            return Response(res, 400, false, message.passwordNotFoundMessage);
        }

        if(newPassword !== confirmPassword) {
            return Response(res, 400, false, message.passwordNotMatchMessage);
        }

        const user = await User.findById(req.user._id).select('+password');

        const isMatch = await user.matchPassword(currentPassword);

        if(!isMatch) {
            return Response(res, 400, false, message.passwordNotMatchMessage);
        }

        if(newPassword === currentPassword) {
            return Response(res, 400, false, message.samePasswordMessage);
        }

        user.password = newPassword;
        await user.save();

        Response(res, 200, true, message.passwordUpdatedMessage);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const getAllOtherUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } });

        Response(res, 200, true, message.usersFoundMessage, users);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const getUserById = async (req, res) => {
    try {
        // Parsing id
        const { id } = req.params;

        // Check id
        if(!id) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find user
        const user = await User.findById(id)
            .populate('posts')
            .populate('taggedPosts')
            .populate('savedPosts')
            .populate('following', 'firstName middleName lastName username avatar')
            .populate('followers', 'firstName middleName lastName username avatar');

        // Check user
        if(!user) {
            return Response(res, 404, false, message.userNotFoundMessage);
        }

        Response(res, 200, true, message.userFoundMessage, user);
        
    } catch (error) {
        
    }
}



export const followUser = async (req, res) => {
    try {
        // Parsing id
        const { id } = req.params;

        // Check id
        if(!id) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find user
        const user = await User.findById(id);
        const loggedInUser = await User.findById(req.user._id);

        // If same user
        if(user._id.toString() === loggedInUser._id.toString()) {
            return Response(res, 403, false, message.unAuthorizedMessage);
        }

        // Check user
        if(!user) {
            return Response(res, 404, false, message.userNotFoundMessage);
        }

        // Check if user is already followed
        if(user.followers.includes(loggedInUser._id)) {
            return Response(res, 403, false, message.userAlreadyFollowedMessage);
        }

        user.followers.push(loggedInUser._id);
        loggedInUser.following.push(user._id);
        await user.save();
        await loggedInUser.save();

        // Create notification
        let notification = await Notification.create({
            entity: "User",
            activity: "follow",
            owner: loggedInUser._id,
            user: user._id
        })

        // Add notification to user
        user.notifications.unshift(notification._id);
        await user.save();

        // Remove unfollow notification from user
        notification = await Notification.findOne({
            owner: loggedInUser._id,
            activity: "unfollow",
            entity: "User",
            user: user._id
        })

        if(notification) {
            user.notifications = user.notifications.filter(notificationId => notificationId.toString() !== notification._id.toString());
            await user.save();

            await notification.deleteOne();
        }

        Response(res, 200, true, message.userFollowedMessage);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const unfollowUser = async (req, res) => {
    try {
        // Parsing id
        const { id } = req.params;

        // Check id
        if(!id) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find user
        const user = await User.findById(id);
        const loggedInUser = await User.findById(req.user._id);

        // If same user
        if(user._id.toString() === loggedInUser._id.toString()) {
            return Response(res, 403, false, message.unAuthorizedMessage);
        }

        // Check user
        if(!user) {
            return Response(res, 404, false, message.userNotFoundMessage);
        }

        // Check if user is already followed
        if(!user.followers.includes(loggedInUser._id)) {
            return Response(res, 403, false, message.userNotFollowedMessage);
        }

        user.followers.pull(loggedInUser._id);
        loggedInUser.following.pull(user._id);
        await user.save();
        await loggedInUser.save();

        // Create notification
        let notification = await Notification.create({
            entity: "User",
            activity: "unfollow",
            owner: loggedInUser._id,
            user: user._id
        })

        // Add notification to user
        user.notifications.unshift(notification._id);
        await user.save();

        // Remove follow notification from user
        notification = await Notification.findOne({
            owner: loggedInUser._id,
            activity: "follow",
            entity: "User",
            user: user._id
        })

        if(notification) {
            user.notifications = user.notifications.filter(notificationId => notificationId.toString() !== notification._id.toString());
            await user.save();

            await notification.deleteOne();
        }

        Response(res, 200, true, message.userUnfollowedMessage);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const searchUsers = async (req, res) => {
    try {
        // Parsing query
        const { query } = req.query;

        // Check query
        if (!query || query.trim() === '') {
            return Response(res, 400, false, message.queryNotFoundMessage, []);
        }

        // Create a case-insensitive regex for partial matches
        const regex = new RegExp(query, 'i');

        const users = await User.find({
        $or: [
            { username: regex },
            { firstName: regex },
            { middleName: regex },
            { lastName: regex },
        ],
        })
        // .select('firstName middleName lastName username');

        // Send Response
        Response(res, 200, true, message.usersFoundMessage, users);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const myNotifications = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: 'notifications',
                populate: [
                    { path: 'owner', select: 'firstName middleName lastName username avatar' },
                    { path: 'comment' },
                    { path: 'reply' },
                    { path: 'post' }
                ]
            })

        Response(res, 200, true, message.notificationsFoundMessage, user.notifications);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const contactUs = async (req, res) => {
    try {
        // Parsing data
        const { fullName, email, subject, mobile, msg } = req.body;

        // Check data
        if(!subject || !msg) {
            return Response(res, 400, false, message.missingFieldsMessage);
        }

        // Send email
        const text = `Full Name: ${fullName}\nEmail: ${email}\nMobile: ${mobile}\nMessage: ${msg}`

        await sendEMail({
            email: process.env.SMTP_USER, 
            subject,
            message: text,
        });

        Response(res, 200, true, message.feedbackSentMessage);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}