/**
   Nicholas St.Pierre
   chatify.js
   
   mixify chatbot proof of concept in vanilla js
   because im too lazy to add in jquery.

   dottoro says DOMNodeInserted is supported in all modern browsers, so we'll use it.

 */

var chatty = document.getElementById('chat'),
    chatty_debug = false,
    silence = false,
    db = window.localStorage;

// make sure you have webstorage
//if(typeof(Storage) !== "undefined") 

// load some init values
function initializedb()
{
    dbput("hyperecord", "7476");
    dbput("viewerrecord", "104");

}

// dump db to console
function dumpdb()
{
    console.log( db.valueOf() );
}


// returns an object with the most recent chat message's user and text
// the returned  object has keys 'user' and 'text'.
function getLatestMessage()
{
    var msg = chatty.lastChild,
	ret = {};

    // I use classname because I think they are safer than referencing the structure of a message

    //message-user
    ret.user = msg.getElementsByClassName('message-user')[0].innerText;

    //message-text
    ret.text = msg.getElementsByClassName('message-text')[0].innerText;
    
    return ret;

}

// get thing from database
function dbget(key)
{
    db.getItem(key);
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
    return dbget('viewerecord');
}

// send a chat message, passed as a parameter
function say(s)
{
    // @TODO OMG MIXIFY HOW
    console.log("chatify: " + s);
}


function nextFreeQuote()
{
    return parseInt(dbget('quoteCount')) + 1 ;
}

function storequote(q)
{
    dbput("quote" + nextFreeQuote(), q);
}

function getquote(which)
{
    return dbget("quote" + which);
}

function getRandomQuote()
{
    //return getquote ( random(parseInt(dbget('quoteCount')))) + 1 ;
    //@todo
    return dbget('quote1');
}

// need to know number of quotes for bounds safety.

// expects a mesage object. runs a command based on the message.
function handleCommand(msg)
{
    var cmd = msg.text ; // c for command

    // blatant hack from:
    // http://stackoverflow.com/questions/2896626/switch-statement-for-string-matching-in-javascript
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
	    //@todo parse quote then storequote("");
	    say('stored, bruh');
	    break;

	//get specific quote by number
        case /^!getquote /.test(cmd):
	    // more parsing, then call getquote, and then say() it
	    break;

	//viewer max
        case /^!viewerrecord/.test(cmd):
	    //@todo
	    say("viewer revord is " + getViewerRecord());
	    break;
	
	    // no default, if no matches, then not a command, and bot ignores it.
	    //default: return;

    } // end of switch
    return;
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

//////////////////////////////////////////////////////////////////////////
