const app = require ('./app');
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
