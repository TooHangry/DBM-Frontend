// Precondition: The div element to 'open'
// Postcondition: Changes the styling on the element
export const openModal = (modal: HTMLDivElement) => {
    modal.style.transform = 'scale(1)';
    setTimeout(() => {
        modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    }, 250);
}

// Precondition: The div element to 'close'
// Postcondition: Changes the styling on the element
export const closeModal = (modal: HTMLDivElement) => {
    modal.style.backgroundColor = 'rgba(0,0,0,0)';
    setTimeout(() => {
        modal.style.transform = 'scale(0)';
    }, 150)
}