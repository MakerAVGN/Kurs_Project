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
  const modalContentImg = document.querySelector('modalContentImg');
  const closeModalImg = document.getElementById('closeModalImg');

  imgUserBlock.addEventListener('click', function () {
    modalImg.classList.add('active');
    modalContentImg.classList.add('active');
  });

  closeModalImg.addEventListener('click', function () {
    modalContentImg.classList.remove('active');
    setTimeout(() => {
      modalImg.classList.remove('active');
    }, 500);
  });