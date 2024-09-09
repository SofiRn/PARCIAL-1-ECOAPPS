let socket = io('http://localhost:5050', { path: '/real-time' });

socket.on('connect', () => {
	console.log('Connected to server');
});

socket.on('disconnect', () => {
	console.log('Disconnected from server');
});

// Registrar usuario
document.getElementById('loginBtn').addEventListener('click', () => {
	const userName = document.getElementById('userName').value;
	if (userName) {
		socket.emit('register', userName);
		document.getElementById('login').style.display = 'none';
		document.getElementById('waiting').style.display = 'block';
	}
});

// Iniciar juego
document.getElementById('join-button').addEventListener('click', () => {
	socket.emit('startGame');
});

// Recibir la lista de jugadores conectados
socket.on('userJoined', (players) => {
	const playersList = document.getElementById('playersList');
	playersList.innerHTML = ''; // Limpiar la lista para evitar duplicados
	players.forEach((player) => {
		const li = document.createElement('li');
		li.textContent = player;
		playersList.appendChild(li);
	});

	// Mostrar el botón de empezar el juego si hay al menos 3 jugadores
	if (players.length >= 3) {
		document.getElementById('startGameBtn').style.display = 'block';
	}
});

document.getElementById('startGameBtn').addEventListener('click', () => {
	socket.emit('startGame');
	document.getElementById('startGameBtn').style.display = 'none'; // Ocultar el botón de iniciar
});

socket.on('startGame', (data) => {
	const { role } = data;
	document.getElementById('waiting').style.display = 'none';
	document.getElementById('game').style.display = 'block';

	// Mostrar el rol al jugador
	document.getElementById('role').innerText = `Tú eres ${role}`;

	if (role === 'Marco') {
		// Mostrar botón para gritar "Marco"
		document.getElementById('shout-marco').style.display = 'block';
	} else {
		// Mostrar botón para gritar "Polo"
		document.getElementById('shout-polo').style.display = 'block';
	}
});



document.getElementById('shout-marco').addEventListener('click', () => {
	socket.emit('shoutMarco'); // Marco grita
});

document.getElementById('shout-polo').addEventListener('click', () => {
	socket.emit('shoutPolo', socket.nickname); // Polo responde
});

socket.on('marcoShouted', () => {
	document.getElementById('action-message').innerText = '¡Marco ha gritado!';
});



socket.on('poloShouted', (user) => {
	const actionMessage = document.getElementById('action-message');
	actionMessage.innerText = `${user} ha gritado ¡Polo!`;
});

socket.on('showPoloOptions', (poloPlayers) => {
	const poloOptions = document.getElementById('polo-options');
	poloOptions.innerHTML = '';

	poloPlayers.forEach((player) => {
		const button = document.createElement('button');
		button.innerText = player;
		button.addEventListener('click', () => {
			socket.emit('endGame', player); // Marco elige si termina el juego
		});
		poloOptions.appendChild(button);
	});
});

// Mostrar jugadores que se han unido
socket.on('userJoined', (players) => {
	const messageDiv = document.getElementById('action-message');
	messageDiv.innerText = `${players.join(', ')} se han unido al juego.`;
});

// Fin del juego
socket.on('gameOver', ({ winner }) => {
	alert(`${winner} ha ganado el juego.`);
	location.reload(); // Recargar la página para reiniciar el juego
});

// let socket = io('http://localhost:5050', { path: '/real-time' });

// socket.on('connect', () => {
// 	console.log('Connected to server');
// });

// socket.on('disconnect', () => {
// 	console.log('Disconnected from server');
// });

// document.getElementById('loginBtn').addEventListener('click', () => {
// 	const userName = document.getElementById('userName').value;
// 	if (userName) {
// 		socket.emit('register', userName);
// 		document.getElementById('login').style.display = 'none';
// 		document.getElementById('waiting').style.display = 'block';
// 	}
// });

// socket.on('startGame', (playerRoles) => {
// 	document.getElementById('waiting').style.display = 'none';
// 	document.getElementById('game').style.display = 'block';

