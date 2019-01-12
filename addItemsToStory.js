'use strict';

const AWS = require('aws-sdk');
exports.handler = async (event, context, callback) => {
	console.log('Received event {}', JSON.stringify(event, 3));
    
    //const consumerKey = event.arguments.consumer_key;
	//const consumerSecret = event.arguments.consumer_secret;


    AWS.config.update({
        region: "us-east-1"
    });
    
    var database = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-10-08'});
    var id = event.arguments.storyId
    var getStoryParam = {

                    TableName: "stories",
                    Key: {
                        id 
                    } 
                };

    var result =  await database.get(getStoryParam).promise();

    var items = event.arguments.itemIds;
    var updatedStory = {
        id: result.Item.id,
        title: result.Item.title,
        items: items
    } 

    var param = {
        TableName: "stories",
        Item : updatedStory
    };

    var response = await database.put(param).promise();

    
    var itemKeys = [];


    items.forEach(element => {
        itemKeys.push({"id": element});    
    });

   

   var bacthGetParams = {
        RequestItems: {
          'items': {
            Keys: itemKeys
          }
        }
      };
    
    
    var addedItems = await database.batchGet(bacthGetParams).promise();
    callback(null, updatedStory);
	
};
