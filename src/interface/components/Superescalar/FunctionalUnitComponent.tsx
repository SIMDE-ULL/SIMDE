import * as React from 'react';
import { useTranslation } from 'react-i18next';

export function FunctionalUnitComponent(props) {
  const [t, i18n] = useTranslation();

    return (
        <div className="smd-functional_unit panel panel-default">
            <div className="panel-heading">{t(props.title)}</div>
            <div className="panel-body">
                <div className="smd-table">
                    {
                        <div className="smd-table-header">
                            {props.header &&
                                props.header.map((element, i) => (
                                    <div
                                        className="smd-table-header_title"
                                        key={props.title + 'FUTitle' + i}
                                    >
                                        {element}
                                    </div>
                                ))}
                        </div>
                    }
                    <div className="smd-table-body">
                        {props.content &&
                            props.content.map((element, i) => (
                                <div
                                    className="smd-table_row"
                                    key={props.title + 'FU' + i}
                                >
                                    {element.map((content, j) => (
                                        <div
                                            className="smd-table_cell"
                                            title={content.value}
                                            key={props.title + 'FU' + i + j}
                                            style={{
                                                background: content.color
                                            }}
                                        >
                                            {content.id}
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

export default FunctionalUnitComponent;
