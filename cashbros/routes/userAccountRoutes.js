const express = require('express');
const router = express.Router();
const userAccountController = require('../controllers/userAccountController');

// Create account 
router.post('/', userAccountController.createAccount);

// Get accounts by user_id
router.get('/user/:user_id', userAccountController.getAccountByUser);

// Get single account by account_id
router.get('/account/:account_id', userAccountController.getAccountById);

// Update account balance
router.put('/:account_id', userAccountController.updateAccountBalance);

// Delete account
router.delete('/:account_id', userAccountController.deleteAccount);

module.exports = router;
