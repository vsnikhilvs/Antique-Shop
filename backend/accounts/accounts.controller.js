const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const accountService = require('./account.service');

// routes
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/refresh-token', refreshToken);
router.post('/revoke-token', revokeToken);
router.post('/register', registerSchema, register);
router.post('/forgot-password', forgotPasswordSchema, forgotPassword);
router.get('/wishlist', listWishlist);
router.put('/wishlist', updateWishlist);
router.get('/cart', listCart);
router.put('/cart', updateCart);

function listWishlist(req, res, next) {
    console.log("Inside listWishlist get");
    accountService.listWishlist()
        .then(items => res.json(items))
        .catch(next);
}

function updateWishlist(req, res, next) {
    console.log(req.body)
    accountService.updateWishlist(req.body)
        .then((result) => {
            if(!result) {
                res.status(403).send({ detail: "You do not have the permission to perform this action" });
            } else if(result == 'updated') {
                console.log(result);
                res.status(202).send({ detail: "Wishlist updated" })
            }
        })
}

function listCart(req, res, next) {
    console.log("Inside listCart get");
    accountService.listCart()
        .then(items => res.json(items))
        .catch(next);
}

function updateCart(req, res, next) {
    console.log(req.body)
    accountService.updateCart(req.body)
        .then((result) => {
            if(!result) {
                res.status(403).send({ detail: "You do not have the permission to perform this action" });
            } else if(result == 'updated') {
                console.log(result);
                res.status(202).send({ detail: "Cart updated" })
            }
        })
}

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    accountService.authenticate({ email, password, ipAddress })
        .then(({ refreshToken, ...account }) => {
            setTokenCookie(res, refreshToken);
            res.json(account);
        })
        .catch(next);
}

function refreshToken(req, res, next) {
    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;
    accountService.refreshToken({ token, ipAddress })
        .then(({ refreshToken, ...account }) => {
            setTokenCookie(res, refreshToken);
            res.json(account);
        })
        .catch(next);
}

function revokeToken(req, res, next) {
    const token = req.cookies.refreshToken;
    console.log("Token:", token)
    accountService.revokeToken(token)
        .then(() => res.json({ message: 'Token revoked' }))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        role: Joi.string().required()
    });
    console.log("AccountController:#93");
    console.log(schema)
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    console.log(req.body)
        accountService.register(req.body, req.get('origin'))
        .then(() => res.json({ message: 'Registration successful, please check your email for verification instructions' }))
        .catch(next);
}

function forgotPasswordSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required()
    });
    validateRequest(req, next, schema);
}

function forgotPassword(req, res, next) {
    accountService.forgotPassword(req.body, req.get('origin'))
        .then(() => res.json({ message: 'Please check your email for password reset instructions' }))
        .catch(next);
}

function setTokenCookie(res, token) {
    // create cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7*24*60*60*1000)
    };
    res.cookie('refreshToken', token, cookieOptions);
}

module.exports = router;
