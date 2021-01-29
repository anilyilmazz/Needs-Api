const express = require("express");
const router = express.Router();
const needController = require("../Controllers/needs");
const checkAuth = require("../Middleware/checkAuth");


/**
 * @swagger
 * /need/:
 *  get:
 *    tags:
 *       - Need
 *    description: get needs
 *    parameters :
 *      - in : query
 *        name : adress
 *        schema :
 *          type : string
 *      - in : query
 *        name : email
 *        schema :
 *          type : string
 *          format : email
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get("/", checkAuth, needController.getneeds);

/**
 * @swagger
 * /need/:
 *  post:   
 *    description: create need
 *    tags:
 *       - Need
 *    parameters:
 *      - in: body
 *        name: Need
 *        description: The need to create.
 *        schema:
 *          type: object
 *          required:
 *            - Need
 *            - Adress
 *            - Price
 *          properties:
 *            Need:
 *              type: string
 *            Adress:
 *              type: string
 *            Price:
 *              type: string
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/',checkAuth, needController.create);

module.exports = router; 
