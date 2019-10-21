const express = require('express');

const {
    getAllUsers,
    getAllEntries,
    updateUserById,
    updateEntryById
} = require('../controllers/adminController');

const findUserById  = require('../middlewares/user/findUserById');
const sendUserEmail = require('../middlewares/nodemailer/sendUserEmail');

const { URL: { API }, SOURCE_ID } = require('../constants');


const router = express.Router();

router.get(API.ALL_USER,
    getAllUsers
);
router.put(API.USER_ID,
    findUserById(SOURCE_ID.PARAMS),
    updateUserById,
);

router.get(API.ALL_ENTRIES,
    getAllEntries
);
router.put(API.ENTRY_ID,
    updateEntryById,
    sendUserEmail
);

module.exports = router;
