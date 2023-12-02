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


  const imgBlock = document.getElementById('img-block')
  const modal = document.getElementById('modalContentImg');
  const closeModal = document.getElementById('close-modal-img');
  const btnMain = document.getElementById('saveChanges')
  const modalContent = document.querySelector(".modalContent")

  imgBlock.addEventListener('click', function () {
    modal.classList.add('active');
    modalContent.classList.add('active')
  });

  closeModal.addEventListener('click', function () {
    modalContent.classList.remove('active');
    modal.classList.remove('active');
  });


document.addEventListener('DOMContentLoaded', function () {
  const modalForm = document.querySelector('.modalContent');

  modalForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const profilePicAddressInput = document.getElementById('profilePicAddress');
    const newProfilePic = profilePicAddressInput.value;

    fetch('/change_profile_pic', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profilePicAddress: newProfilePic }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error(data.error);
      } else {
        console.log('Profile picture updated successfully');
      }
    })
    .catch(error => {
      console.error('Error updating profile picture:', error);
    });
  });
});
