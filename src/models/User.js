import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userschema = new mongoose.Schema({
	email: {type: String, required: true, unique: true},
	username: {type: String, required: true, unique: true},
	password: {type: String},
	avatarUrl: String,
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	socialCreated: {type: Boolean, default: false},
	location: String,
});

userschema.pre('save', async function () {
	this.password = await bcrypt.hash(this.password, 5);
});
const User = mongoose.model('User', userschema);

export default User;
