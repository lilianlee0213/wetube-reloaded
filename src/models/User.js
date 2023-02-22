import bcrypt from 'bcrypt';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';

const userschema = new mongoose.Schema({
	email: {type: String, required: true, unique: true},
	username: {type: String, required: true, unique: true},
	password: {type: String},
	avatarUrl: String,
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	socialOnly: {type: Boolean, default: false},
	location: String,
	videos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Video'}],
});

userschema.pre('save', async function () {
	if (this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 5);
	}
});
const User = mongoose.model('User', userschema);

export default User;
