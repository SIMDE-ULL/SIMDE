import * as React from "react";
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import projectpage from "./ProjectPageComponent";

const landingpage = (props) => (
  <div className="page">
    <div className="topnav">
      <ul className="navul">
        <b className="navbaricon"><img alt="icon" src="https://adiumxtras.com/images/pictures/futuramas_bender_dock_icon_1_8169_3288_image_4129.png"></img></b>
        <li className="pagetitle"><p>SIMDEWeb</p></li>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/Project">Proyecto</Link></li>
      </ul>
     </div>
     <div className="pagecontent">
       <div className="row">
        <div className=" architecture col-3 col-sm-12 col-md-12 col-lg-12">
          <div className="jumbotron">
            <div className="container">
              <h1>SIMDEWeb</h1>
              <p>Mucho más que un simulador...</p>
              <p><Link className="btn btn-primary btn-lg" to="/Project">Leer más</Link></p>
            </div>
          </div>
          <div className="thumbnail">
            <img src="" alt=""></img>
            <div className="caption">
              <h3>Superescalar</h3>
              <p>Simula el funcionamiento de una máquina superescalar ejecutando tu código paso a paso!</p>
              <div className="pagebtngroup">
                <Link className="btn btn-primary" to="/superescalares">Ir</Link><a className="pagebtn btn btn-default" href="https://etsiiull.gitbooks.io/simde/">Leer más</a>
              </div>
            </div>
          </div>
          <div className="thumbnail">
            <img src="" alt=""></img>
            <div className="caption">
              <h3>VLIW</h3>
              <p>Simula el funcionamiento de una máquina VLIW ejecutando tu código paso a paso!</p>
              <div className="pagebtngroup">
                <Link className="btn btn-primary" to="/VLIW">Ir</Link><a className="pagebtn btn btn-default" href="https://etsiiull.gitbooks.io/simde/">Leer más</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav className="footer navbar navbar-default navbar-fixed-bottom sticky">
      <div className="licence"><a>@liberado bajo licencia GPLv3</a></div>
    </nav>
    </div>
);

export default landingpage;
