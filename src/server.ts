import express, { request, response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { writeFileSync } from 'fs';
import { join } from 'path';
//DONNEES//
const utilisateursJSON = require('./utilisateurs.json');

//MODULE NODEJS//
const path = require('path');

const twig = require('twig');
//REQUETE HTTP//
const axios = require('axios');
const PORT = 3000;
const app = express();


//USES//
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
//dossier de fichier static
app.use(express.static('src'));
//Le dossier twig views = public/vues
app.set('views', 'src/vues');
//Le moteur de template = twig
app.set('view engine', 'twig');

//POINT ENTREE DE API UTILISATEURS = localhost:3000
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname + '/utilisateurs.json'))
});

//Afficher la page d'accueil twig = localhost:3000/accueil
app.get('/accueil', (request: any, response: any) => {
    response.render('accueil.twig');
});

//Afficher la liste des utilisateurs
app.get('/utilisateurs', (req: any, res: any) => {
    axios.get('http://localhost:3000')
    .then((response: any) => {
        const utilisateurs = response;
        //console.log(response.data);
        res.render('utilisateurs.twig', {'utilisateurs': utilisateurs.data});
    });
});

//Afficher un utilisateur
app.get('/utilisateurs/:id', (req: any, res:any) => {
    const id = req.params.id;
    const unUtilisateur = utilisateursJSON.find((user:any) => user.id == id);
    res.render('details-utilisateur.twig', {'unUtilisateur': unUtilisateur}) 
});

//Afficher formulaire ajouter utilisateur
app.get('/ajouter-utilisateur', (req:any,res:any) => {
    res.render('ajouter-utilisateur.twig')
});

app.post('/ajouter-utilisateur', (req:any,res:any) => {
    //Creer nouvel utilisateur objet
    let nouvelUtilisateur = {
        id: utilisateursJSON.length + 1,
        email: req.body.email,
        password: req.body.password
    }
    //Ajout du nouvel objet au tableau json
    utilisateursJSON.push(nouvelUtilisateur);
    sauvergarderUtilisateur(utilisateursJSON);
    res.redirect('/utilisateurs');
});

//SUPPRIMER UN UTILISTEUR

app.get('/supprimer-utilisateur/:id', (req:any, res:any) => {
    const id = req.params.id;
    const index = utilisateursJSON.findIndex((user:any) => user.id == id);
    console.log(index)
    utilisateursJSON.splice(index, 1);
    sauvergarderUtilisateur(utilisateursJSON);
    console.log("Element supprimer");
    res.redirect('/utilisateurs')
})

//METTRE A JOUR UTILISTATEURS//
app.get('/mette-a-jour-utilisateur/:id', (req:any, res:any) => {
    const id = req.params.id;
    const unUtilisateur = utilisateursJSON.find((user:any) => user.id == id);
    res.render('mettre-jour-utilisateur.twig', {'unUtilisateur': unUtilisateur}) 
});

app.post('/mette-a-jour-utilisateur/:id', (req:any, res:any) => {
    const id = req.params.id;
    const index = utilisateursJSON.findIndex((user:any) => user.id == id);
    const miseJourUtilisateur = {
        id: utilisateursJSON[index].id,
        email: req.body.email,
        password: req.body.password
    }
    utilisateursJSON[index] = miseJourUtilisateur;
    sauvergarderUtilisateur(utilisateursJSON);
    res.redirect('/utilisateurs')
});


//SAUVER LES ACTIONS CRUD//
const sauvergarderUtilisateur = (utilisateurs: any) => {
    const stringifyObject = JSON.stringify(utilisateurs);
    writeFileSync(join(__dirname, './utilisateurs.json'), stringifyObject);
}


//PORT ECOUTE DU SERVEUR//
app.listen(PORT, () => {
    console.log(`http:localhost:${PORT}`);
})