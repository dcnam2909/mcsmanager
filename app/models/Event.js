const mongoose = require('mongoose');
const User = require('./User');

const EventSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			unique: true,
			lowercase: true,
			default: function () {
				const chars = [...'qwertyuiopasdfghjklzxcvbnm0123456789'];
				return [...Array(6)].map((i) => chars[(Math.random() * chars.length) | 0]).join(``);
			},
		},
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
		listVisitersCheckin: [
			{
				visiter: { type: mongoose.Schema.Types.ObjectId, ref: User, unique: true },
				imei: String,
				timeCheckin: Date,
				isCheckin: {
					required: true,
					type: Boolean,
					default: false,
				},
			},
		],
	},
	{
		timestamps: true,
	},
);

EventSchema.pre(/^find/, async function (next) {
	this.select('-__v -user -updatedAt -createdAt');
	next();
});

EventSchema.pre('findOneAndUpdate', async function (next) {
	let event = this;
	if ((event._update.typeEvent || event.isNew) && event._update.typeEvent !== 'restricted') {
		this.update({ openReg: null, endReg: null });
	}
	next();
});

EventSchema.methods.checkOwner = function (idMananger) {
	return this.owner.includes(idMananger);
};

module.exports = mongoose.model('Event', EventSchema);
