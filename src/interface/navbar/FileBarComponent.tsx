import * as React from 'react';
import './FileBarComponent.scss';
declare var window: any;

export class FileBarComponent extends React.Component<any, any> {

   private color: boolean;
   constructor() {
      super();
      this.color = false;
   }

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
                     <li><a onClick={() => {
                        this.color = !this.color;
                        window['colorBlocks'](this.color);
                     }}>Bloques Básicos</a></li>
                  </ul>
               </li>
            </ul>
            <ul className='nav navbar-nav'>
               <li className='dropdown'>
                  <a className='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>Configurar</a>
                  <ul className='dropdown-menu'>
                     <li><a onClick={() => { window['superConfigModal'](true); }}>Configurar Máquina Superescalar</a></li>
                     <li><a onClick={() => { window['options'](true); }}>Opciones</a></li>
                  </ul>
               </li>
            </ul>
            <ul className='nav navbar-nav'>
               <li className='dropdown'>
                  <a className='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>Ejecutar</a>
                  <ul className='dropdown-menu'>
                     <li onClick={() => window.play()}><a>Iniciar</a></li>
                     <li onClick={() => window.pause()}><a>Pausa</a></li>
                     <li onClick={() => window.stop()}><a>Parar</a></li>
                     <li onClick={() => window.stepBack()}><a>Atrás</a></li>
                     <li onClick={() => window.superStep()}><a>Adelante</a></li>
                  </ul>
               </li>
            </ul>
            <ul className='nav navbar-nav'>
               <li className='dropdown'>
                  <a className='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>Ayuda</a>
                  <ul className='dropdown-menu'>
                     <li><a href='http://adrianabreu.com/SIMDE-Docs/' target='_blank'>Documentación</a></li>
                     <li><a onClick={() => { window['autorModal'](true); }}>Acerca de...</a></li>
                  </ul>
               </li>
            </ul>
         </nav>
      </div>);
   }
}
