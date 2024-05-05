import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js';

const authUser = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        generateToken(res, user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email : user.email,
            phone : user.phone,
            isAdmin: user.isAdmin
        })
    }else{
        res.status(401);
        throw new Error('Invlid email or password')
    }
}

const registerUser = async (req, res) => {
    const {name, email, password, phone} = req.body;
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({
        name,
        email,
        password,
        phone,
    });
    if(user){
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin,
        });
    }else{
        res.status(404);
        throw new Error('invaild User data')
    }
}

const logoutUser = async(req,res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({message: "Logout seccessfully"})
}

const getUserProfile = async (req, res) => {
    const user = await User.findById(res.user._id);
    if(user){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    }else{
        res.status(404);
        throw new Error('User not found');
    }
}

const updateUserProfile = async (req, res) => {
    const user = await User.findById(res.user._id);
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password){
            user.password = req.body.password
        }
        const updateUser = await user.save();
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin
        })
    }else{
        res.status(404);
        throw new Error('User not find');
    }
}

const getUsers = async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
}

const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if(user){
        res.status(200).json(user);
    }else{
        res.status(404);
        throw new Error('User not found')
    }
}

const deleteUser =async(req, res) => {
    const user = await User.findById(req.params.id);
    if(user){
        if(user.isAdmin){
            res.status(400);
            throw new Error('cannot delete this user!!');
        }
        await User.deleteOne({_id: user._id});
        res.status(200).json({message: 'User delete seccessfully'});
    }else{
        res.status(404);
        throw new Error('User not found')
    }
}

const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updateUser = await user.save();
        res.status(200).json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            phone: updateUser.phone,
            isAdmin: updateUser.isAdmin
        });
    }else{
        res.status(404);
        throw new Error('User not found');
    }
}

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    deleteUser,
    updateUser,
}