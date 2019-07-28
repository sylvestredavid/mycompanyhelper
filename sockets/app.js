let express = require('express')
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const port = 8081;

io.on('connection', (socket) => {

////////////////////// PRODUITS //////////////////////////////////////////////////

    socket.on('ajout-produit', (produit, idUser) => {
        socket.broadcast.emit('nouveau-produit', {produit: produit, idUser: idUser})
    });

    socket.on('modif-produit', (produit, idUser) => {
        socket.broadcast.emit('produit-modifier', {produit: produit, idUser: idUser})
    });

    socket.on('delete-produit', (id, idUser) => {
        socket.broadcast.emit('produit-supprimer', {id: id, idUser: idUser})
    });

    socket.on('remis-en-vente-produit', (id, idUser) => {
        socket.broadcast.emit('produit-remis-en-vente', {id: id, idUser: idUser})
    });


////////////////////// CLIENTS //////////////////////////////////////////////////

    socket.on('ajout-client', (client, idUser) => {
        socket.broadcast.emit('nouveau-client', {client: client, idUser: idUser})
    });

    socket.on('modif-client', (client, idUser) => {
        console.log(client)
        socket.broadcast.emit('client-modifier', {client: client, idUser: idUser})
    });

    socket.on('delete-client', (id, idUser) => {
        socket.broadcast.emit('client-supprimer', {id: id, idUser: idUser})
    });

////////////////////// FOURNISSEURS //////////////////////////////////////////////////

    socket.on('ajout-fournisseur', (fournisseur, idUser) => {
        socket.broadcast.emit('nouveau-fournisseur', {fournisseur: fournisseur, idUser: idUser})
    });

    socket.on('modif-fournisseur', (fournisseur, idUser) => {
        socket.broadcast.emit('fournisseur-modifier', {fournisseur: fournisseur, idUser: idUser})
    });

    socket.on('delete-fournisseur', (id, idUser) => {
        socket.broadcast.emit('fournisseur-supprimer', {id: id, idUser: idUser})
    });

////////////////////// ANNONCE //////////////////////////////////////////////////

    socket.on('ajout-annonce', (annonce) => {
        socket.broadcast.emit('nouvelle-annonce', annonce)
    });

    socket.on('delete-annonce', (id) => {
        socket.broadcast.emit('annonce-supprimer', id)
    });

////////////////////// CALENDRIER //////////////////////////////////////////////////

    socket.on('ajout-calendrier', (calendrier, idUser) => {
        socket.broadcast.emit('nouveau-calendrier', {calendrier: calendrier, idUser: idUser})
    });

    socket.on('modif-calendrier', (calendrier, idUser) => {
        socket.broadcast.emit('calendrier-modifier', {calendrier: calendrier, idUser: idUser})
    });

    socket.on('delete-calendrier', (id, idUser) => {
        socket.broadcast.emit('calendrier-supprimer', {id: id, idUser: idUser})
    });

    ////////////////////// PRESTATIONS //////////////////////////////////////////////////
    
        socket.on('ajout-prestation', (prestation, idUser) => {
            socket.broadcast.emit('nouveau-prestation', {prestation: prestation, idUser: idUser})
        });
    
        socket.on('modif-prestation', (prestation, idUser) => {
            socket.broadcast.emit('prestation-modifier', {prestation: prestation, idUser: idUser})
        });
    
        socket.on('delete-prestation', (id, idUser) => {
            socket.broadcast.emit('prestation-supprimer', {id: id, idUser: idUser})
        });

        ////////////////////// GENRES //////////////////////////////////////////////////
        
            socket.on('ajout-genre', (genre, idUser) => {
                socket.broadcast.emit('nouveau-genre', {genre: genre, idUser: idUser})
            });
        
            socket.on('delete-genre', (id, idUser) => {
                socket.broadcast.emit('genre-supprimer', {id: id, idUser: idUser})
            });
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});

