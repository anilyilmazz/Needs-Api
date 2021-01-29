const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/users");
const checkAuth = require("../Middleware/checkAuth");


/**
 * @swagger
 * /users/getAllUserFromUsers:
 *  get:
 *    tags:
 *       - User
 *    description: get all users
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get("/getAllUserFromUsers", checkAuth, UserController.allusers);

/**
 * @swagger
 * /users/register:
 *  post:
 *    description: user register
 *    tags:
 *       - User
 *    parameters:
 *      - in: body
 *        name: Email
 *        description: The user to create.
 *        schema:
 *          type: object
 *          required:
 *            - Email
 *            - Password
 *            - Adress
 *          properties:
 *            Email:
 *              type: string
 *              format: email
 *            Password:
 *              type: string
 *            Adress:
 *              type: string
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/register', UserController.register);

/**
 * @swagger
 * /users/login:
 *  post:
 *    tags:
 *       - User
 *    description: user login
 *    parameters:
 *      - in: body
 *        name: Email
 *        description: The user to create.
 *        schema:
 *          type: object
 *          required:
 *            - Email
 *            - Password
 *          properties:
 *            Email:
 *              type: string
 *              format: email
 *            Password:
 *              type: string
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/login', UserController.login);

/**
 * @swagger
 * /users/forgotpassword:
 *  post:
 *    tags:
 *       - User
 *    description: Forgot Password
 *    parameters:
 *      - in: body
 *        name: Email
 *        description: Forgot password.
 *        schema:
 *          type: object
 *          required:
 *            - Email
 *          properties:
 *            Email:
 *              type: string
 *              format: email
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/forgotpassword', UserController.forgotpassword);


/**
 * @swagger
 * /users/changeForgotPassword:
 *  post:
 *    tags:
 *       - User
 *    description: Change Forgot Password
 *    parameters:
 *      - in: body
 *        name: Email
 *        description: Change Forgot password.
 *        schema:
 *          type: object
 *          required:
 *            - forgotid
 *            - password
 *          properties:
 *            forgotid:
 *              type: string
 *            password:
 *              type: string
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/changeForgotPassword', UserController.changeForgotPassword);

module.exports = router; 
