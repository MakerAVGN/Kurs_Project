import React from "react";
import InputMask from "react-input-mask";
import axios from "axios";

const Modal = ({ isModalOpen, closeModal }) => {
  const modalClasses = isModalOpen ? "modal active" : "modal";

  const closeOnContentClick = (e) => {
    e.stopPropagation(); // Предотвращаем "всплытие" события, чтобы оно не дотянулось до родителя
  };

  const handleCloseModal = () => {
    closeModal(); // Вызываем функцию closeModal переданную из родительского компонента
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/submit-form",
        data
      );
      if (response.statusCode === 200) {
        console.log("Success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={modalClasses} id="modal" onClick={handleCloseModal}>
      {isModalOpen && (
        <form onSubmit={handleSubmit}>
          <div className="modal-content" onClick={closeOnContentClick}>
            <label htmlFor="name"></label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Введите ваше имя"
            />
            <label htmlFor="phone"></label>
            <InputMask
              mask="+7 (999) 999-99-99"
              maskChar="_"
              id="phone"
              name="phone"
              placeholder="+7 (999) 999-99-99"
            />
            <div className="btn-main-wrapper">
              <button type="submit" className="btn-main">
                Отправить заявку
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Modal;
