const button = document.querySelector('#hello-button');
const message = document.querySelector('#message');

button.addEventListener('click', () => {
  message.textContent = 'Hello! You are learning CI/CD with GitHub Actions.';
});
