/**
   nicholas stpierre

   dec 11 14

   lemonbot.node.js

 */

var z = require('zombie');

// We call our test example.com
z.localhost('example.com', 3000);

// Load the page from localhost
var browser = z.create();

console.log("hi mom");
