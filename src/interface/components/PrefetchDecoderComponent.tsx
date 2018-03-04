import * as React from 'react';
import { Queue } from '../../core/Collections/Queue';
import { translate } from 'react-i18next';
import { t } from 'i18next';

class PrefetchDecoderComponent extends React.Component<any, any> {

    history: any[];

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
                <div className='panel panel-default smd-prefetch_decoder'>
                    <div className='panel-heading'>
                            {t(this.props.title)}</div>
                    <div className='panel-body'>
                        <div className='smd-table'>
                        {
                            this.props.data && this.props.data.map((element, i) =>
                            <div className='smd-table_row' key={this.props.title + 'row' + i}>
                                    <div className='smd-table_cell' key={this.props.title + i}>{element != null ? element : `&nbsp;`}</div>
                            </div>)
                        }
                        </div>
                </div>
        </div>);
    }
}


export default translate('common', { wait: true })(PrefetchDecoderComponent);