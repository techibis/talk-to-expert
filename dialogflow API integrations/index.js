// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
console.log("test1");
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements 

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function expert(agent) {
    agent.add(`Let's find you an expert`);
  }

//custom 
const {dialogflow} = require ('actions-on-google');
const WELCOME_INTENT = 'Default Welcome Intent';
const FALLBACK_INTENT = 'Default Fallback Intent';
const TALK_TO_EXPERT_INTENT = 'LookingForExpert';
const EXPERT_TYPE_ENTITY = 'Whom';

const app = dialogflow();

app.intent(WELCOME_INTENT, (conv) => {
    conv.ask("welcome to Find an Expert! Ask for a knowledge expert.");
});
app.intent(FALLBACK_INTENT, (conv) => {
    conv.ask("Sorry, I am having trouble understanding you");
});
app.intent(TALK_TO_EXPERT_INTENT, (conv) => {
    conv.ask("Lets find you an expert!");
});

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Talk to Expert', expert);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  
  const Datastore = require('@google-cloud/datastore');
  const datastore = Datastore();
  
  //debug message below
  app.intent(TALK_TO_EXPERT_INTENT, (conv) => {
    conv.ask("Going to look for2 "+ conv.parameters[EXPERT_TYPE_ENTITY].toLowerCase());
  });
    
  const query1 = datastore.createQuery('experts').filter('field', '=', EXPERT_TYPE_ENTITY);
  
  app.intent(TALK_TO_EXPERT_INTENT, (conv) => {
     //const expert_type = conv.parameters[EXPERT_TYPE_ENTITY].toLowerCase();
     if (expert_type == EXPERT_TYPE_ENTITY\) { 
         return datastore.runQuery(query1).then(results => {
            conv.ask(results[0][1].field + " was found at number " + results[0][1].phone);
        });
     } else {
         //conv.ask("Sorry, that kind of expert is not available.  Please request a different expert.");
     }
});


exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
 

