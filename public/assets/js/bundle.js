(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{"./card":2,"./list":3,"./tag":4}],2:[function(require,module,exports){
const tagModule = require ('./tag');



const cardModule = {

    base_url: null,

    setBaseUrl(url) {
        cardModule.base_url = `${url}/cards`;
    },

    showAddCardModal: (event) => {
        const divModal = document.getElementById('addCardModal');
        divModal.classList.add('is-active');

        const listId = event.target.closest('.panel').getAttribute('data-list-id');

        const inputListId = divModal.querySelector('input[type="hidden"]');
        inputListId.value = listId;
    },

    handleAddCardForm: async (event) => {

        const formDataCard = new FormData(event.target);

        try {

            const response = await fetch(cardModule.base_url, {
                method: 'POST',
                body: formDataCard
            });

            if (!response.ok) {
                throw new Error(response.status);
            }

            const card = await response.json();


            cardModule.makeCardInDOM(card);

        } catch (error) {
            alert(error);
        };

    },

    makeCardInDOM: (cardInputInfo) => {

        const cardTemplate = document.querySelector('#card-template');
        const cardClone = document.importNode(cardTemplate.content, true);

        const trueBox = cardClone.querySelector('.box');
        trueBox.style.backgroundColor = cardInputInfo.color;

        const cloneCardTitle = cardClone.querySelector('.title-card');
        cloneCardTitle.textContent = cardInputInfo.title;
        // console.log(cardInputInfo.title);

        const selectedList = document.querySelector(`[data-list-id = "${cardInputInfo.list_id}"]`);
        // console.log(selectedList);

        const selectedCardId = cardClone.querySelector(`[data-card-id]`);
        selectedCardId.dataset.cardId = cardInputInfo.id;

        cardClone.querySelector('.pencil').addEventListener('click', cardModule.showFormEditCard);

        cardClone.querySelector('#delete-card').addEventListener('click', cardModule.deleteModal);

        cardClone.querySelector('#btnAssociateTag').addEventListener('click', tagModule.showAssociateCardTagModal);


        selectedList.querySelector('.panel-block').append(cardClone);


    },

    showFormEditCard: (event) => {

        const selectedList = event.target.closest('.panel');

        const selectCard = event.target.closest('.box');

        const showForm = selectCard.querySelector('form');
        showForm.classList.remove('is-hidden');

        selectCard.querySelector('.title-card').classList.add('is-hidden');

        const inputHidden = showForm.querySelector('input[type="hidden"]');
        inputHidden.value = selectedList.dataset.listId;
        // console.log(selectedList.dataset.listId);
        // console.log(showForm);

        showForm.addEventListener('submit', (event) => {
            app.handleEditCardForm(selectCard, event)
        })

        showForm.querySelector('.close').addEventListener('click', () => {
            showForm.classList.add('is-hidden');
            selectCard.querySelector('.title-card').classList.remove('is-hidden');
        })

    },

    handleEditCardForm: async (selectedList, event) => {

        const formData = new FormData(event.target);
        // console.log(Object.fromEntries.formData);
        const id = selectedList.dataset.cardId;
        // console.log(id);

        try {

            const response = await fetch(cardModule.base_url + `/${id}`, {
                method: 'PATCH',
                body: formData
            });

            if (!response.ok) {
                throw new Error(response.status);
            }

            const card = await response.json();

            // selectedList.querySelector(`[data-list-id = "${id}"]`);
            // console.log(selectedList);

            selectedList.querySelector('.title-card').textContent = card.title;

            selectedList.style.backgroundColor = card.color;



        } catch (error) {
            alert(error);
        };

    },

    deleteCard: async (event) => {

        const cardToDelete = event.target.closest('.modal').querySelector('input').value;

        try {
            const response = await fetch(cardModule.base_url + `/${cardToDelete}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(response.status);
            }
            cardModule.deleteCardInDOM(cardToDelete);
        } catch (error) {
            alert(error);
        }
    },


    deleteCardInDOM: async (id) => {

        const cardToDelete = document.querySelector(`[data-card-id="${id}"]`);
        cardToDelete.remove();

        document.querySelector('#deleteCard').classList.remove('is-active');
    },

    deleteModal(event) {

        document.querySelector('#deleteCard').classList.add('is-active');

        const inputValue = event.target.closest('.box').getAttribute('data-card-id');
        const cardInput = document.querySelector('#deleteCard');

        cardInput.querySelector('#deleteCardInput').value = `${inputValue}`;
        cardInput.querySelector('.danger').addEventListener('click', cardModule.deleteCard);
    }

};

module.exports = cardModule;

},{"./tag":4}],3:[function(require,module,exports){
const app = require ('./app');
const cardModule = require ('./card');
const tagModule = require ('./tag');
// const Sortable = require ('sortablejs');


const listModule = {

    base_url: null,

    setBaseUrl(url) {
        listModule.base_url = `${url}/lists`;
    },

    getListsFromAPI: async () => {
        try {
            const response = await fetch(listModule.base_url, {
                method: 'GET'
            })

            const lists = await response.json();

            for (const list of lists) {
                listModule.makeListInDOM(list);

                for (const card of list.cards) {
                    cardModule.makeCardInDOM(card);
                    for (const tag of card.tags) {
                        tagModule.makeTagInDOM(tag, card.id);
                    }
                }
            }

            // Pour drag and droper
            const cardListElm = document.querySelector('.card-lists');
            new Sortable(cardListElm, {
                animation: 300,
                onEnd: listModule.handleDropList
            })

        } catch (error) {
            alert(error);
        }
    },

    showAddListModal: () => {
        const idDivModal = document.getElementById('addListModal');
        idDivModal.classList.add('is-active');
    },

    handleAddListForm: async (event) => {

        const formData = new FormData(event.target);

        try {
            // Je précise ici la method utiliser (POST) ainsi que les données à envoyer dans le body de ma requête
            const response = await fetch(listModule.base_url, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(response.status);
            }
            // Je récupère la nouvelle liste fraichement créer
            const list = await response.json();

            // J'appelle la fonction qui va créer le HTML de ma liste en passant en paramètre les informations de la liste
            listModule.makeListInDOM(list);

        } catch (error) {
            alert(error);
        };

    },

    showFormEditList: (event) => {

        const selectedList = event.target.closest('.panel');

        const classEditForm = selectedList.querySelector('form');
        classEditForm.classList.remove('is-hidden');

        const rename = selectedList.querySelector('h2');
        rename.classList.add('is-hidden');

        const inputHidden = classEditForm.querySelector('input[type="hidden"]');
        inputHidden.value = selectedList.dataset.listId;
        // console.log(selectedList.dataset.listId);
        // console.log(classEditForm);

        classEditForm.addEventListener('submit', (event) => {
            app.handleEditListForm(selectedList, event)
        })
    },

    handleEditListForm: async (selectedList, event) => {

        const formData = new FormData(event.target);
        // console.log(Object.fromEntries.formData);
        const id = formData.get('list-id');
        // console.log(id);

        try {

            const response = await fetch(listModule.base_url + `/${id}`, {
                method: 'PATCH',
                body: formData
            });

            if (!response.ok) {
                throw new Error(response.status);
            }

            const list = await response.json();

            // selectedList.querySelector(`[data-list-id = "${id}"]`);
            // console.log(selectedList);

            selectedList.querySelector('h2').textContent = list.name;


        } catch (error) {
            alert(error);
        };

    },

    makeListInDOM: (list) => {
        const template = document.querySelector('#list-template');
        const clone = document.importNode(template.content, true);

        const cloneTitle = clone.querySelector('.title-list');
        cloneTitle.textContent = list.name;

        const SelectedListId = clone.querySelector(`[data-list-id]`);
        SelectedListId.dataset.listId = list.id;

        const listContainer = document.querySelector('.card-lists');

        const buttonPlus = clone.querySelector('.plus-sign');
        buttonPlus.addEventListener('click', cardModule.showAddCardModal);

        const editNameList = clone.querySelector('.title-list');
        editNameList.addEventListener('dblclick', listModule.showFormEditList);

        clone.querySelector('#delete-list').addEventListener('click', listModule.deleteModal);

        listContainer.append(clone);

    },

    deleteList: async (event) => {

        const listToDelete = event.target.closest('.modal').querySelector('input').value;

        try {
            const response = await fetch(listModule.base_url + `/${listToDelete}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(response.status);
            }
            listModule.deleteListInDOM(listToDelete);
        } catch (error) {
            alert(error);
        }
    },


    deleteListInDOM: async (id) => {

        const listToDelete = document.querySelector(`[data-list-id="${id}"]`);
        listToDelete.remove();

        document.querySelector('#deleteList').classList.remove('is-active');
    },

    deleteModal(event) {

        document.querySelector('#deleteList').classList.add('is-active');

        const inputValue = event.target.closest('.panel').getAttribute('data-list-id');
        const listInput = document.querySelector('#deleteList');

        listInput.querySelector('#deleteListInput').value = `${inputValue}`;
        listInput.querySelector('.danger').addEventListener('click', listModule.deleteList);
    },

    deleteAllModal: () => {

        document.querySelector('#deleteAllList').classList.add('is-active');

        const listInput = document.querySelector('#deleteAllList');

        listInput.querySelector('.button.danger').addEventListener('click', listModule.deleteAllLists);

    },

    deleteAllLists: async () => {

        app.hideModals();

        try {
            const response = await fetch(listModule.base_url, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(response.status);
            }

            document.querySelector('.card-lists').textContent = "";

        } catch (error) {
            alert(error);
        }

    },

    handleDropList: (event) => {

        // Pour enregistrer le drag and drop en BDD
        const listElms = event.target.querySelectorAll('[data-list-id]');
        //event.from -- au niveau des cartes pr de D et G
        //event.to
        for (const [position, listElm] of listElms.entries()) {
            const listId = listElm.getAttribute('data-list-id');
            const formData = new FormData();
            formData.set('position', position);
            fetch(`${listModule.base_url}/${listId}`, {
                method: 'PATCH',
                body: formData
            });

        }

    }


};

module.exports = listModule;
},{"./app":1,"./card":2,"./tag":4}],4:[function(require,module,exports){


const tagModule = {

    base_url: null,

    setBaseUrl(url) {
        tagModule.base_url = `${url}`;
    },

    showManageTagsModal() {
        
        document.getElementById('addTagModal').classList.add('is-active');
    },

    handleAddTagForm: async (event) => {

        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        try {

            const response = await fetch(`${tagModule.base_url}/tags`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(response.status);
            }

            const tag = await response.json();


        } catch (error) {
            alert(error);
        };

    },

    // showAddTagModal: (event) => {

    //     const divModal = document.getElementById('addTagModal');
    //     divModal.classList.add('is-active');

    //     divModal.querySelector('.is-success').addEventListener('click', tagModule.showFormAddTag)
    // },



    // showFormAddTag: (event) => {

    //     const selectedCard = event.target.closest('.box');

    //     const selectTag = event.target.closest('.tag');

    //     const showForm = selectTag.querySelector('form');
    //     showForm.classList.remove('is-hidden');

    //     selectTag.querySelector('.title-tag').classList.add('is-hidden');

    //     const inputHidden = showForm.querySelector('input[type="hidden"]');
    //     inputHidden.value = selectedCard.dataset.cardId;
    //     // console.log(selectedList.dataset.listId);
    //     // console.log(showForm);

    //     showForm.addEventListener('submit', (event) => {
    //         app.handleEditTagForm(selectTag, event)
    //     })

    //     showForm.querySelector('.close').addEventListener('click', () => {
    //         showForm.classList.add('is-hidden');
    //         selectTag.querySelector('.title-tag').classList.remove('is-hidden');
    //     })
    // },

    // handleEditTagForm: async (selectedTag, event) => {

    //     const formData = new FormData(event.target);
    //     // console.log(Object.fromEntries.formData);
    //     const id = selectedTag.dataset.tagId;
    //     // console.log(id);

    //     try {

    //         const response = await fetch(tagModule.base_url + `/${id}`, {
    //             method: 'PATCH',
    //             body: formData
    //         });

    //         if (!response.ok) {
    //             throw new Error(response.status);
    //         }

    //         const tag = await response.json();

    //         // selectedList.querySelector(`[data-list-id = "${id}"]`);
    //         // console.log(selectedList);

    //         selectedTag.querySelector('.title-tag').textContent = tag.title;

    //         selectedTag.style.backgroundColor = tag.color;



    //     } catch (error) {
    //         alert(error);
    //     };

    // },

    async showAssociateCardTagModal(event) {

        console.log('je suis dans showtruc')
        const cardId = event.target;
        cardId.closest('[data-card-id]');
        cardId.getAttribute('data-card-id');

        const modalElm = document.getElementById('addAssociationTagModal');

        modalElm.classList.add('is-active');

        try {
            
            const response = await fetch(`${tagModule.base_url}/tags`);

            if (!response.ok) {
                throw new Error(response.status);
            }

            const tags = await response.json();
            const tagListElm = modalElm.querySelector('.tags-list');

            tagListElm.setAttribute('data-card-id', cardId);
            tagListElm.textContent = '';

            console.log('avant for')
            for (const tag of tags) {
                const tagElm = document.createElement('span');

                tagElm.classList.add('tagItem');

                tagElm.setAttribute('data-tag-id', tag.id);
                tagElm.textContent = tag.name;
                tagElm.style.backgroundColor = tag.color;
                tagElm.style.marginRight = '5px';

                tagElm.addEventListener('click', tagModule.handleAssociateTagToCard);
                console.log('coucou avant tag')
                tagListElm.append(tagElm);
                console.log('coucou apres tag')
            }
        } catch (e) {
            alert(e);
        }
    },

    async handleAssociateTagToCard(event) {
        const tagElm = event.currentTarget;
        const tagId = tagElm.getAttribute('data-tag-id');
        const cardId = tagElm.closest('[data-card-id]').getAttribute('data-card-id');

        try {
            const formData = new FormData();
            formData.set('tag_id', tagId);

            const response = await fetch(`${tagModule.base_url}/cards/${cardId}/tags`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(response.status);
            }

            const responseGetTag = await fetch(`${tagModule.base_url}/tags/${tagId}`);

            if (!responseGetTag.ok) {
                throw new Error(responseGetTag.status);
            }

            const tag = await responseGetTag.json();

            tagModule.makeTagInDOM(tag, cardId);
        } catch (e) {
            alert(e);
        }
    },

    makeTagInDOM(tag, cardId) {

        const tagElm = document.createElement('span');

        tagElm.setAttribute('data-tag-id', tag.id);
        tagElm.textContent = tag.name;
        tagElm.style.backgroundColor = tag.color;
        tagElm.style.marginRight = '5px';

        document.querySelector(`[data-card-id="${cardId}"] .tags-list`).append(tagElm);


        // ptete j'en aurais besoin plus tard
        // const template = document.querySelector('#tag-template');
        // const clone = document.importNode(template.content, true);

        // const selectedTagId = clone.querySelector(`[data-tag-id]`);
        // selectedTagId.setAttribute('data-tag-id', tag.id);

        // clone.querySelector('.name').textContent = tag.name;

        // clone.querySelector('.name').style.backgroundColor = tag.color;

        // document.querySelector(`[data-card-id="${tag.card_has_tag.card_id}"]`).append(clone);
    },


    // deleteCard: async (event) => {

    //     const cardToDelete = event.target.closest('.modal').querySelector('input').value;

    //     try {
    //         const response = await fetch(cardModule.base_url + `/${cardToDelete}`, {
    //             method: 'DELETE',
    //         });
    //         if (!response.ok) {
    //             throw new Error(response.status);
    //         }
    //         cardModule.deleteCardInDOM(cardToDelete);
    //     } catch (error) {
    //         alert(error);
    //     }
    // },


    // deleteCardInDOM: async (id) => {

    //     const cardToDelete = document.querySelector(`[data-card-id="${id}"]`);
    //     cardToDelete.remove();

    //     document.querySelector('#deleteCard').classList.remove('is-active');
    // },

    // deleteModal(event) {

    //     document.querySelector('#deleteCard').classList.add('is-active');

    //     const inputValue = event.target.closest('.box').getAttribute('data-card-id');
    //     const cardInput = document.querySelector('#deleteCard');

    //     cardInput.querySelector('#deleteCardInput').value = `${inputValue}`;
    //     cardInput.querySelector('.danger').addEventListener('click', cardModule.deleteCard);
    // }

};

module.exports = tagModule;

},{}]},{},[1]);
