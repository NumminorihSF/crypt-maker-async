var crypt = new (require('./index.js'))({
    ceiling: 10,
    spawnWorkerTimeout: 100,
    algorithm: 'aes128',
    key: 'qweqwerljgi3i234oijfoiw23r234243234erwr'

});

var func = function(){
    crypt.encrypt('To create a child process use require().spawn() or require().fork(). The semantics of each are slightly different, and explained below.', function(err,data){
        if (err) return console.error('encrypt', err);
        crypt.decrypt(data, function(err, data){
            if (err) return console.error('decrypt', err);
        });
    });
};
func();
setInterval(function(){
    func();
}, 100);

setInterval(function(){
    console.log(crypt.threads.getAveLoad());
},3000);

var a = function() {
    console.error('ADD TASKS');
    setInterval(function () {
        func();
    }, 100);
};
setTimeout(function () {
    for(var i = 0; i < 10; i++) a();
    setTimeout(function () {
        for(var i = 0; i < 10; i++) a();
        setTimeout(function () {
            for(var i = 0; i < 10; i++) a();
        }, 30000);
    }, 30000);
    setTimeout(function(){
        process.exit();
    }, 120000);
}, 30000);

a();