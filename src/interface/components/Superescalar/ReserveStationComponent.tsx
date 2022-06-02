import * as React from 'react';

import { useTranslation } from 'react-i18next';

export function ReserveStationComponent(props) {
    const [t, i18n] = useTranslation();

    return (
        <div className="smd-reserve_station panel panel-default">
            <div className="panel-heading">{t(props.title)}</div>
            <div className="smd-reserve_station-body panel-body">
                <div className="smd-table">
                    <div className="smd-table-header">
                        <div className="smd-table-header_title">Inst</div>
                        <div className="smd-table-header_title">Qj</div>
                        <div className="smd-table-header_title">Vj</div>
                        <div className="smd-table-header_title">Qk</div>
                        <div className="smd-table-header_title">Vk</div>
                        <div className="smd-table-header_title">A</div>
                        <div className="smd-table-header_title">ROB</div>
                    </div>
                    <div className="smd-table-body">
                        {props.data &&
                            props.data.map((row, i) => (
                                <div
                                    className="smd-table_row"
                                    title={row.instruction.value}
                                    key={`${props.title + i}`}
                                    style={{
                                        background: row.instruction.color
                                    }}
                                >
                                    <div className="smd-table_cell">
                                        {row.instruction.id}
                                    </div>
                                    <div className="smd-table_cell">
                                        {row.Qj}
                                    </div>
                                    <div className="smd-table_cell">
                                        {row.Vj}
                                    </div>
                                    <div className="smd-table_cell">
                                        {row.Qk}
                                    </div>
                                    <div className="smd-table_cell">
                                        {row.Vk}
                                    </div>
                                    <div className="smd-table_cell">
                                        {row.A}
                                    </div>
                                    <div className="smd-table_cell">
                                        {row.ROB}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReserveStationComponent;
