import React from 'react'
import './Header.css'
import { useState } from 'react';
import Modal from './Modal';

export default function Header() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const addActiveClass = () => {
    setIsModalOpen(true);
    
  };

   const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
      <header>
        <div className='navbar'>
          <span className='logo'>English</span>
          <div className='nav-list'>
            <ul>
              <li><a href='/'>Главная</a></li>
              <li><a href="/">Курсы</a></li>
              <li><a href="/">О нас</a></li>
              <li><a href="/">Контакты</a></li>
            </ul>
          </div>
          <div className='nav-btn'>
             <button className='btn-log' onClick={addActiveClass}>Войти</button>
            <button className='btn-sign'>Регистрация</button>
          </div>
        </div>
        <div className='presentation'>
          <div class="start-learning">Начать обучение</div>
        </div>
        <Modal isModalOpen={isModalOpen} closeModal={closeModal}/>
      </header>
  )
}
