import React from "react";
import InputMask from "react-input-mask";
import axios from "axios";
import './Modal.css'

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
          <h2>Авторизация</h2>
            <label htmlFor="name">Ваш логин</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="login"
              required
            />
            <label htmlFor="phone">Ваш телефон</label>
            <InputMask
              mask="+7 (999) 999-99-99"
              maskChar="_"
              id="phone"
              name="phone"
              placeholder="+7 (999) 999-99-99"
              required
            />
            <div className="btn-modal-wrapper">
              <button type="submit" className="btn-modal">
                Войти
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Modal;
