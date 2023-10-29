import React from 'react'
import './Main.css'
import InputMask from 'react-input-mask';


export default function Main() {
  return (
    <main>
        <div className='width-container'>
            <div class="center-text">
        <h2>Начните подготовку к английскому прямо сейчас!</h2>
        </div>
        <div className='container-wrapper'>
        <div class="container">
            <h3>Определим</h3>
            <p>ваш уровень знаний и подготовки</p>
        </div>
        <div class="container">
            <h3>Составим</h3>
            <p>индивидуальную программу обучения</p>
        </div>
        <div class="container">
            <h3>Поможем</h3>
            <p>не бросить занятия и продолжить обучение</p>
        </div>
        <div class="container">
            <h3>Подскажем</h3>
            <p>преподаватели ответят на все ваши вопросы</p>
        </div>
        <div class="container">
            <h3>Погрузим</h3>
            <p>в среду английского языка</p>
        </div>
        <div class="container">
            <h3>Замотивируем</h3>
            <p>улучшать свой прогресс и ослеживать его</p>
        </div>
        </div>
        </div>
    
   
    <div class='main-container'>
        <div class='width-container'>
            <div className='container-wrapper'>
            <div class="image-block">
                <img src="https://plus.unsplash.com/premium_photo-1661685751617-d51f9025f164?auto=format&fit=crop&q=80&w=1932&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Описание изображения"/>
            </div>
            <div class="text-block">
                <h2>План по подготовке 10-11 классов</h2>
                <p>Подготовка для учеников, желающих уже сейчас начать готовиться к ЕГЭ по английскому языку</p>
                <button className='btn-main'>Смотреть план</button>
            </div>
            </div>
        </div>
    </div>
    <div className='main-container white'>
            <div className='width-container'>
            <div className='container-wrapper'>
                <div className="image-block">
                <img src="https://s3-alpha-sig.figma.com/img/a2cb/e825/edc520f52833b210ce29ab66bfe69694?Expires=1699228800&Signature=MnAupntBrJXYUD1IHFzR14L2ENLHfBvUpiPXv8ZqChuwbeujDTJLXDOP440~nPffBf1G9qMkQXOK-XjmnkOzUcR-oCxOQJ42nj~PzVu9mmmmugenZJDR2ZqQg11cNsNJXiiEd9Aib2DnTACuKf8FwqkNDWnPO9KcmKBmt9P6MMoQ2AyQUutAeW9hATIEFHayDIP9WvN8USoGXxSjRaKHyaV2JeipeTZ7Y0OuW9Qm2ck33oHCFyiGl6DTnUBzyilwpeWUuHaXkNOpNIKTfzsqWfyLfa8HNsR3m7WjPjenHkDg0xiKDBoFKoofu1CFpWzrxQYAjwZlQyfXDJfHs3v6Vg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4" alt="Описание изображения"/>
                </div>
                <div className="text-block">
                <h2>Оставьте заявку на бесплатную консультацию</h2>
                <p>Наши консультанты свяжутся с вами в ближайшее время</p>
            <form>
            <div>
            <div>
            <label htmlFor="name"></label>
            <input type="text" id="name" name="name" placeholder="Введите ваше имя" />
            </div>
            <div>
            <label htmlFor="phone"></label>
            <InputMask
                mask="+7 (999) 999-99-99"
                maskChar="_"
                id="phone"
                name="phone"
                placeholder="+7 (999) 999-99-99"
            />
            </div>
            </div>
            <div className='btn-main-wrapper'>
                <button type="submit" className="btn-main">
            Отправить заявку
            </button>
            </div>
            
        </form>
                </div>
            </div>
            </div>
    </div>
    <div class='main-container'>
        <div class='width-container'>
            <div className='container-wrapper two'>
            <div class="text-block">
                <h2>Что пишут наши ученики</h2>
                <p>87% участников приходят по личной рекомендации от
друзей. А каждый 3 сдает ЕГЭ на 90+ баллов!</p>
                <button className='btn-main'>Читать отзывы</button>
            </div>
            <div class="image-block">
                <img src="https://plus.unsplash.com/premium_photo-1682310144714-cb77b1e6d64a?auto=format&fit=crop&q=80&w=2112&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Описание изображения"/>
            </div>
            </div>
        </div>
    </div>
</main>
  )
}