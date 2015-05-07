crypt-maker
===========================

An asynchronous version of crypt-maker. Spawn child processes and do encrypt and decrypt at them.

#Atention

Install with:

    npm install crypt-maker-async


## Usage

Simple example:

```js

    var CM = require("crypt-maker");
    var crypt = new CM({
                          ceiling: 10,
                           spawnWorkerTimeout: 100,
                           cryptParams: {
                               algorithm: 'aes128',
                               key: 'qweqwerljgi3i234oijfoiw23r234243234erwr'
                           }
                       });

    var messageJSON = {
        header: {
            some: 'header',
            another: 'awesome header'
        },
        body: {
            time: '11:22',
            whisp: 'do this' 
        }
    };
    
    crypt.encrypt('To create a child process use require().spawn() or require().fork(). The semantics of each are slightly different, and explained below.', function(err,data){
            if (err) return console.error('encrypt', err);
            crypt.decrypt(data, function(err, data){
                if (err) return console.error('decrypt', err);
            });
        });
        
    crypt.makeMessage(messageJSON, function(err, encryptedMessage){
        //todo something
        
        crypt.parseMessage(encryptedMessage, function(err, message){
                //todo something
                // message==makeMessage
            })
    })
```


# Methods

## CM.createClient()

Is the same as:

## new CM()


If `algorithm !== 'no'` and no key passed to constructor - throws error

* `key`: key to crypt strings
* `algorithm`: which algorithm use to encrypt messages. Default `aes128`
* `EOM`: which symbols indicate ends of messages. Default `\r\n\r\n`
* `SOP`: which symbols indicate separate between header and message. Default `\r\n`
* `headerEncrypted`: `true` if header should encrypted. Default `false`
* `ceiling` max number of worker. Default `2`
* `spawnWorkerTimeout` number (ms). If worker do its work longer, than this, will try to spawn one more wokrer. Default `50` Be careful, too small timeout will spawn too many workers.

## cm.decrypt(message, callback) 

Return decrypted string. If `algorithm == 'no'` returns `message`.

Parameters:

Name 	| Type    |	Description
--------|---------|--------------------
message | string  |	encrypted message
callback| function| 

## cm.encrypt(message, callback)

Return encrypted string. If `algorithm == 'no'` returns `message`.

Parameters:

Name 	| Type    |	Description
--------|---------|--------------------
message | string  |	message to decrypt
callback| function| 


## cm.getBody(message, callback)

Get body from encrypted message. If `typeof message == undefined || message length == 0` 
or no SOP at message, returns error object.

Parameters:

Name 	| Type    |	Description
--------|---------|--------------------
message | string  |	encrypted message
callback| function| 


## cm.getHeader(message, callback)

Get header from encrypted message. If `typeof message == undefined || message.length == 0` 
or no SOP at message, returns error object.

Parameters:

Name 	| Type    |	Description
--------|---------|--------------------
message | string  |	encrypted message
callback| function| 


## cm.makeMessage(message, callback)

Make encrypt message form object.


Parameters:

Name          |	Type           |	Description
--------------|----------------|----------------
message       | Object         | Properties	
message.header|	Object, string |
message.body  |	Object, string |	
callback      | function       | returns error or encrypted message 




## cm.parseMessage(message, callback)

Decrypt message form object. Returns error or Object `{header: ... , body: ... }`

Parameters:

Name     |	Type  |	Description
---------|--------|----------------
message  | string | 
callback |function|


# LICENSE - "MIT License"

Copyright (c) 2015 Konstantine Petryaev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.