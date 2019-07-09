import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {UsersService} from '../users/users.service';

/**
 * service d'envoi et de reception des sockets au serveur node
 */
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url ;
  private socket;

  constructor(private userService: UsersService) {
    // connexion au serveur
    this.url = 'https://sockets.mycompanyhelper.com/';
    this.socket = io(this.url);
  }

///////////////////////////// PRODUITS //////////////////////////////////

  public ajoutProduit(produit) { // envoi au serveur l'ajout d'un produit
    this.socket.emit('ajout-produit', produit, this.userService.idUser);
  }

  public modifProduit(produit) { // envoi au serveur la modification d'un produit
    this.socket.emit('modif-produit', produit, this.userService.idUser);
  }

  public deleteProduit(id) { // envoi au serveur la suppression d'un produit
    this.socket.emit('delete-produit', id, this.userService.idUser);
  }

  public remisEnVenteProduit(id) { // envoi au serveur la remise en vente d'un produit
    this.socket.emit('remis-en-vente-produit', id, this.userService.idUser);
  }

  public getAjoutProduit = () => { // reception de l'ajout d'un produit (ce que le serveur node a renvoyé)
    return Observable.create((observer) => {
      this.socket.on('nouveau-produit', (data) => {
        observer.next(data);
      });
    });
  }

  public getModifProduit = () => { // reception de la modification d'un produit (ce que le serveur node a renvoyé)
    return Observable.create((observer) => {
      this.socket.on('produit-modifier', (data) => {
        observer.next(data);
      });
    });
  }

  public getDeleteProduit = () => { // reception de la suppression d'un produit (ce que le serveur node a renvoyé)
    return Observable.create((observer) => {
      this.socket.on('produit-supprimer', (data) => {
        observer.next(data);
      });
    });
  }

  public getRemisEnVenteProduit = () => { // reception de la remise en vente d'un produit (ce que le serveur node a renvoyé)
    return Observable.create((observer) => {
      this.socket.on('produit-remis-en-vente', (data) => {
        observer.next(data);
      });
    });
  }

///////////////////////////// CLIENTS //////////////////////////////////
  public ajoutClient(client) {
    this.socket.emit('ajout-client', client, this.userService.idUser);
  }

  public modifClient(client) {
    this.socket.emit('modif-client', client, this.userService.idUser);
  }

  public deleteClient(id) {
    this.socket.emit('delete-client', id, this.userService.idUser);
  }

  public getAjoutClient = () => {
    return Observable.create((observer) => {
      this.socket.on('nouveau-client', (data) => {
        observer.next(data);
      });
    });
  }

  public getModifClient = () => {
    return Observable.create((observer) => {
      this.socket.on('client-modifier', (data) => {
        observer.next(data);
      });
    });
  }

  public getDeleteClient = () => {
    return Observable.create((observer) => {
      this.socket.on('client-supprimer', (data) => {
        observer.next(data);
      });
    });
  }

///////////////////////////// FOURNISSEURS //////////////////////////////////
  public ajoutFournisseur(fournisseur) {
    this.socket.emit('ajout-fournisseur', fournisseur, this.userService.idUser);
  }

  public modifFournisseur(fournisseur) {
    this.socket.emit('modif-fournisseur', fournisseur, this.userService.idUser);
  }

  public deleteFournisseur(id) {
    this.socket.emit('delete-fournisseur', id, this.userService.idUser);
  }

  public getAjoutFournisseur = () => {
    return Observable.create((observer) => {
      this.socket.on('nouveau-fournisseur', (data) => {
        observer.next(data);
      });
    });
  }

  public getModifFournisseur = () => {
    return Observable.create((observer) => {
      this.socket.on('fournisseur-modifier', (data) => {
        observer.next(data);
      });
    });
  }

  public getDeleteFournisseur = () => {
    return Observable.create((observer) => {
      this.socket.on('fournisseur-supprimer', (data) => {
        observer.next(data);
      });
    });
  }

///////////////////////////// ANNONCE //////////////////////////////////
  public ajoutAnnonce(annonce) {
    this.socket.emit('ajout-annonce', annonce);
  }

  public deleteAnnonce(id) {
    this.socket.emit('delete-annonce', id);
  }

  public getAjoutAnnonce = () => {
    return Observable.create((observer) => {
      this.socket.on('nouvelle-annonce', (annonce) => {
        observer.next(annonce);
      });
    });
  }

  public getDeleteAnnonce = () => {
    return Observable.create((observer) => {
      this.socket.on('annonce-supprimer', (id) => {
        observer.next(id);
      });
    });
  }

///////////////////////////// CALENDRIER //////////////////////////////////
  public ajoutCalendrier(calendrier) {
    this.socket.emit('ajout-calendrier', calendrier, this.userService.idUser);
  }

  public modifCalendrier(calendrier) {
    this.socket.emit('modif-calendrier', calendrier, this.userService.idUser);
  }

  public deleteCalendrier(id) {
    this.socket.emit('delete-calendrier', id, this.userService.idUser);
  }

  public getAjoutCalendrier = () => {
    return Observable.create((observer) => {
      this.socket.on('nouveau-calendrier', (data) => {
        observer.next(data);
      });
    });
  }

  public getModifCalendrier = () => {
    return Observable.create((observer) => {
      this.socket.on('calendrier-modifier', (data) => {
        observer.next(data);
      });
    });
  }

  public getDeleteCalendrier = () => {
    return Observable.create((observer) => {
      this.socket.on('calendrier-supprimer', (data) => {
        observer.next(data);
      });
    });
  }
}
