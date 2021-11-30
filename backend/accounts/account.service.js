const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
// const sendEmail = require('_helpers/send-email');
const db = require('_helpers/db');
const Role = require('_helpers/role');

var detail;

module.exports = {
    authenticate,
    refreshToken,
    revokeToken,
    register,
    forgotPassword,
    listWishlist,
    updateWishlist,
    listCart,
    updateCart,
    currentUser
};

async function listWishlist() {
    console.log("Inside listWishlist service")
    console.log(this.detail);
    if(!this.detail) throw "Log In required";
    const account = await db.Account.findOne({ _id: this.detail.id });
    return account.wishlist;
}

async function updateWishlist(data) {
    console.log("//Inside update wishlist service");
    if(!this.detail) throw "Log In required";
    const account = await db.Account.findOne({ _id: this.detail.id });
    console.log(account)
    account.wishlist.push({
        id: data.item.id,
        code: data.item.code,
        name: data.item.name,
        description: data.item.description,
        price: data.item.price,
        category: data.item.category,
        quantity: data.item.quantity,
        status: data.item.inventoryStatus,
        rating: data.item.rating,
    })
    await account.save();
    return 'updated';
}

async function listCart() {
    console.log("Inside listCart service")
    console.log(this.detail);
    if(!this.detail) throw "Log In required";
    const account = await db.Account.findOne({ _id: this.detail.id });
    return account.cart;
}

async function updateCart(data) {
    console.log("Inside update cart service");
    if(!this.detail) throw "Log In required";
    const account = await db.Account.findOne({ _id: this.detail.id });
    console.log(account)
    account.cart.push({
        id: data.item.id,
        code: data.item.code,
        name: data.item.name,
        description: data.item.description,
        price: data.item.price,
        category: data.item.category,
        quantity: data.item.quantity,
        status: data.item.inventoryStatus,
        rating: data.item.rating,
    })
    await account.save();
    return 'updated';
}

async function authenticate({ email, password, ipAddress }) {
    const account = await db.Account.findOne({ email });
    // console.log("Verification status: ", account.isVerified)
    // console.log("Password Sync: ", bcrypt.compareSync(password, account.passwordHash))
    if (!account || !account.isVerified || !bcrypt.compareSync(password, account.passwordHash)) {
        throw 'Email or password is incorrect';
    }

    // authentication successful so generate jwt and refresh tokens
    const jwtToken = generateJwtToken(account);
    const refreshToken = generateRefreshToken(account, ipAddress);

    // save refresh token
    await refreshToken.save();

    // return basic details and tokens
    this.detail = account;
    console.log(detail)
    return {
        ...basicDetails(account),
        jwtToken,
        refreshToken: refreshToken.token
    };
}

function currentUser() {
    console.log(detail);
    return detail;
}

async function refreshToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);
    const { account } = refreshToken;

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(account, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    // generate new jwt
    const jwtToken = generateJwtToken(account);

    // return basic details and tokens
    return {
        ...basicDetails(account),
        jwtToken,
        refreshToken: newRefreshToken.token
    };
}

async function revokeToken(token) {
    const refreshToken = await db.RefreshToken.findOne({ token }).populate('account');
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    await refreshToken.save();
}

async function register(params, origin) {
    console.log("AccountService:97 ")
    console.log(params);
    // validate
    if (await db.Account.findOne({ email: params.email })) {
        // send already registered error in email to prevent account enumeration
        return await sendAlreadyRegisteredEmail(params.email, origin);
    }

    // create account object
    const account = new db.Account(params);

    // first registered account is an admin
    const isFirstAccount = (await db.Account.countDocuments({})) === 0;
    account.role = 'Admin';
    account.verified = Date.now();
    account.verificationToken = undefined;

    // hash password
    account.passwordHash = hash(params.password);

    // save account
    await account.save();

    // send email
    // await sendVerificationEmail(account, origin);
}

async function forgotPassword({ email }, origin) {
    const account = await db.Account.findOne({ email });
    // always return ok response to prevent email enumeration
    if (!account) return;

    // create reset token that expires after 24 hours
    account.resetToken = {
        token: randomTokenString(),
        expires: new Date(Date.now() + 24*60*60*1000)
    };
    await account.save();
}

async function getRefreshToken(token) {
    const refreshToken = await db.RefreshToken.findOne({ token }).populate('account');
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken;
}

function hash(password) {
    return bcrypt.hashSync(password, 10);
}

function generateJwtToken(account) {
    // create a jwt token containing the account id that expires in 15 minutes
    return jwt.sign({ sub: account.id, id: account.id }, config.secret, { expiresIn: '15m' });
}

function generateRefreshToken(account, ipAddress) {
    // create a refresh token that expires in 7 days
    return new db.RefreshToken({
        account: account.id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7*24*60*60*1000),
        createdByIp: ipAddress
    });
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

function basicDetails(account) {
    const { id, title, firstName, lastName, email, role, created, updated, isVerified } = account;
    return { id, title, firstName, lastName, email, role, created, updated, isVerified };
}