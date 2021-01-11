module.exports = io => {

    io.on('connection', (socket) => {
        socket.emit('connections', 'Conectado');

        socket.on('attParty', (data) => {
            console.log(data)
            console.log('Party Atualizada')
            socket.broadcast.emit('newParty', (data));
        });
    });

}