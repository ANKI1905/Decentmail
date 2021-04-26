import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './Sidebar.css';
import { IconContext } from 'react-icons';
import logo from './logo.jpeg'
function Sidebar() {
  const [sidebar] = useState(true);


  return (
    <>
      <IconContext.Provider value={{ color: '#262626' }}>
      
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
       
          <ul className='nav-menu-items'>
          <img src={logo} alt="Logo" />
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Sidebar;