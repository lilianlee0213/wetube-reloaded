import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
	text: {type: String, required: true},
	creator: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
	creatorAvatarUrl: String,
	creatorUsername: {type: String, required: true},
	creatorLastName: {type: String, required: true},
	video: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Video'},
	createdAt: {type: Date, require: true, default: Date.now},
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
