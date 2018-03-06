import * as React from 'react';
import { Queue } from '../../core/Collections/Queue';
import { translate } from 'react-i18next';
import { t } from 'i18next';

export function PrefetchDecoderComponent(props) {
    return (
            <div className='panel panel-default smd-prefetch_decoder'>
                <div className='panel-heading'>
                        {t(props.title)}</div>
                <div className='panel-body'>
                    <div className='smd-table'>
                    {
                        props.data && props.data.map((element, i) =>
                        <div className='smd-table_row' key={props.title + 'row' + i}>
                                <div className='smd-table_cell' key={props.title + i}>{element != null ? element : `&nbsp;`}</div>
                        </div>)
                    }
                    </div>
            </div>
    </div>);
}


export default translate('common', { wait: true })(PrefetchDecoderComponent);