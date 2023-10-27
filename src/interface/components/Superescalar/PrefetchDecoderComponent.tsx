import * as React from 'react';
import { Queue } from '../../../core/Collections/Queue';
import { useTranslation } from 'react-i18next';

export function PrefetchDecoderComponent(props) {
    const [t, i18n] = useTranslation();

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


export default PrefetchDecoderComponent;
