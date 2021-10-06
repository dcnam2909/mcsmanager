const mongoose = require('mongoose');
const User = require('./User');

const EventSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Event name can not be empty'],
		},
		location: {
			type: String,
			require: [true, 'Event location can not be empty'],
		},
		typeEvent: {
			type: String,
			require: [true, 'Event type must be: private, restricted or public'],
			enum: ['private', 'restricted', 'public'],
		},
		owner: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: User,
		},
		dateEvent: {
			type: Date,
			required: [true, 'Date begin can not be empty'],
		},
		openReg: Date,
		endReg: Date,
		listVisiters: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: User,
		},
	},
	{
		timestamps: true,
	},
);

EventSchema.pre(/^find/, async function (next) {
	this.select('-__v -key -user -updatedAt -createdAt');
	next();
});

EventSchema.methods.checkOwner = function (idMananger) {
	return this.owner.includes(idMananger);
};

module.exports = mongoose.model('Event', EventSchema);
