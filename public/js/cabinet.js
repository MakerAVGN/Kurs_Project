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
    const modalForm = document.getElementById('changeProfilePicForm');
  
    modalForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const profilePicAddressInput = document.getElementById('profilePicAddress');
      const newProfilePic = profilePicAddressInput.value;
  
      fetch('/cabinet/change_profile_pic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profilePicAddress: newProfilePic }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Response from server:', data);
  
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


  
  
  
  
