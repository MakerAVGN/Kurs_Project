document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('modal-log');
  const btnLog = document.querySelector('.btn-log');
  const closeModal = document.querySelector('.close-modal');
  const modalContent = document.querySelector('.modal-content');

  btnLog.addEventListener('click', function () {
    modal.classList.add('active');
    modalContent.classList.add('active');
  });

  closeModal.addEventListener('click', function () {
    modalContent.classList.remove('active');
    setTimeout(() => {
      modal.classList.remove('active');
    }, 500);
  });

  const loginButton = document.querySelector('.btn-modal');
  loginButton.addEventListener('click', submitForm);

  const btnSign = document.getElementById('btn-sign');
  const startLesson = document.getElementById('start-lesson');
  const modalSign = document.getElementById('modal-sign');
  const modalContentSign = document.querySelector('.modal-content-sign');
  const closeModalSign = document.querySelector('.close-modal-sign');

  btnSign.addEventListener('click', function () {
    modalSign.classList.add('active');
    modalContentSign.classList.add('active');
  });

  closeModalSign.addEventListener('click', function () {
    modalContentSign.classList.remove('active');
    setTimeout(() => {
      modalSign.classList.remove('active');
    }, 500);
  });

  startLesson.addEventListener('click', function () {
    modalSign.classList.add('active');
    modalContentSign.classList.add('active');
  });

  closeModalSign.addEventListener('click', function () {
    modalContentSign.classList.remove('active');
    setTimeout(() => {
      modalSign.classList.remove('active');
    }, 500);
  });
});

// Функция отправки формы
function submitForm() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');

  // Очищаем предыдущие сообщения об ошибке
  errorMessage.textContent = '';

  fetch('/cabinet', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify({ email, password }),
  })
  .then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
})
.then(data => {
  // Обработка успешного ответа
})
.catch(error => {
  // Обработка ошибок
  console.error('Fetch error:', error);
});
}