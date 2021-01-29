const dynamo = require('../Libs/dynamodb');
let appconfig = require('../config');
const { v4: uuidv4 } = require('uuid');
const towns = require('../Assets/towns');
var moment = require('moment');

const needstatus = {
    0 : 'active',
    1 : 'completed',
    2 : 'passive'
}

module.exports.create = async(req,res) =>{
    const needid = uuidv4()
    var params = {
        TableName:'Needs',
        Item:{
            "ID": needid,
            "UserEmail": req.userData.email,
            "Need": req.body.Need,
            "Adress": req.body.Adress,
            "Price" : req.body.Price,
            "status" : 0,
            "isDeleted" : false,
            "CreatedDate" : moment(new Date()).format()
        }
    };
    dynamo.put(params, function(err, data) {
        if (err) {
            res.json({ message: 'Error', statusCode: 500, data: JSON.stringify(err)});
        } else {
            res.json({ message: 'Success', statusCode: 200, data : JSON.stringify({ "id" : needid })});
        }
    }) 
}

module.exports.getneeds = async(req,res) =>{
    if(req.query.adress){
        var params = {
            TableName : "Needs",
            FilterExpression: "Adress = :adress",
            ExpressionAttributeValues: {
                ":adress": req.query.adress
            }
        };
    
        let scanResults = [];
        let items;
        do{
            items =  await dynamo.scan(params).promise();
            items.Items.forEach((item) => scanResults.push(item));
            params.ExclusiveStartKey  = items.LastEvaluatedKey;
        }while(typeof items.LastEvaluatedKey != "undefined");
        res.json({ message: 'Success', statusCode: 200, data : JSON.stringify(scanResults)});
    }else{
        res.json({ message: 'Error', statusCode: 400, data : JSON.stringify('Adress Empty')});
    }
    
    // else if(req.userData.email){
    //     var params = {
    //         TableName: 'Needs',
    //         Key:{
    //             "UserEmail": req.userData.email
    //         }
    //     };
    //     var needList = await dynamo.get(params).promise();
    //     res.json({ message: 'Success', statusCode: 200, data : JSON.stringify(needList)});
    // }
}