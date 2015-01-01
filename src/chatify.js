/**
   Nicholas St.Pierre
   chatify.js
   
   mixify chatbot proof of concept in vanilla js
   because im too lazy to add in jquery.

   dottoro says DOMNodeInserted is supported in all modern browsers, so we'll use it.

   This Week in Chiptune is great.

 */


var chatty = document.getElementById('chat'),
    chatty_debug = false,
    silence = false,
    db = window.localStorage,
    blacklistedUsers = [],
    admins = ["djcutman", "belthesar", "djchatman"];

// make sure you have webstorage
//if(typeof(Storage) !== "undefined") 

// load some init values
function initializedb()
{
    dbput("hyperecord", "7476");
    dbput("viewerrecord", "104");
    dbput('quoteCount', '0');
}

// dump db to console
function dumpdb()
{
    console.log( db.valueOf() );
}

//load db from string
function loaddb()
{
    //@todo...
}

// returns an object with the most recent chat message's user and text
// the returned  object has keys 'user' and 'text'.
function getLatestMessage()
{
    var msg = chatty.lastChild,
	ret = {};

    //message-user
    ret.user = msg.getElementsByClassName('message-user')[0].innerText;

    //message-text
    ret.text = msg.getElementsByClassName('message-text')[0].innerText;
    
    return ret;

}

// get thing from database
function dbget(key)
{
    return db.getItem(key);
}

// put thing into database
function dbput(key, value)
{
    db.setItem(key, value);
}

// get hype record from database. kinda needless, but I like it.
function getHypeRecord()
{
    return dbget('hyperecord');
}

// same as getHypeRecord, except viewer record
function getViewerRecord()
{
    return dbget('viewerrecord');
}

// send a chat message, passed as a parameter.
// simulate a user doing it: insert the response into the chat input and simulate an enter keypress.
function say(s)
{
    var chat_input = document.getElementById('chat_input'),
        enterKeyEvent = new KeyboardEvent('keydown', {keyCode: 13});

    console.log("saying: " + s);

    delete enterKeyEvent.keyCode;
    Object.defineProperty(enterKeyEvent, "keyCode", {"value" : 13});
    
    chat_input.value = s;
    chat_input.dispatchEvent(enterKeyEvent);
}


function numberQuotes()
{ 
    return parseInt(dbget('quoteCount'));
}

function nextFreeQuote()
{
    return numberQuotes()+ 1 ;
}

function incrementQuoteCount()
{
    return dbput('quoteCount', numberQuotes()+1);
}

function storequote(q)
{
    dbput("quote" + nextFreeQuote(), q);
    incrementQuoteCount();
}

function getquote(which)
{
    return dbget("quote" + which);
}

// bounds safe get random quote function
function getRandomQuote()
{
    var qstr = 'quote' + (1+Math.floor( (Math.random() * (parseInt(dbget('quoteCount')))))) ;

    console.log('random choosing: ' + qstr);
    return "qstr: " + dbget(qstr);
}

// expects a mesage object. runs a command based on the message.
function handleCommand(msg)
{
    var cmd  = msg.text, 
	user = msg.user;

    // blatant hack from: http://stackoverflow.com/questions/2896626/switch-statement-for-string-matching-in-javascript
    // this way, we can use regexes without a bunch of if/elses!
    switch (true)
    {
	// hype record
        case /^!hyperecord/.test(cmd):
	    say("Hype record is " + getHypeRecord());
	    break;

	//say random quote
        case /^!quote/.test(cmd):
	    say(getRandomQuote());
	    break;

	//store quote
        case /^!storequote /.test(cmd):
	    storequote(cmd.substring(12));
	    say('stored quote ' + numberQuotes() + ' , bruh');
	    break;

	//get specific quote by number
        case /^!getquote /.test(cmd):
	    var num = /\d+/.exec(cmd.substring(9));
	    if (num === null) return;
	    say(getquote(num));
	    break;

	//viewer max
        case /^!viewerrecord/.test(cmd):
	    say("viewer record is " + getViewerRecord());
	    break;

	    // num quotes in database. (not always all that reliable)
        case /^!numquotes/.test(cmd):
	    say( numberQuotes() ) ;
	    break;

	    // patreon
        case /^!patreon/.test(cmd):
	    say( "Support the show! http://www.patreon.com/DjCUTMAN" ) ;
	    break;

	    // twic link
        case /^!twic/.test(cmd):
	    say( "See all the episodes at http://ThisWeekInChiptune.com" ) ;
	    break;

	    // github link
        case /^!source/.test(cmd):
	    say( "know javascript? node.js? Help code lemonbot! https://github.com/InspectorConstructor/chatify.git" ) ;
	    break;

	    // @todo random sc linker
        case /^!clab/.test(cmd):
	    say( "aye, check mah soundcloud" ) ;
	    break;

	    // bulba bounce. enjoy, Belthesar.
        case /^!bulbabounce/.test(cmd):
	    say( "http://i.imgur.com/5hMyuWr.gif" ) ;
	    break;

        case /^!sanic/.test(cmd):
	    say('gotta go fast'); //@todo
	    break;

        case /^!sorry /.test(cmd):

	    if (isAdmin(user)){
		blacklist(cmd.substring(6));
		say('sorry ' + user);
	    }
	    break;


        case /^!sorry /.test(cmd):

	    if (isAdmin(user)){
		makeAdmin(cmd.substring(6));
		say('promotion to ' + user);
	    }
	    break;

    } // end of switch
}

// callback when someone enters a message in chat
function AlmightyListener()
{
    // get the message
    var message = getLatestMessage();
    handleCommand( message );

    // debug message if you're so inclined to hear it
    if (chatty_debug) console.debug('listner done!');

}


// install the listener
function installListener()
{
    document.getElementById('chat').addEventListener("DOMNodeInserted", AlmightyListener);
}


// uninstall the listener. unneeded, but it took 2 seconds to write, so here for posterity.
function uninstallListener()
{
    document.getElementById('chat').removeEventListener("DOMNodeInserted", AlmightyListener);
}

/***** permissions magic *****/
function blacklist(username)
{
    blacklistedUsers.push(username);
    console.log('blacklisted ' + username);
}


function isBlacklisted(username)
{
    return blacklistedUsers.indexOf(username) != -1;
}

function isAdmin(username)
{   // lowercase for now bcos i dont know how they are spelled properly
    return admins.indexOf(username.toLowerCase()) != -1;
}

function makeAdmin(username)
{
    admins.push(username);
    console.log('promoted ' + username);
}



/* todo
function mongo(what, key, value)
{
    $.ajax({ url: 'https://api.mongolab.com/api/1/databases?apiKey=NzZ3EzdrYU3sttU7XajppTgbCZf1OXrq',
	     data: JSON.stringify( { "x" : 1 } ),
	     type: "POST",
	     contentType: "application/json" } );
}
*/

// bootstrapping/starting thing
(function(){

    if ( dbget('initialized') != 'initialized')
    {
	initializedb();
	dbput('initialized', 'initialized');
    }

    installListener();
    say('lemonbot online ^_^');
})();
