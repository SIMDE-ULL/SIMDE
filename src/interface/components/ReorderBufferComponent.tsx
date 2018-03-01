import * as React from 'react';

import { translate } from 'react-i18next';
import { t } from 'i18next';

declare var window: any;

class ReorderBufferComponent extends React.Component<any, any> {

   constructor(props: any) {
      super(props);
   }

   componentWillReceiveProps(nextProps) {
      console.log(nextProps.content);
   }

   render() {
      return (
                  <div className='smd-reorder_buffer panel panel-default reorder-zone'>
                        <div className='panel-heading'>{'ReorderBuffer'}</div>
                        <div className='panel-body smd-reorder_buffer-body'>
                              <table className='table table-bordered'>
                                    <thead>
                                          <tr>
                                                <td>#</td>
                                                <td>Inst</td>
                                                <td>{t('reorderBuffer.Destiny')}</td>
                                                <td>{t('reorderBuffer.Value')}</td>
                                                <td>{t('reorderBuffer.A')}</td>
                                                <td>{t('reorderBuffer.Stage')}</td>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {
                                                this.props.content && this.props.content.map((row, i) =>
                                                <tr key={'ReorderBuffer' + i}>
                                                      <td>{i}</td>
                                                      <td>{row.instruction.id}</td>
                                                      <td>{row.destinyRegister}</td>
                                                      <td>{row.value}</td>
                                                      <td>{row.address}</td>
                                                      <td>{row.superStage}</td>
                                                </tr>)
                                          }
                                    </tbody>
                              </table>
                        </div>
                  </div>);
   }
}

export default translate('common', { wait: true })(ReorderBufferComponent);
