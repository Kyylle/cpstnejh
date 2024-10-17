const socketIo = require('socket.io');
let io;  // Store the Socket.IO instance

// Setup function to initialize Socket.IO
function setupSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',  // Allow connections from any origin
            methods: ['GET', 'POST']
        }
    });

    // Handle client connections
    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        // Use userId to join the user to a private room
        const userId = socket.handshake.query.userId;
        if (userId) {
            socket.join(userId);  // Join user to their room
            console.log(`User joined room: ${userId}`);
        }

        // Listen for 'sendMessage' event from the client
        socket.on('sendMessage', async (data) => {
            const { content, fromId, fromType, toId, toType } = data;

            try {
                // Save message to MongoDB
                const message = new Message({
                    content,
                    from: { id: fromId, type: fromType },
                    to: { id: toId, type: toType }
                });
                await message.save();

                // Emit message to the recipient's room
                io.to(toId).emit('receiveMessage', message);
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { error: 'Internal server error' });
            }
        });

        // Handle client disconnect
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

// Helper to get the Socket.IO instance
function getIo() {
    if (!io) throw new Error('Socket.IO not initialized');
    return io;
}

module.exports = { setupSocket, getIo };
