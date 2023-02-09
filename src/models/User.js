import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userschema = new mongoose.Schema({
	firstName: {type: 'String', required: true},
	lastName: {type: 'String', required: true},
	username: {type: 'String', required: true, unique: true},
	email: {type: 'String', required: true, unique: true},
	password: {type: 'String', required: true},
	location: String,
});

userschema.pre('save', async function () {
	this.password = await bcrypt.hash(this.password, 5);
});
const User = mongoose.model('User', userschema);

export default User;
