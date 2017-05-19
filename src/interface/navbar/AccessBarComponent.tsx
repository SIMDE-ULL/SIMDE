import * as React from 'react';
import './AccessBarComponent.scss';
declare var window: any;

export class AccessBarComponent extends React.Component<any, any> {

   constructor(props: any) {
      super(props);
      this.stepForward = this.stepForward.bind(this);
      this.stepBack = this.stepBack.bind(this);
      this.play = this.play.bind(this);
      this.pause = this.pause.bind(this);
      this.stop = this.stop.bind(this);
      this.state = {
         content: null
      };

      window.state['cycle'] = (data) => {
         this.setState(data);
      };
   }

   stepForward() {
      window.superStep();
   }

   stepBack() {
      window.stepBack();
   }

   play() {
      window.play();
   }

   pause() {
      window.pause();
   }

   stop() {
      window.stop();
   }

   render() {
      return (<div className='row second-nav'>
         <nav className='navbar'>
            <ul className='nav navbar-nav'>
               <li>
                  <a href='#' onClick={this.play}>
                     <i className='fa fa-play' aria-hidden='true'></i>
                  </a>
               </li>
               <li>
                  <a href='#' onClick={this.pause} >
                     <i className='fa fa-pause' aria-hidden='true'></i>
                  </a>
               </li>
               <li>
                  <a href='#' onClick={this.stop}>
                     <i className='fa fa-stop' aria-hidden='true'></i>
                  </a>
               </li>
               <li>
                  <a href='#' onClick={this.stepBack}>
                     <i className='fa fa-step-backward' aria-hidden='true'></i>
                  </a>
               </li>
               <li>
                  <a href='#' onClick={this.stepForward}>
                     <i className='fa fa-step-forward' aria-hidden='true'></i>
                  </a>
               </li>
               <li>
                  <a href='#'>
                     <label>Ciclo</label>
                     <span className='cycle'>{this.state.content}</span>
                  </a>
               </li>
               <li>
                  <a href='#'>
                     <div className='speed'>
                        <label htmlFor='velocidad'>Velocidad</label>
                        <input type='number' id='velocidad' defaultValue={'5'} min='0' max='10'></input>
                     </div>
                  </a>
               </li>
            </ul>
            <ul className='nav nav-tabs'>
               <li className='active'><a data-toggle='tab' href='#home'>Superescalar</a></li>
               <li><a data-toggle='tab' href='#menu1'>Memoria - Registros</a></li>
            </ul>
         </nav>
      </div >);
   }
}
