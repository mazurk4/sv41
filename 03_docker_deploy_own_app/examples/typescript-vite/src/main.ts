const button = document.querySelector<HTMLButtonElement>('#button')!;
const countLabel = document.querySelector<HTMLSpanElement>('#count')!;

let count: number = 0;

button.addEventListener('click', () => {
    count++;
    countLabel.textContent = String(count);
});
