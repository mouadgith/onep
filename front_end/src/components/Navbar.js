// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaBars, FaTimes } from 'react-icons/fa';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [click, setClick] = useState(false);

//   const handleClick = () => setClick(!click);
//   const openPage = () => setClick(false);

//   const handleCon = () => {
//     navigate('/contact'); 
//   };

//   return (
//     <div className='header max-w-[1920px]'>
//       <ul className={click ? 'Nav-menu active' : 'Nav-menu'}>
//         <li><Link to="/" onClick={openPage}>Agent</Link></li>
//         <li><Link to="/materiels" onClick={openPage}>Materiel</Link></li>
//         <li><Link to="/sortie" onClick={openPage}>contrat</Link></li>
//         <li><Link to="/entree" onClick={openPage}>Parammetrage</Link></li>
//       </ul>

//       <div className='openNav' onClick={handleClick}>
//         {click ? <FaTimes size={28} /> : <FaBars size={28} />}
//       </div>

//       <div className='nav-btns'>
//         <button className='nav-btn' onClick={handleCon}>Contact</button>
//       </div>
//     </div>
//   );
// };

// export default Navbar;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const openPage = () => setClick(false);

  const handleCon = () => {
    navigate('/contact'); 
  };

  return (
    <div className='header max-w-[1920px]'>
      <ul className={click ? 'Nav-menu active' : 'Nav-menu'}>
        <li><Link to="/" onClick={openPage}>Agent</Link></li>
        <li><Link to="/materiels" onClick={openPage}>Materiel</Link></li>
        <li><Link to="/contrats" onClick={openPage}>Contrats</Link></li>
        <li><Link to="/parametrage" onClick={openPage}>Paramétrage</Link></li>
      </ul>

      <div className='openNav' onClick={handleClick}>
        {click ? <FaTimes size={28} /> : <FaBars size={28} />}
      </div>

      <div className='nav-btns'>
        <button className='nav-btn' onClick={handleCon}>Contact</button>
      </div>
    </div>
  );
};

export default Navbar;