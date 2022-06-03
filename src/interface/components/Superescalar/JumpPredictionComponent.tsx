import * as React from 'react';
import { useTranslation } from 'react-i18next';

export function JumpPredictionComponent(props) {
    const [t, i18n] = useTranslation();

    return (
        <div className="smd-jump_prediction panel panel-default">
            <div className="panel-heading">{t(props.title)}</div>
            <div className="smd-jump_prediction-body panel-body">
                <div className="smd-table">
                    {props.jumpPrediction.map((row, i) => (
                        <div
                            className="smd-table_row"
                            key={`${props.title + i}`}
                        >
                            <div
                                className="smd-table_cell"
                                key={`${props.title + i + 65}`}
                            >
                                {i}
                            </div>
                            <div
                                className="smd-table_cell"
                                key={`${props.title + i + 131}`}
                            >
                                {row}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default JumpPredictionComponent;
