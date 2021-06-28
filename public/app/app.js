const cardModule = require ('./card');
const listModule = require ('./list');
const tagModule = require ('./tag');


// on objet qui contient des fonctions
const app = {

  base_url: "http://18.204.218.43:3000",


  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    console.log('app.init !');

    // Doit être mis avant l'appel des fonctions sinon erreur
    listModule.setBaseUrl(app.base_url);
    cardModule.setBaseUrl(app.base_url);
    tagModule.setBaseUrl(app.base_url);

    app.addListenerToActions();
    listModule.getListsFromAPI();
  },


  addListenerToActions: () => {

    const IdButton = document.getElementById('addListButton').addEventListener('click', listModule.showAddListModal);

    const closeElem = document.querySelectorAll('.close');
    for (button of closeElem) {
      button.addEventListener('click', app.hideModals);
    };

    const createList = document.querySelector('#formList');
    createList.addEventListener('submit', app.handleAddListForm);

    const cardModal = document.querySelectorAll('.plus-sign');
    // console.log(cardModal);
    for (buttonbis of cardModal) {
      buttonbis.addEventListener('click', cardModule.showAddCardModal);
    }; 

    const createCard = document.querySelector('#formCard');
    createCard.addEventListener('submit', app.handleAddCardForm);

    document.getElementById('buttonDeleteAllList').addEventListener('click',listModule.deleteAllModal);

    document.getElementById('addTagButton').addEventListener('click', tagModule.showManageTagsModal);

    document.querySelector('#formTag').addEventListener('submit', tagModule.handleAddTagForm);

  },


  handleAddCardForm: (event) => {

     // J'empêche le comportement par défaut du formulaire (rechargement de la page)
     event.preventDefault();

     // on appel la méthode qui est dans listModule qui va gérer l'ajout des données
     cardModule.handleAddCardForm(event);
 
     // Une fois la liste ajouter dans le DOM, je cache mes modales
     app.hideModals();

  },


  handleAddListForm: (event) => {

    // J'empêche le comportement par défaut du formulaire (rechargement de la page)
    event.preventDefault();

    // on appel la méthode qui est dans cardModule qui va gérer l'ajout des données
    listModule.handleAddListForm(event);

    // Une fois la liste ajouter dans le DOM, je cache mes modales
    app.hideModals();

  },

  handleAddTagForm: (event) => {

    event.preventDefault();

    tagModule.handleAddTagForm(event);

    app.hideModals();

 },

  handleEditListForm: (selectedId, event) => {

    event.preventDefault();


    selectedId.querySelector('form').classList.add('is-hidden');  

    selectedId.querySelector('h2').classList.remove('is-hidden');


    listModule.handleEditListForm(selectedId, event);

  },

  handleEditCardForm: (selectedId, event) => {

    event.preventDefault();


    selectedId.querySelector('form').classList.add('is-hidden');  

    selectedId.querySelector('.title-card').classList.remove('is-hidden');


    cardModule.handleEditCardForm(selectedId, event);

  },

  handleEditTagForm: (selectedId, event) => {

    event.preventDefault();


    selectedId.querySelector('form').classList.add('is-hidden');  

    selectedId.querySelector('h2').classList.remove('is-hidden');


    tagModule.handleEditTagForm(selectedId, event);

  },


  
  hideModals: () => {

    const closeModal = document.querySelectorAll('.modal');

    for (modal of closeModal) {
      modal.classList.remove('is-active');
    };
    
  },

};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );

module.exports = app;