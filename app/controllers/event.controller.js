const eventService = require('../services/event.service');
const userService = require('../services/user.service');

const AppError = require('../config/AppError');
const { genQRCode } = require('../config/genQRCode');
exports.getAll = async (req, res, next) => {
	try {
		const event = await eventService.getAll();
		res.status(200).json({
			status: 'success',
			result: event.length,
			event,
		});
	} catch (error) {
		next(error);
	}
};

exports.getOne = async (req, res, next) => {
	try {
		let id = req.params.code;
		const event = await eventService.getOne(id);
		res.status(200).json({
			status: 'success',
			event,
		});
	} catch (error) {
		next(error);
	}
};
exports.create = async (req, res, next) => {
	try {
		const newEvent = {
			name: req.body.name,
			location: req.body.location,
			typeEvent: req.body.typeEvent,
			dateEvent: req.body.dateEvent,
			owner: req.body.user._id,
		};
		console.log(newEvent);
		const event = await eventService.createNew(newEvent);
		res.status(200).json({
			status: 'success',
			event,
		});
	} catch (error) {
		next(error);
	}
};
exports.update = async (req, res, next) => {
	try {
		const eventId = req.params.id;
		const dataEvent = {
			name: req.body.name,
			description: req.body.description,
			location: req.body.location,
			typeEvent: req.body.typeEvent,
		};
		const event = await eventService.update(eventId, dataEvent);
		res.status(200).json({
			status: 'success',
			event,
		});
	} catch (error) {
		next(error);
	}
};

exports.setAgent = async (req, res, next) => {
	try {
		const idUser = req.params.idUser;
		const idEvent = req.params.idEvent;
		const user = await userService.updateInfo(idUser, { role: 'agent' });
		const event = await eventService.addOwner(idUser, idEvent);
		res.status(200).json({
			status: 'success',
			event,
		});
	} catch (error) {
		next(error);
	}
};

exports.generateCode = async (req, res, next) => {
	try {
		const expireQuery = req.query.expire * 1;
		const expire = Date.now() + expireQuery * 1000 * 60 || Date.now() + 10 * 1000 * 60;
		const idEvent = req.params.idEvent;
		const key = await eventService.generateKey(idEvent, expire);

		res.status(200).json({
			status: 'success',
			key,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

exports.generateQRCode = async (req, res, next) => {
	try {
		const expire =
			new Date().getTime() + parseInt(req.query.epxire) * 1000 * 60 ||
			new Date().getTime() + 10 * 1000 * 60;
		const idEvent = req.params.idEvent;
		const key = await eventService.generateKey(idEvent, expire);
		const nameQR = idEvent + expire;
		//gen QR Code
		await genQRCode(key, nameQR);
		const pathQR = `images/${nameQR}.png`;
		res.status(200).json({
			status: 'success',
			path: pathQR,
		});
	} catch (error) {
		next(error);
	}
};

exports.decodeCode = async (req, res, next) => {
	try {
		const code = req.body.code;
		const event = await eventService.decode(code);
		if (!event) throw new AppError('Your key is expired, please try again!', 400);
		res.status(200).json({
			status: 'success',
			event,
		});
	} catch (error) {
		next(error);
	}
};

exports.regsiterEvent = async (req, res, next) => {
	try {
		const idEvent = req.params.idEvent;
		const idUser = req.body.user._id;
		const event = await eventService.registerToEvent(idEvent, idUser);
		if (!event) throw new AppError('Can not register to this event', 400);
		res.status(200).json({
			status: 'success',
			event,
		});
	} catch (error) {
		next(error);
	}
};