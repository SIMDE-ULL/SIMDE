import * as React from 'react';

import { translate } from 'react-i18next';
import { t } from 'i18next';

declare var window: any;

class ReorderBufferComponent extends React.Component<any, any> {

   constructor(props: any) {
      super(props);
   }

   render() {
      return (
                  <div className='smd-reorder_buffer panel panel-default reorder-zone'>
                        <div className='panel-heading'>{'ReorderBuffer'}</div>
                        <div className='panel-body smd-reorder_buffer-body'>
                              <div className='smd-table'>
                                    <div className='smd-table-header'>
                                          <div className='smd-table-header_title'>#</div>
                                          <div className='smd-table-header_title'>Inst</div>
                                          <div className='smd-table-header_title'>{t('reorderBuffer.Destiny')}</div>
                                          <div className='smd-table-header_title'>{t('reorderBuffer.Value')}</div>
                                          <div className='smd-table-header_title'>{t('reorderBuffer.A')}</div>
                                          <div className='smd-table-header_title'>{t('reorderBuffer.Stage')}</div>
                                    </div>
                                    <div className='smd-table-body'>
                                          {
                                                this.props.content && this.props.content.map((row, i) =>
                                                <div className='smd-table_row' key={'ReorderBuffer' + i}>
                                                      <div className='smd-table_cell'>{i}</div>
                                                      <div className='smd-table_cell'>{row.instruction.id}</div>
                                                      <div className='smd-table_cell'>{row.destinyRegister}</div>
                                                      <div className='smd-table_cell'>{row.value}</div>
                                                      <div className='smd-table_cell'>{row.address}</div>
                                                      <div className='smd-table_cell'>{row.superStage}</div>
                                                </div>)
                                          }
                                    </div>
                              </div>
                        </div>
                  </div>);
   }
}

export default translate('common', { wait: true })(ReorderBufferComponent);
