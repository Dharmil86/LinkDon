import User from "../models/user.model.js";
import Profile from "../models/profiles.model.js";
import Post from "../models/posts.model.js";
import bcrypt from "bcrypt";
import Comments from "../models/comments.model.js";


export const activeCheck = async (req,res) => {
    return res.status(200).json({message: "API is active"});
}

export const createPost = async (req, res) => {

    const { token }  = req.body;

    try {
        
        const user = await User.findOne({token: token});

        if(!user) return res.status(404).json({message: "User not found"});

        const post = new Post({
            userId: user.id,
            body: req.body.body,
            media: req.file != undefined ? req.file.filename : "",
            fileType: req.file != undefined ? req.file.mimetype.split('/')[1] : "",
        });

        await post.save();


        return res.status(200).json({message: "Post created" });

    } catch (error) {
        return res.status(500).json({message: error.message});
    }

}

export const getAllPosts = async (req, res) => {
    try {
        
        const posts = await Post.find()
            .populate('userId', "name username email profilePicture");
        return res.json({posts});

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}


export const deletePost = async (req, res) => {

    const { post_id, token } = req.body;

    try {
        
        const user = await User.findOne({ token: token }).select('_id');


        if (!user) return res.status(404).json({ message: "user not found" });

        const post = await Post.findOne({ _id: post_id});

        if (!post) return res.status(404).json({ message: "post not found" });

        if (String(post.userId) !== String(user._id)) {
            return res.status(401).json({ message: "unauthorized action" });
        }

        await Post.deleteOne({ _id: post_id });

        return res.json({ message: "Post deleted" });

    } catch (error) {
        return res.status(500).json({message: error.message});
    }

}

export const get_comments_by_post = async (req, res) => {

    const { post_id } = req.query;


    try {
        
        const post = await Post.findOne({ _id: post_id});

        if (!post) return res.status(404).json({ message: "post not found" });

        const comments = await Comments.find({postId: post_id})
        .populate("userId", "username name");

        return res.json(comments.reverse() );

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const delete_comments_of_user = async (userId) => {

    const { token, comment_id } = req.body;

    try {
        
        const user = await User.findOne({ token: token }).select('_id');

        if (!user) return res.status(404).json({ message: "user not found" });

        const comment = await Comment.findOne({ _id: comment_id});

        if (!comment) return res.status(404).json({ message: "comment not found" });

        if (String(comment.userId) !== String(user._id)) {
            return res.status(401).json({ message: "unauthorized action" });
        }

        await Comment.deleteOne({ _id: comment_id });

        return res.json({ message: "Comment deleted" });

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}



export const increment_likes = async (req, res) => {
    const { post_id } = req.body;

    try {
        
        const post = await Post.findOne({ _id: post_id});

        if (!post) return res.status(404).json({ message: "post not found" });

        post.likes += 1;

        await post.save();

        return res.json({ message: "Like added"});

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}