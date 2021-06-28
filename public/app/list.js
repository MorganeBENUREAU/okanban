const app = require ('./app');
const cardModule = require ('./card');
const tagModule = require ('./tag');
const Sortable = require ('sortablejs');


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
                        tagModule.makeTagInDOM(tag);
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