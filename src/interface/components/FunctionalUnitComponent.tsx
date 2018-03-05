import * as React from 'react';
import { translate } from 'react-i18next';
import { t } from 'i18next';

export class FunctionalUnitComponent extends React.Component<any,any> {

      constructor(props: any) {
            super(props);
      }

      render() {
            return (
                  <div className='smd-functional_unit panel panel-default'>
                        <div className='panel-heading'>{t(this.props.title)}</div>
                        <div className='panel-body'>
                              <div className='smd-table'>
                                    {<div className='smd-table-header'>
                                          {this.props.header && this.props.header.map((element, i) =>
                                                <div className='smd-table-header_title' key={this.props.title + 'FUTitle' + i}>{element}</div>)}
                                    </div>}
                                    <div className='smd-table-body'>
                                          {
                                                this.props.content && this.props.content.map((element, i) =>
                                                      <div className='smd-table_row' key={this.props.title + 'FU' + i}>
                                                            {element.map((content, j) =>
                                                                  <div className='smd-table_cell' key={this.props.title + 'FU' + i + j} style={{background: content.color}}>{content.id}</div>
                                                            )}
                                                      </div>
                                                )
                                          }
                                    </div >
                              </div>
                        </div>
                  </div>);
      }
}

export default translate('common', { wait: true })(FunctionalUnitComponent);