document.addEventListener('DOMContentLoaded', function () {
  const modal = document.querySelector('.modal');
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
    }, 500); // Добавлено время анимации в миллисекундах
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const loginModal = document.getElementById('loginModal');
  const registerModal = document.getElementById('registerModal');
  const btnSign = document.querySelector('.btn-Sign');
  const btnRegister = document.querySelector('.btn-register');
  const closeModal = document.querySelector('.close-modal');

  btnSign.addEventListener('click', function () {
    loginModal.classList.add('active');
  });

  btnRegister.addEventListener('click', function () {
    registerModal.classList.add('active');
  });

  closeModal.addEventListener('click', function () {
    loginModal.classList.remove('active');
    registerModal.classList.remove('active');
  });
});


    function submitForm() {
      const form = document.getElementById('loginForm');
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const errorMessage = document.getElementById('error-message');
      const modal = document.querySelector('modal'); // Добавили эту строку

      // Очищаем предыдущие сообщения об ошибке
      errorMessage.textContent = '';

      // Отправляем POST-запрос
      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Пользователь не найден');
          }
          return response.json();
        })
        .then(data => {
          // Обработка успешного ответа
          console.log('Успешно:', data);
        })
        .catch(error => {
          // Обработка ошибки
          errorMessage.textContent = error.message;
        })
        .finally(() => {
          // Убираем класс active после завершения запроса
          modal.classList.remove('active');
        });
    }
