"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = require("fs");
const path_1 = require("path");
//DONNEES//
const utilisateursJSON = require('./utilisateurs.json');
//MODULE NODEJS//
const path = require('path');
const twig = require('twig');
//REQUETE HTTP//
const axios = require('axios');
const PORT = 3000;
const app = (0, express_1.default)();
//USES//
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: false
}));
//dossier de fichier static
app.use(express_1.default.static('src'));
//Le dossier twig views = public/vues
app.set('views', 'src/vues');
//Le moteur de template = twig
app.set('view engine', 'twig');
//POINT ENTREE DE API UTILISATEURS = localhost:3000
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname + '/utilisateurs.json'));
});
//Afficher la page d'accueil twig = localhost:3000/accueil
app.get('/accueil', (request, response) => {
    response.render('accueil.twig');
});
//Afficher la liste des utilisateurs
app.get('/utilisateurs', (req, res) => {
    axios.get('http://localhost:3000')
        .then((response) => {
        const utilisateurs = response;
        //console.log(response.data);
        res.render('utilisateurs.twig', { 'utilisateurs': utilisateurs.data });
    });
});
//Afficher un utilisateur
app.get('/utilisateurs/:id', (req, res) => {
    const id = req.params.id;
    const unUtilisateur = utilisateursJSON.find((user) => user.id == id);
    res.render('details-utilisateur.twig', { 'unUtilisateur': unUtilisateur });
});
//Afficher formulaire ajouter utilisateur
app.get('/ajouter-utilisateur', (req, res) => {
    res.render('ajouter-utilisateur.twig');
});
app.post('/ajouter-utilisateur', (req, res) => {
    //Creer nouvel utilisateur objet
    let nouvelUtilisateur = {
        id: utilisateursJSON.length + 1,
        email: req.body.email,
        password: req.body.password
    };
    //Ajout du nouvel objet au tableau json
    utilisateursJSON.push(nouvelUtilisateur);
    sauvergarderUtilisateur(utilisateursJSON);
    res.redirect('/utilisateurs');
});
//SUPPRIMER UN UTILISTEUR
app.get('/supprimer-utilisateur/:id', (req, res) => {
    const id = req.params.id;
    const index = utilisateursJSON.findIndex((user) => user.id == id);
    console.log(index);
    utilisateursJSON.splice(index, 1);
    sauvergarderUtilisateur(utilisateursJSON);
    console.log("Element supprimer");
    res.redirect('/utilisateurs');
});
//METTRE A JOUR UTILISTATEURS//
app.get('/mette-a-jour-utilisateur/:id', (req, res) => {
    const id = req.params.id;
    const unUtilisateur = utilisateursJSON.find((user) => user.id == id);
    res.render('mettre-jour-utilisateur.twig', { 'unUtilisateur': unUtilisateur });
});
app.post('/mette-a-jour-utilisateur/:id', (req, res) => {
    const id = req.params.id;
    const index = utilisateursJSON.findIndex((user) => user.id == id);
    const miseJourUtilisateur = {
        id: utilisateursJSON[index].id,
        email: req.body.email,
        password: req.body.password
    };
    utilisateursJSON[index] = miseJourUtilisateur;
    sauvergarderUtilisateur(utilisateursJSON);
    res.redirect('/utilisateurs');
});
//SAUVER LES ACTIONS CRUD//
const sauvergarderUtilisateur = (utilisateurs) => {
    const stringifyObject = JSON.stringify(utilisateurs);
    (0, fs_1.writeFileSync)((0, path_1.join)(__dirname, './utilisateurs.json'), stringifyObject);
};
//PORT ECOUTE DU SERVEUR//
app.listen(PORT, () => {
    console.log(`http:localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map