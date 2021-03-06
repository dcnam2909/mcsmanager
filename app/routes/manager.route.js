const express = require('express');
const checkOwner = require('../middlewares/checkOwner');
const checkRoles = require('../middlewares/checkRoles');
const verifyToken = require('../middlewares/verifyToken');
const managerRoute = express.Router();
const eventController = require('../controllers/event.controller');
const multer = require('multer');
const upload = multer();
managerRoute.use(verifyToken);

managerRoute.put(
	'/event/:idEvent/setAgent/:idUser',
	checkRoles('Manager'),
	checkOwner,
	eventController.setAgent,
);

managerRoute.put(
	'/event/:idEvent/removeAgent/:idUser',
	checkRoles('Manager'),
	checkOwner,
	eventController.removeAgent,
);

managerRoute.patch(
	'/event/:idEvent/addVisiters',
	checkRoles('Manager'),
	checkOwner,
	eventController.addVisiters,
);

managerRoute.patch(
	'/event/:idEvent/addByGroup/:idGroup',
	checkRoles('Manager'),
	checkOwner,
	eventController.addByGroup,
);

managerRoute.post(
	'/event/:idEvent/addByFile',
	checkRoles('Manager'),
	checkOwner,
	upload.single('file'),
	eventController.addByFile,
);

managerRoute.patch('/event/:idEvent', checkRoles('Manager'), checkOwner, eventController.update);

managerRoute.delete(
	'/event/:idEvent',
	checkRoles('Manager'),
	checkOwner,
	eventController.deleteEvent,
);

managerRoute.get('/event', checkRoles('Manager', 'Agent'), eventController.getOwnerEvent);

managerRoute.post('/event', checkRoles('Manager'), eventController.create);

module.exports = managerRoute;
