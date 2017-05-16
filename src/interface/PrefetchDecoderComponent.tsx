import * as React from 'react';
declare var window: any;

export class PrefetchDecoderComponent extends React.Component<any, any> {

   constructor(props: any) {
      super(props);
      this.state = {
         title: null,
         content: [],
         showableContent: []
      };
      window.state[this.props.title] = (data) => {
         let newState = {
            content: data.content,
            showableContent: []
         };
         newState.showableContent = this.buildShowableContent(data.content);
         this.setState(newState);
      };
   }

   buildShowableContent(data) {
      return data.map(i => {
         return (i != null) ? i.instruction.id : '';
      });
   }


   render() {
      return (
         <div className='panel panel-default prefetch-decoder-zone'>
            <div className='panel-heading'>{this.props.title}</div>
            <div className='panel-body'>
               <table className='table table-bordered'>
                  <tbody>
                     {
                        this.state.showableContent.map((element, i) =>
                           <tr key={this.props.title + 'row' + i}>
                              <td key={this.props.title + i}>{element}</td>
                           </tr>)
                     }
                  </tbody>
               </table>
            </div>
         </div>);
   }
}
