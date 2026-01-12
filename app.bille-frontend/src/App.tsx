import React, { FunctionComponent, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import './App.css';
import Calendar from './pages/calendar';
import CalendarDetails from './pages/calendar-details';
import CalendarUpdate from './pages/calendar-update';
import MyInfos from './pages/my-infos';
import Planification from './pages/planification';
import UserAdministration from './pages/users-administration';
import Login from './pages/login';
import UserConnexion from './helpers/user-connexion';
import Recap from './pages/recap';

// Nouveau composant pour gérer conditionnellement le layout
const AppContent: FunctionComponent = () => {
  const location = useLocation();

  useEffect(() => {
    const elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);
  }, []);

  const showHeader = location.pathname !== '/login';
  const myAdminLevel: number | null = UserConnexion.myAdminLevel() 

  return (
    <>
      {showHeader && myAdminLevel !== null &&(
        <>
          <div className="navbar-fixed">
            <nav>
              <div className="nav-wrapper">
                <a data-target="mobile-menu" className="sidenav-trigger right">
                  <i className="material-icons">menu</i>
                </a>
                <ul id="nav-mobile" className="left hide-on-med-and-down">                                 
                  { myAdminLevel === 1 ? <li className="tab"><Link to="/planification">Planification</Link></li> : null }
                  { myAdminLevel === 1 ? <li className="tab"><Link to="/users">Utilisateurs</Link></li> : null }   
                  { myAdminLevel === 1 ? <li className="tab"><Link to="/recap">Récap</Link></li> : null}
                  <li className="tab"><Link to='/calendar'>Calendrier</Link></li>
                  <li className="tab"><Link to="/myInfos">Mes infos</Link></li>
                </ul>
              </div>
            </nav>
          </div>
          <ul className="sidenav" id="mobile-menu">           
            { myAdminLevel === 1 ? <li><Link to="/planification">Planification</Link></li> : null }
            { myAdminLevel === 1 ? <li><Link to="/users">Utilisateurs</Link></li> : null }
            { myAdminLevel === 1 ? <li><Link to="/recap">Récap</Link></li> : null }
            <li><Link to="/calendar">Calendrier</Link></li>
            <li><Link to="/myInfos">Mes infos</Link></li>
          </ul>
        </>
      )}
      
      <Routes> 
        <Route path="/" element={<Navigate to="/calendar" replace />} />
        <Route path="/calendar" element={<Calendar />} >
          <Route path="details/:idShow" element={<CalendarDetails />} />
          <Route path="update/:idShow" element={<CalendarUpdate />} />
        </Route>
        <Route path='/myInfos' element={<MyInfos />} />
        <Route path='/planification' element={<Planification />} />
        <Route path='/users' element={<UserAdministration />} />
        <Route path="/login" element={<Login />} />
        <Route path='/recap' element={<Recap />} />
      </Routes>
    </>
  );
};

const App: FunctionComponent = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
