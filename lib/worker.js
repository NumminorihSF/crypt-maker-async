/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 (NumminorihSF) Konstantine Petryaev
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var worker = new (require('events')).EventEmitter();

var cm;

worker.on('ipc', function(ipc){
    if (!ipc || !ipc.params) return callback('no params');
    if (ipc.params.action === 'setOptions'){
        cm = new (require('crypt-maker'))(ipc.params.options);
        return ipc.callback(null, 'success');
    }
    else if (ipc.params.action === 'makeMessage') {
        var message = cm.makeMessage(ipc.params.message);
        if (message){
            return ipc.callback(null, message);
        }
        else return ipc.callback('fail in make');
    }
    else if (ipc.params.action === 'parseMessage') {
        message = cm.parseMessage(ipc.params.message);
        if (message){
            return ipc.callback(null, message);
        }
        else return ipc.callback('fail in parse');
    }
    else if (ipc.params.action === 'getHeader'){
        var header = cm.getHeader(ipc.params.message);
        if (header){
            return ipc.callback(null, header);
        }
        else return ipc.callback('fail in getHeader');
    }
    else if (ipc.params.action === 'getBody'){
        var body = cm.makeMessage(ipc.params.message);
        if (body){
            return ipc.callback(null, body);
        }
        else return ipc.callback('fail in getBody');
    }
    else if (ipc.params.action === 'encrypt'){
        var enc = cm.encrypt(ipc.params.message);
        return ipc.callback(null, enc);
    }
    else if (ipc.params.action === 'decrypt'){
        var dec = cm.decrypt(ipc.params.message);
        return ipc.callback(null, dec);
    }
});


module.exports = function(setWorker){
    setWorker(worker);
};