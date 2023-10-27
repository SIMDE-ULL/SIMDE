import * as React from "react";
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";


const ProjectPage = () => {
    const [t, _] = useTranslation();

    return (
      <div className="page">
        <div className="topnav">
          <ul className="navul">
            <b className="navbaricon"><img alt="icon" src="https://adiumxtras.com/images/pictures/futuramas_bender_dock_icon_1_8169_3288_image_4129.png"></img></b>
            <li className="pagetitle"><p>{t('landingPage.pagetitle')}</p></li>
            <li><Link to="/">{t('landingPage.home')}</Link></li>
            <li><Link to="/">{t('landingPage.project')}</Link></li>
          </ul>
         </div>
         <div className="pageproject">
           <h1>{t('projectPage.pagetitle')}</h1>
           <div className="simdegif"><img className="img-responsive" alt="simdegif" src="https://i.imgur.com/50m9kzv.gif"></img></div>
           <h2>{t('projectPage.watsimde')}</h2>
           <p>{t('projectPage.simdedescription1')}</p>
           <p>{t('projectPage.simdedescription2')}</p>
           <p>{t('projectPage.simdedescription3')}</p>
           <h2>{t('projectPage.tecnology')}</h2>
           <p>{t('projectPage.tecnologydescription')}</p>
           <h2>{t('projectPage.howtouse')}</h2>
           <Link to="/superescalar"><p>{t('projectPage.howtousedescription')}</p></Link>
           <h2>{t('projectPage.problems')}</h2>
           <a href="https://etsiiull.gitbooks.io/simde/"><p>{t('projectPage.problemsdescription')}</p></a>
         </div>
         <nav className="footer navbar navbar-default navbar-fixed-bottom sticky">
           <div className="licence text-light"><a>{t('projectPage.licency')}</a></div>
         </nav>
      </div>
    );
}

export default ProjectPage;
