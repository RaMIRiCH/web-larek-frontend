import './scss/styles.scss';
import { initModalCloseHandlers } from './types/modal';
import './types/catalog'
import './types/basket'

document.addEventListener('DOMContentLoaded', () => {
    initModalCloseHandlers()
})