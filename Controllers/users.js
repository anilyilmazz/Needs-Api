const { v4: uuidv4 } = require('uuid');
const dynamo = require('../Libs/dynamodb');
let appconfig = require('../config');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const isemail = require('isemail');
var moment = require('moment');
const transporter = require('../Libs/sendmail')


module.exports.allusers = async (req,res) => {
    const userList = await scanTable('Users');
    res.json({ message: 'success', statusCode: 200, userList})
}

module.exports.register = async (req,res) => {
    if(!req.body.Email){
        res.json({ message: 'Email Empty', statusCode: 200});
        return
    }else if(!isemail.validate(req.body.Email)){
        res.json({ message: 'Email format wrong', statusCode: 200});
        return
    }
    else if(!req.body.Password){
        res.json({ message: 'Password Empty', statusCode: 200});
        return
    }

    const controlUser = await userSearch(req.body.Email);
    if(controlUser.Item){
        res.json({ message: 'Email is being used', statusCode: 200});
        return
    }

    var params = {
        TableName:'Users',
        Item:{
            "ID": uuidv4(),
            "Email": req.body.Email,
            "Password": req.body.Password,
            "Adress" : req.body.Adress,
            "NameSurname" : req.NameSurname,
            "CreatedDate" : moment(new Date()).format()
        }
    };

    bcrypt.hash(req.body.Password, saltRounds, function(err, hash) {
        params.Item.Password = hash;
        dynamo.put(params, function(err, data) {
            if (err) {
                res.json({ message: 'Error', statusCode: 200, data: JSON.stringify(err)});
            } else {
                let token = jwt.sign({ email : req.body.Email }, appconfig.secretkeyforjwt, { expiresIn: '24h' });
                res.json({ message: 'success', statusCode: 200, token});
            }
        }) 
    });
}

module.exports.login = async (req,res) =>{
    if(!req.body.Email){
        res.json({ message: 'Email Empty', statusCode: 200});
        return
    }else if(!isemail.validate(req.body.Email)){
        res.json({ message: 'Email format wrong', statusCode: 200});
        return
    }
    else if(!req.body.Password){
        res.json({ message: 'Password Empty', statusCode: 200});
        return
    }
    const controlUser = await userSearch(req.body.Email);
    if(controlUser.Item){
        bcrypt.compare(req.body.Password, controlUser.Item.Password, function(err, result) {
            if(result){
                let token = jwt.sign({ email : req.body.Email }, appconfig.secretkeyforjwt);;
                res.json({ message: 'success', statusCode: 200, token});
            }else{
                res.json({ message: 'Password is wrong', statusCode: 200});
            }
        });
        return
    }else{
        res.json({ message: 'Email Not Found', statusCode: 200});
        return
    }
}

module.exports.forgotpassword = async (req,res) =>{
    if(!req.body.Email){
        res.json({ message: 'Email Empty', statusCode: 200});
        return
    }else if(!isemail.validate(req.body.Email)){
        res.json({ message: 'Email format wrong', statusCode: 200});
        return
    }

    const controlUser = await userSearch(req.body.Email);
    if(controlUser.Item){
        forgotLinkUuid = uuidv4()
        var params = {
            TableName:'ForgotLinks',
            Item:{
                "ForgotID": forgotLinkUuid,
                "Email": req.body.Email,
                "CreatedDate" : moment(new Date()).format(),
                "Statu": false
            }
        };
    
        var mailOptions = {
            from: appconfig.emailconfig.email,
            to: 'incelefon@gmail.com',
            subject: 'Sending Email using Node.js',
            text: `That was easy ${forgotLinkUuid}`
        };
    
        dynamo.put(params, function(err, data) {
            if (err) {
                res.json({ message: 'Error', statusCode: 200, data: JSON.stringify(err)});
            } else {
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        res.json({ message: error, statusCode: 500})
                    } else {
                        res.json({ message: 'Email Sended', statusCode: 200})
                    }
                });
            }
        }) 
    }else{
        res.json({ message: 'Email is not used', statusCode: 200});
        return
    }
}

module.exports.changeForgotPassword = async(req,res) =>{
    if(!req.body.forgotid || !req.body.password ){
        res.json({ message: 'ForgotId or Password Empty', statusCode: 200});
        return
    }
    const forgotLinkObject = await forgotLinkSearch(req.body.forgotid);
    if(!forgotLinkObject){
        res.json({ message: 'Link is Broken', statusCode: 200});
        return
    }else if(forgotLinkObject.Item.Statu){
        res.json({ message: 'Link is USED', statusCode: 200});
        return
    }else{
        var forgotLinkParams = {
            TableName:"ForgotLinks",
            Key:{
                "ForgotID": req.body.forgotid
            },
            UpdateExpression: "set Statu = :s",
            ExpressionAttributeValues:{
                ":s":true
            },
            ReturnValues:"UPDATED_NEW"
        };

        dynamo.update(forgotLinkParams, function(err, data) {
            if (err) {
                res.json({ message: JSON.stringify(err), statusCode: 500});
            }else {
                bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                    var userParams = {
                        TableName:'Users',
                        Key:{
                            "Email": forgotLinkObject.Item.Email
                        },
                        UpdateExpression: "set Password = :p",
                        ExpressionAttributeValues:{
                            ":p": hash
                        },
                        ReturnValues:"UPDATED_NEW"
                    };
                    dynamo.update(userParams, function(err, data) {
                        if (err) {
                            res.json({ message: JSON.stringify(err), statusCode: 500});
                        } else {      
                            res.json({ message: `${forgotLinkObject.Item.Email} Password Updated`, statusCode: 200});
                        }
                    });
                });
            }
        });
    }
}

const userSearch = async(userEmail) => {
    var params = {
        TableName: 'Users',
        Key:{
            "Email": userEmail
        }
    };
    return await dynamo.get(params).promise();
};

const scanTable = async (tableName) => {
    const params = {
        TableName: tableName,
    };

    let scanResults = [];
    let items;
    do{
        items =  await dynamo.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey  = items.LastEvaluatedKey;
    }while(typeof items.LastEvaluatedKey != "undefined");
    return scanResults;
};

const forgotLinkSearch = async(forgotLinkUuid) => {
    var params = {
        TableName: 'ForgotLinks',
        Key:{
            "ForgotID": forgotLinkUuid
        }
    };
    return await dynamo.get(params).promise();
}