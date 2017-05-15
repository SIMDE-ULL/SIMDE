import * as React from 'react';
declare var window: any;

export class AccessBarComponent extends React.Component<any, any> {

   stepBack() {
   }

   stepFordward() {

   }

   play() {

   }

   pause() {

   }

   stop() {

   }

   render() {
      return (<div className='row second-nav'>
         <nav className='navbar'>
            <ul className='nav navbar-nav'>
               <li>
                  <a href='#'>
                     <i className='fa fa-play' aria-hidden='true' onClick={this.play}></i>
                  </a>
               </li>
               <li>
                  <a href='#'>
                     <i className='fa fa-pause' aria-hidden='true' onClick={this.pause}></i>
                  </a>
               </li>
               <li>
                  <a href='#'>
                     <i className='fa fa-stop' aria-hidden='true' onClick={this.stop}></i>
                  </a>
               </li>
               <li>
                  <a href='#'>
                     <i className='fa fa-step-backward' aria-hidden='true' onClick={this.stepBack}></i>
                  </a>
               </li>
               <li>
                  <a href='#'>
                     <i className='fa fa-step-forward' aria-hidden='true' onClick={this.stepFordward}></i>
                  </a>
               </li>
               <li>
                  <a href='#'>
                     <label htmlFor='ciclo'>Ciclo</label>
                     <input type='number' id='ciclo' disabled></input>
                  </a>
               </li>
               <li>
                  <a href='#'>
                     <div className='speed'>
                        <label htmlFor='velocidad'>Velocidad</label>
                        <input type='number' id='velocidad' defaultValue={'0'} max='10'></input>
                     </div>
                  </a>
               </li>
            </ul>
            <ul className='nav nav-tabs'>
               <li className='active'><a data-toggle='tab' href='#home'>Superescalar</a></li>
               <li><a data-toggle='tab' href='#menu1'>Memoria - Registros</a></li>
            </ul>
         </nav>
      </div>);
   }
}
