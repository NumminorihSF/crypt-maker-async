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


function CryptMaker (options){
    this.threads = new (require('child-watcher')).Master();
    this.ceiling = options.ceiling || 2;
    this.spawnWorkerTimeout = options.spawnWorkerTimeout || 50;
    if (options.algorithm !== 'no' && !options.key) throw Error('need key');
    options.key = options.key || String(Math.random());
    this.cryptParams = options;
    this.runned = 0;
    return this;
}

CryptMaker.prototype.startWorker = function(){
   // console.log(this.runned < this.ceiling, this.threads.getAveLoad() > this.spawnWorkerTimeout);
    if (this.runned < this.ceiling) {
        if (this.threads.getAveLoad() > this.spawnWorkerTimeout || this.runned === 0) {
            var child = this.threads.newChild(this.runned, {
                shouldRespawn: true,
                filePath: __dirname + '/lib/worker.js'
            });
            child.ipc({action: 'setOptions', options: this.cryptParams}, function (err, data) {
                if (err) return console.error('SETERROR', err);
                console.error('SET');
            });
            child.on('error', function (err) {
                console.error('Error in worker:', err);
            });
            child.on('close', function (code) {
                if (code) return console.error('Worker closed with code:', code);
                console.log('Worker closed');
            });
            var old = this.runned;
            this.runned = this.ceiling * 2;
            var wait = this.spawnWorkerTimeout * 100;
            setTimeout(function () {
                this.runned = old + 1;
            }.bind(this), wait);
        }
    }
};


CryptMaker.prototype.encrypt = function(string, callback){
    this.startWorker();
    setImmediate(function(){
        if (this.runned>1) this.threads.ipcAny({action: 'encrypt', message: string}, callback);
        else this.threads.ipc(0, {action: 'encrypt', message: string}, callback);
    }.bind(this));
};

CryptMaker.prototype.decrypt = function(string, callback){
    this.startWorker();
    setImmediate(function(){
        if (this.runned>1) this.threads.ipcAny({action: 'decrypt', message: string}, callback);
        else this.threads.ipc(0, {action: 'decrypt', message: string}, callback);
    }.bind(this));
};

CryptMaker.prototype.makeMessage = function(message, callback){
    this.startWorker();
    setImmediate(function(){
        if (this.runned>1) this.threads.ipcAny({action: 'makeMessage', message: message}, callback);
        else this.threads.ipc(0, {action: 'makeMessage', message: message}, callback);
    }.bind(this));
};

CryptMaker.prototype.parseMessage = function(message, callback){
    this.startWorker();
    setImmediate(function(){
        this.threads.ipcAny({action: 'parseMessage', message: message}, callback);
    }.bind(this))
};


CryptMaker.prototype.getHeader = function(message, callback){
    if (typeof message === 'undefined' || message.length == 0) return callback(Error('empty message'));
    this.startWorker();
    setImmediate(function(){
        if (this.runned>1) this.threads.ipcAny({action: 'getHeader', message: message}, callback);
        else this.threads.ipc(0, {action: 'getHeader', message: message}, callback);
    }.bind(this))
};

CryptMaker.prototype.getBody = function(message, callback){
    if (typeof message === 'undefined' || message.length == 0) return callback(Error('empty message'));
    this.startWorker();
    setImmediate(function(){
        if (this.runned>1) this.threads.ipcAny({action: 'getBody', message: message}, callback);
        else this.threads.ipc(0, {action: 'getBody', message: message}, callback);
    }.bind(this))
};


CryptMaker.prototype.createCryptMaker = function(opt){
    return new CryptMaker(opt);
};

module.exports = CryptMaker;

