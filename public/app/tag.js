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


    showAssociateCardTagModal: async (event) => {

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

            for (const tag of tags) {
                const tagElm = document.createElement('span');

                tagElm.classList.add('tagItem');

                tagElm.setAttribute('data-tag-id', tag.id);
                tagElm.textContent = tag.name;
                tagElm.style.backgroundColor = tag.color;
                tagElm.style.marginRight = '5px';

                tagElm.addEventListener('click', tagModule.handleAssociateTagToCard);
                tagListElm.append(tagElm);

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
        tagElm.classList.add('tagItem');
        tagElm.style.backgroundColor = tag.color;
        tagElm.style.marginRight = '5px';

        document.querySelector(`[data-card-id="${cardId}"] .tags-list`).append(tagElm);

    },




};

// module.exports = tagModule;