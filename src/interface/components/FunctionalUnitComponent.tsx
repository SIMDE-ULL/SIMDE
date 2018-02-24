import * as React from 'react';
import { BaseComponent } from './BaseComponent';
import { translate } from 'react-i18next';
import { t } from 'i18next';

export class FunctionalUnitComponent extends React.Component<any,any> {

      constructor(props: any) {
            super(props);
      }

      render() {
            return (
                  <div className='panel panel-default'>
                        <div className='panel-heading'>{t(this.props.title)}</div>
                        <div className='panel-body'>
                              <table className='table table-bordered'>
                                    {<thead>
                                          <tr>
                                                {this.props.header && this.props.header.map((element, i) =>
                                                      <th key={this.props.title + 'FUTitle' + i}>{element}</th>)}
                                          </tr>
                                    </thead>}
                                    <tbody>
                                          {
                                                this.props.content && this.props.content.map((element, i) =>
                                                      <tr key={this.props.title + 'FU' + i}>
                                                            {element.map((content, j) =>
                                                                  <td key={this.props.title + 'FU' + i + j}>{content}</td>
                                                            )}
                                                      </tr>
                                                )
                                          }
                                    </tbody>
                              </table>
                        </div>
                  </div>);
      }
}

export default translate('common', { wait: true })(FunctionalUnitComponent);