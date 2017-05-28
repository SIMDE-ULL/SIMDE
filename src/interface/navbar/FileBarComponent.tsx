import * as React from 'react';
import './FileBarComponent.scss';
declare var window: any;

export class FileBarComponent extends React.Component<any, any> {

   render() {
      return (<div className='filebar'>
         <nav className='navbar'>
            <ul className='nav navbar-nav'>
               <li className='dropdown'>
                  <a className='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>Archivo</a>
                  <ul className='dropdown-menu'>
                     <li><a onClick={() => { window['loadModal'](true); }}>Cargar</a></li>
                  </ul>
               </li>
            </ul>
            <ul className='nav navbar-nav'>
               <li className='dropdown'>
                  <a className='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>Ver</a>
                  <ul className='dropdown-menu'>
                     <li><a>Bloques Básicos</a></li>
                     <li><a>Código Secuencial</a></li>
                  </ul>
               </li>
            </ul>
            <ul className='nav navbar-nav'>
               <li className='dropdown'>
                  <a className='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>Configurar</a>
                  <ul className='dropdown-menu'>
                     <li><a onClick={() => { window['superConfigModal'](true); }}>Configurar Máquina Superescalar</a></li>
                     <li><a>Opciones</a></li>
                  </ul>
               </li>
            </ul>
            <ul className='nav navbar-nav'>
               <li className='dropdown'>
                  <a className='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>Ejecutar</a>
                  <ul className='dropdown-menu'>
                     <li><a>Iniciar</a></li>
                     <li><a>Pausa</a></li>
                     <li><a>Parar</a></li>
                     <li><a>Atrás</a></li>
                     <li><a>Adelante</a></li>
                  </ul>
               </li>
            </ul>
            <ul className='nav navbar-nav'>
               <li className='dropdown'>
                  <a className='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>Ayuda</a>
                  <ul className='dropdown-menu'>
                     <li><a href='http://demosimde.azurewebsites.net/docs/'>Documentación</a></li>
                     <li><a onClick={() => { window['autorModal'](true); }}>Acerca de...</a></li>
                  </ul>
               </li>
            </ul>
         </nav>
      </div>);
   }
}
