import { Api } from '../components/base/api';
import { IProduct, ApiListResponse } from './index';
import { API_URL, CDN_URL } from '../utils/constants';
import { openModal, closeModal, initModalCloseHandlers } from './modal';
import { addToBasket, renderBasket } from './basket';

const api = new Api(API_URL);

api.get('/product')
    .then((data: ApiListResponse<IProduct>) => {
        renderCatalog(data.items);
        initModalCloseHandlers();
    })
    .catch((err) => console.error('Ошибка загрузки товаров:', err));

function renderCatalog(products: IProduct[]) {
    const container = document.querySelector('.gallery');
    const template = document.getElementById('card-catalog') as HTMLTemplateElement;

    products.forEach((product) => {
        const card = template.content.cloneNode(true) as HTMLElement;

        const category = card.querySelector('.card__category')!;
        category.textContent = product.category;
        category.className = `card__category card__category_${categoryClass(product.category)}`;

        const title = card.querySelector('.card__title')!;
        title.textContent = product.title;

        const image = card.querySelector('.card__image') as HTMLImageElement;
        image.src = `${CDN_URL}${product.image}`;
        image.alt = product.title;

        const price = card.querySelector('.card__price')!;
        price.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';

        const cardButton = card.querySelector('.card') as HTMLElement;
        cardButton.dataset.id = product.id;

        cardButton.addEventListener('click', () => openProductModal(product));

        container?.append(card);
    });
}

function openProductModal(product: IProduct) {
    const modal = document.getElementById('modal-container')!;
    const content = modal.querySelector('.modal__content')!;
    const template = document.getElementById('card-preview') as HTMLTemplateElement;
    const preview = template.content.cloneNode(true) as HTMLElement;

    (preview.querySelector('.card__category') as HTMLElement).textContent = product.category;
    (preview.querySelector('.card__category') as HTMLElement).className = `card__category card__category_${categoryClass(product.category)}`;
    (preview.querySelector('.card__title') as HTMLElement).textContent = product.title;
    (preview.querySelector('.card__text') as HTMLElement).textContent = product.description ?? '';
    (preview.querySelector('.card__image') as HTMLImageElement).src = `${CDN_URL}${product.image}`;
    (preview.querySelector('.card__image') as HTMLImageElement).alt = product.title;
    (preview.querySelector('.card__price') as HTMLElement).textContent = product.price ? `${product.price} синапсов` : 'Бесценно';

    const buyBtn = preview.querySelector('.card__button') as HTMLElement;
        buyBtn.addEventListener('click', () => {
        addToBasket(product);
        closeModal(modal);
    });

    content.innerHTML = '';
    content.append(preview);
    openModal(modal);
}

document.querySelector('.header__basket')?.addEventListener('click', () => {
    renderBasket();
});

function categoryClass(category: string): string {
    switch (category) {
        case 'софт-скил': return 'soft';
        case 'хард-скил': return 'hard';
        case 'дополнительное': return 'additional';
        case 'другое': return 'other';
        case 'кнопка': return 'button';
        default: return 'other';
    }
}
