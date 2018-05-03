import * as React from "react";
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

const projectpage = (props) => (
  <div className="page">
    <div className="topnav">
      <ul className="navul">
        <b className="navbaricon"><img alt="icon" src="https://adiumxtras.com/images/pictures/futuramas_bender_dock_icon_1_8169_3288_image_4129.png"></img></b>
        <li className="pagetitle"><p>SIMDEWeb</p></li>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/">Proyecto</Link></li>
      </ul>
     </div>
     <div className="pageproject">
       <h1>SIMDEWeb</h1>
       <div className="simdegif"><img alt="simdegif" src="https://i.imgur.com/50m9kzv.gif"></img></div>
       <h2>¿Qué es SIMDEWeb?</h2>
       <p>SIMDE es un simulador para apoyar la enseñanza de arquitecturas ILP (Paralelismo de nivel de instrucción).</p>
       <p>Este simulador es una representación visual de una ejecución de máquina Superecalar y los estudiantes pueden ver cómo las instrucciones se mueven a través de las múltiples etapas de la tubería.</p>
       <p>Esto hace más fácil aprender conceptos tales como el algoritmo de Tomasulo y el propósito de estructuras tales como el buffer de reorden.</p>
       <h2>Tecnologías</h2>
       <p>SIMDE esta desarrollado con TypeScript, React, Redux, Sass y Webpack.</p>
       <h2>¿Cómo se usa?</h2>
       <Link to="/superescalares"> Prueba y aprende! </Link>
       <h2>¿Problemas?</h2>
       <a href="https://etsiiull.gitbooks.io/simde/"> Puedes consultar nuestra documentación </a>
     </div>
     <nav className="footer navbar navbar-default navbar-fixed-bottom sticky">
       <div className="licence"><a>@liberado bajo licencia GPLv3</a></div>
     </nav>
  </div>
);

export default projectpage;
