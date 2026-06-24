import mongoose from "mongoose";

const ConnectionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    connectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: Boolean,
        default: null
    }
});

const ConnectionRequest = mongoose.model('ConnectionRequest', ConnectionSchema);
export default ConnectionRequest;