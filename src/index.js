import deepstream from 'deepstream.io-client-js';
window.deepstream = deepstream;

let client = deepstream('localhost:6020');
window.client = client;

client.on('error', function( error, event, topic ){
  console.error(event, error, topic);
});

let fn = client.login;
client.login = function() {
  console.error("deepstream login request");
  return fn.apply(this, arguments);
};

let record;
let objects;

client.on('connectionStateChanged', function(state){
    console.log("deepstream state changed to", state);
    if( state == "AWAITING_AUTHENTICATION") {
      console.log("deepstream login");
      client.login({username: 'paul'});
    } else if( state == "OPEN" ) {
        console.log("deepstream open");
        let record = client.record.getRecord('asterisk').whenReady(function(record){
          objects = record.get('objects');
          record.subscribe('objects', function(value){
            console.log("got value ", value);
            objects = value;
          });
        });
    }
});
