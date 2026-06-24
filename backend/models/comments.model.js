import mongoose from "mongoose";
import { use } from "react";

const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    body: {
        type: String,
        required: true
    }
});


const Comments = mongoose.model('Comment', CommentSchema);

export default Comments;