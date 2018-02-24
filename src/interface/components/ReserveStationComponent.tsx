import * as React from 'react';

import { translate } from 'react-i18next';
import { t } from 'i18next';

class ReserveStationComponent extends React.Component<any, any> {

      constructor(props: any) {
            super(props);
      }

      render() {
            return (
                  <div className='panel panel-default'>
                        <div className='panel-heading'>{t(this.props.title)}</div>
                        <div className='panel-body'>
                              <table className='table table-bordered'>
                                    <thead>
                                          <tr>
                                                <td>Inst</td>
                                                <td>Qj</td>
                                                <td>Vj</td>
                                                <td>Qk</td>
                                                <td>Vk</td>
                                                <td>A</td>
                                                <td>ROB</td>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {
                                                this.props.data
                                                 && this.props.data.map((row, i) => <tr key={`${this.props.title + i}`}>
                                                      <td>{row.instruction.id}</td>
                                                      <td>{row.Qj}</td>
                                                      <td>{row.Vj}</td>
                                                      <td>{row.Qk}</td>
                                                      <td>{row.Vk}</td>
                                                      <td>{row.A}</td>
                                                      <td>{row.ROB}</td>
                                                </tr>)
                                          }
                                    </tbody>
                              </table>
                        </div>
                  </div>);
      }
}

export default translate('common', { wait: true })(ReserveStationComponent);
