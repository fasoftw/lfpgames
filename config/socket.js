module.exports = io => {

    io.on('connection', (socket) => {
        socket.emit('connections', 'Conectado');

        socket.on('attParty', (data) => {
            socket.broadcast.emit('newParties', data);
        });

        socket.on('disconnect', () => {

        });

    });

}