let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};

  const imgUserBlock = document.getElementById('userBlock');
const modalImg = document.getElementById('modal-img');
const modalContentImg = document.querySelector('.modal-content-img'); // обновлено
const closeModalImg = document.getElementById('closeModalImg');

imgUserBlock.addEventListener('click', function () {
  modalImg.classList.add('active');
});

closeModalImg.addEventListener('click', function () {
  modalContentImg.classList.remove('active');
  setTimeout(() => {
    modalImg.classList.remove('active');
  }, 500);
});



function submitProfilePicForm() {
  const profilePicAddress = document.getElementById('profilePicAddress').value;
  const errorMessage = document.getElementById('error-message');

  // Очищаем предыдущие сообщения об ошибке
  errorMessage.textContent = '';

  const formData = new FormData();
  formData.append('profilePicAddress', profilePicAddress);

  fetch('/change_profile_pic', {
    method: 'PATCH',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    body: formData,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        // Обработка успешного ответа
        console.log(data.message);
      } else {
        // Обработка других случаев, при необходимости
        console.error('Не удалось обновить фотографию профиля:', data.error);
      }
    })
    .catch(error => {
      // Обработка ошибок
      console.error('Fetch error:', error);
    });
}