import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');
const delayInput = document.querySelector('[name="delay"]');
const stateInputs = document.querySelectorAll('[name="state"]');

form.addEventListener('submit', formSubmit);

function formSubmit(event) {
  event.preventDefault();
  const delay = parseInt(delayInput.value);
  const selectedState = getSelectedState();

  if (!delay || !selectedState) {
    showNotification('error', 'Please enter valid delay and select state');
    return;
  }
  
  makePromise(delay, selectedState).then(delay => {
      showNotification('success', `✅ Fulfilled promise in ${delay}ms`);
    })
    .catch(delay => {
      showNotification('error', `❌ Rejected promise in ${delay}ms`);
    });

  form.reset();
}

function getSelectedState() {
    const selectedInput = Array.from(stateInputs).find(input => input.checked);
    return selectedInput ? selectedInput.value : null;
}

function makePromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      state === 'fulfilled' ? resolve(delay) : reject(delay);
    }, delay);
  });
}

function showNotification(type, message) {
  iziToast[type]({
    message,
    position: 'topRight',
    timeout: 7000,
    progressBar: false,
    closeOnClick: true
  });
}