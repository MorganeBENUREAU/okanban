

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
