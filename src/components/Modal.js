import React from 'react';
import InputMask from 'react-input-mask';

const Modal = ({ isModalOpen, closeModal }) => {
  const modalClasses = isModalOpen ? 'modal active' : 'modal'; 

  const closeOnContentClick = (e) => {
    e.stopPropagation(); // Предотвращаем "всплытие" события, чтобы оно не дотянулось до родителя
  };

  const handleCloseModal = () => {
    closeModal(); // Вызываем функцию closeModal переданную из родительского компонента
  };

  return (
    <div className={modalClasses} id="modal" onClick={handleCloseModal}>
      {isModalOpen && (
        <form>
          <div className='modal-content' onClick={closeOnContentClick}>
            <label htmlFor="name"></label>
            <input type="text" id="name" name="name" placeholder="Введите ваше имя" />
            <label htmlFor="phone"></label>
            <InputMask
              mask="+7 (999) 999-99-99"
              maskChar="_"
              id="phone"
              name="phone"
              placeholder="+7 (999) 999-99-99"
            />
            <div className='btn-main-wrapper'>
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
