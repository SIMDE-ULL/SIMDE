import * as React from 'react';

import { useTranslation } from 'react-i18next';

export function TableComponent(props) {
    const [t, i18n] = useTranslation();

    return(
        <div className="smd-table_component panel panel-default">
            <div className="panel-heading">{t(props.title)}</div>
            <div className="smd-table_component-body panel-body">
                <div className="smd-table">
                    <div className="smd-table-header">
                        <div className="smd-table_row">
                        {props.header &&
                            props.header.map((header, i) => (
                                <div className="smd-table_cell smd-table_cell--title" key={`'VLIWHeader'${i}`}> 
                                        { t(header.translateKey) + header.extraValue } 
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="smd-table-body">
                        {props.data &&
                            props.data.map((row, i) => (
                                <div className="smd-table_row" key={`${'VliwCode' + i}`} >
                                    <div className="smd-table_cell"> 
                                            { i } 
                                    </div>
                                    {row.map( (col, j) => (
                                        <div className="smd-table_cell" key={`${'VliwCode' + i + '' + j}`}> 
                                            { col } 
                                        </div>
                                    ))}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TableComponent;
