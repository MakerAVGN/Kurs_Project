import React from 'react'
import { FaVk } from "react-icons/fa";
import './Footer.css'


export default function Footer() {
  return (
    <footer>
        <a href='/' className="vk-icon" ><FaVk /></a>
        <h4 className='team-name'> Разработано командой "EMGAME"</h4>
    </footer>
  )
}
