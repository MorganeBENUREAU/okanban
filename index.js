require('dotenv').config();

const express = require('express');
const cors = require('cors');
const router = require('./app/router');
const sanitizer = require('sanitizer');
const app = express();
const PORT = process.env.PORT || 3000;
const multer = require('multer');


// Pour autoriser d'autre site à communiquer avec notre application, il faut autoriser les noms de domaines. Pour ce faire, on peu soit mettre un nom de domaine à la propriété origin 
// {origin: 'https://monsupersite.com'}
// Soit utiliser une fonction qui nous permettra d'autoriser plusieurs origin voir même de les récupérer d'ailleurs. Voir la doc pour comment l'utiliser, il y a l'exemple en dessous si besoin :)
// app.use(cors({
//   origin: (origin, callback) => {
//     callback(false, ['null', 'https://tata.com'])
//   }
// }));
// On autorise tout le monde à venir sur notre API
app.use(cors());

const bodyParser = multer();
// on utlise .none() pour dire qu'on attends pas de fichier, uniquement des inputs "classiques" !
app.use( bodyParser.none() );


app.use(express.urlencoded({
  extended: true
}));

app.use(express.static('public'));


// Pour prévenir des failles XSS, on met en place un sanitizer qui nous permettra d'empêcher à l'utilisateur de rentrer du HTML
app.use((req, res, next) => {
  // Pour chaque champ de notre body (qui contient les données à sauvegarder), on va sanitizer chacun des champs
  // <img src="notFound.png" onerror="alert('BIM')" /> => &lt;img src=&#34;notFound.png&#34; onerror=&#34;alert('BIM')&#34; /&gt;
  for(const key in req.body) {
    req.body[key] = sanitizer.escape(req.body[key]);
  }

  // On continue d'envoyer notre requête avec les données sécurisé.
  next();
});




app.use(router);

app.listen(PORT, () => {
  console.log(`app started on http://localhost:${PORT}`);
});