// 	const playersDiv = document.getElementById('players');
// 	playersDiv.innerHTML = '';

// 	playerRoles.forEach(({ name, role }) => {
// 		const playerElement = document.createElement('div');
// 		playerElement.innerText = `${name} - ${role}`;
// 		// Cambiar el estilo según el rol
// 		if (role === 'Marco') {
// 			playerElement.style.color = 'red'; // Marco
// 			playerElement.style.fontWeight = 'bold'; // Resaltar Marco
// 		} else if (role === 'Polo especial') {
// 			playerElement.style.color = 'blue'; // Polo especial
// 			playerElement.style.fontWeight = 'bold'; // Resaltar Polo especial
// 		} else {
// 			playerElement.style.color = 'black'; // Polo normal
// 		}
// 		playersDiv.appendChild(playerElement);
// 	});
// });

// document.getElementById('join-button').addEventListener('click', () => {
// 	socket.emit('startGame'); // Emitir evento para iniciar el juego
// });

// socket.on('userJoined', (players) => {
// 	const messageDiv = document.getElementById('message');
// 	messageDiv.innerText = `${players.join(', ')} se han unido al juego.`;
// });
// socket.on('startGame', (playerRoles) => {
// 	document.getElementById('waiting').style.display = 'none';
// 	document.getElementById('game').style.display = 'block';

// 	const playersDiv = document.getElementById('players');
// 	playersDiv.innerHTML = '';

// 	playerRoles.forEach(({ name, role }) => {
// 		const playerElement = document.createElement('div');
// 		playerElement.innerText = `${name} - ${role}`;
// 		// Cambiar el estilo según el rol
// 		if (role === 'Marco') {
// 			playerElement.style.color = 'red'; // Marco
// 			playerElement.style.fontWeight = 'bold'; // Resaltar Marco
// 		} else if (role === 'Polo especial') {
// 			playerElement.style.color = 'blue'; // Polo especial
// 			playerElement.style.fontWeight = 'bold'; // Resaltar Polo especial
// 		} else {
// 			playerElement.style.color = 'black'; // Polo normal
// 		}
// 		playersDiv.appendChild(playerElement);
// 	});
// });

// document.getElementById('join-button').addEventListener('click', () => {
// 	socket.emit('startGame'); // Emitir evento para iniciar el juego
// });

// socket.on('userJoined', (players) => {
// 	const messageDiv = document.getElementById('message');
// 	messageDiv.innerText = `${players.join(', ')} se han unido al juego.`;
// });

// socket.on('gameOver', ({ winner }) => {
//   alert(`${winner} ha ganado el juego.`);
//   // Reiniciar el juego o redirigir a una pantalla de finalización
// });
// socket.on('startGame', (playerRoles) => {
// 	document.getElementById('waiting').style.display = 'none';
// 	document.getElementById('game').style.display = 'block';

// 	const playersDiv = document.getElementById('players');
// 	playersDiv.innerHTML = '';

// 	playerRoles.forEach(({ name, role }) => {
// 		const playerElement = document.createElement('div');
// 		playerElement.innerText = `${name} - ${role}`;
// 		// Cambiar el estilo según el rol
// 		if (role === 'Marco') {
// 			playerElement.style.color = 'red'; //  Marco
// 			playerElement.style.fontWeight = 'bold'; // Resaltar Marco
// 		} else if (role === 'Polo especial') {
// 			playerElement.style.color = 'blue'; //  Polo especial
// 			playerElement.style.fontWeight = 'bold'; // Resaltar Polo especial
// 		} else {
// 			playerElement.style.color = 'black'; //  Polo
// 		}
// 		playersDiv.appendChild(playerElement);
// 	});
// });

// // document.getElementById('waiting').innerHTML = userName;

// document.getElementById('join-button').addEventListener('click', fetchData);

// // async function fetchData() {
// //   socket.emit("joinGame", { nickname: "Spiderman xd" }); // Sends a string message to the server
// // }

// socket.on('userJoined', (data) => {
// 	console.log(data);
// });
