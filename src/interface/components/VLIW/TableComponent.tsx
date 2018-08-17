import * as React from 'react';

import { translate } from 'react-i18next';
import { t } from 'i18next';

export function TableComponent(props) {

    return(
        <div className="smd-table_component panel panel-default">
            <div className="panel-heading">{t(props.title)}</div>
            <div className="smd-table_component-body panel-body">
                <div className="smd-table">
                    {/* <div className="smd-table-header">
                        <div className="smd-table-header_title id-colum">#</div>
                        <div className="smd-table-header_title">Entera0</div>
                        <div className="smd-table-header_title">Entera1</div>
                        <div className="smd-table-header_title">xEntera0</div>
                        <div className="smd-table-header_title">xEntera1</div>
                        <div className="smd-table-header_title">Flotante0</div>
                        <div className="smd-table-header_title">Flotante1</div>
                        <div className="smd-table-header_title">xFlotante0</div>
                        <div className="smd-table-header_title">xFlotante1</div>
                        <div className="smd-table-header_title">Mem0</div>
                        <div className="smd-table-header_title">Mem1</div>
                        <div className="smd-table-header_title">Salto0</div>
                    </div> */}
                    <div className="smd-table-body">
                        {props.data &&
                            props.data.map((row, i) => (
                                <div
                                    className="smd-table_row"
                                    key={`${props.title + i}`}
                                >
                                {row.map( (col, j) => (
                                    <div className="smd-table_cell">
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