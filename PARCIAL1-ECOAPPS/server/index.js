const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(express.json());
app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
	path: '/real-time',
	cors: {
		origin: '*',
	},
});

const db = {
	players: [],
};
let roles = [];

io.on('connection', (socket) => {
	console.log('New player connected');

	// Registro de jugadores
	socket.on('register', (user) => {
		if (!db.players.includes(user)) {
			db.players.push(user);
			socket.nickname = user;
			console.log(`${user} se ha unido al juego.`);
			io.emit('userJoined', db.players);
		}
	});

	// Inicio del juego
	socket.on('startGame', () => {
		if (db.players.length < 3) {
			return socket.emit('message', 'Se necesitan al menos 3 jugadores para iniciar el juego.');
		}

		let marcoIndex = Math.floor(Math.random() * db.players.length);
		roles = db.players.map((player, index) => ({
			name: player,
			role: index === marcoIndex ? 'Marco' : 'Polo',
		}));

		let specialPoloIndex;
		do {
			specialPoloIndex = Math.floor(Math.random() * db.players.length);
		} while (specialPoloIndex === marcoIndex);

		roles[specialPoloIndex].role = 'Polo especial';

		roles.forEach((playerRole) => {
			const { name, role } = playerRole;
			io.to(socket.id).emit('startGame', { role }); // Enviar solo el rol al jugador
		});

		console.log('Roles asignados:', roles);
		io.emit('startGame', roles);
	});

	// Gritar "Marco" y responder "Polo"
	socket.on('shoutMarco', () => {
		io.emit('marcoShouted');
	});

	socket.on('shoutPolo', (player) => {
		io.emit('poloShouted', player);
	});

	// Selección de Polo por Marco
	socket.on('selectPolo', (selectedPolo) => {
		const selected = roles.find((player) => player.name === selectedPolo);
		if (selected.role === 'Polo especial') {
			io.emit('gameOver', { winner: 'Marco' });
			return;
		}
		// Intercambio de roles si no es Polo especial
		const marco = roles.find((player) => player.role === 'Marco');
		marco.role = 'Polo';
		selected.role = 'Marco';

		io.emit('updateRoles', roles);
	});

	// Desconexión del jugador
	socket.on('disconnect', () => {
		console.log(`${socket.nickname} se ha desconectado`);
		db.players = db.players.filter((player) => player !== socket.nickname);
		io.emit('userJoined', db.players);
	});
});

httpServer.listen(5050, () => {
	console.log(`Server is running on http://localhost:5050`);
});
