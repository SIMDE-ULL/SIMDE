import * as React from 'react';
import { PhotoshopPicker } from 'react-color';
import SuperescalarIntegration from '../../../integration/superescalar-integration';
import { withTranslation } from 'react-i18next';

class ReorderBufferComponent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state  = {
            displayColorPicker: false,
            currentInstruction: null,
            instructionId: null,
            selectedColor: ''
        }
        this.handleClick = this.handleClick.bind(this);
        this.onColorAccept = this.onColorAccept.bind(this);
        this.onColorCancel = this.onColorCancel.bind(this);
        this.handleChangeComplete = this.handleChangeComplete.bind(this);
    }

    handleClick(instructionId, instructionColor) {
        this.setState({...this.state, displayColorPicker: true, instructionId: instructionId, selectedColor: instructionColor});
    }

    onColorAccept(value) {
        SuperescalarIntegration.colorCell(this.state.instructionId, this.state.selectedColor);
        this.setState({...this.state, displayColorPicker: false, selectedColor: '', instructionId: null});

    }

    onColorCancel() {
        this.setState({...this.state, displayColorPicker: false, selectedColor: '', instructionId: null});
    }

    handleChangeComplete(color) {
        this.setState({...this.state, selectedColor: color});
    }

    render() {
        const popover: any = {
            position: 'absolute',
            zIndex: '2',
            top: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
            left: '50%'
        };

        return (
            <div className="smd-reorder_buffer panel panel-default reorder-zone">
                <div className="panel-heading">{'ReorderBuffer'}</div>
                <div className="panel-body smd-reorder_buffer-body">
                    {this.state.displayColorPicker ? (
                        <div style={popover}>
                            <PhotoshopPicker color={this.state.selectedColor} onAccept={this.onColorAccept}  onChangeComplete={ this.handleChangeComplete } onCancel={this.onColorCancel} />
                        </div>
                    ) : null}
                    <div className="smd-table" >
                        <div className="smd-table-header">
                            <div className="smd-table-header_title">#</div>
                            <div className="smd-table-header_title">Inst</div>
                            <div className="smd-table-header_title">
                                {this.props.t('reorderBuffer.Destiny')}
                            </div>
                            <div className="smd-table-header_title">
                                {this.props.t('reorderBuffer.Value')}
                            </div>
                            <div className="smd-table-header_title">
                                {this.props.t('reorderBuffer.A')}
                            </div>
                            <div className="smd-table-header_title">
                                {this.props.t('reorderBuffer.Stage')}
                            </div>
                        </div>
                        <div className="smd-table-body">
                            {this.props.content &&
                                this.props.content
                                    .map((row, i) => ({ row, i }))
                                    .filter(e => e.row.instruction.id != '')
                                    .map(e => (
                                        <div
                                            className="smd-table_row smd-reorder_buffer_entry"
                                            style={{background: e.row.instruction.color}}
                                            onClick={() => this.handleClick(e.row.instruction.id, e.row.instruction.color) as any}
                                            title={e.row.instruction.value}
                                            key={'ReorderBuffer' + e.i}
                                        >
                                            <div className="smd-table_cell">
                                                {e.i}
                                            </div>
                                            <div className="smd-table_cell">
                                                {e.row.instruction.id}
                                            </div>
                                            <div className="smd-table_cell">
                                                {e.row.destinyRegister}
                                            </div>
                                            <div className="smd-table_cell">
                                                {e.row.value}
                                            </div>
                                            <div className="smd-table_cell">
                                                {e.row.address}
                                            </div>
                                            <div className="smd-table_cell">
                                                {e.row.superStage}
                                            </div>
                                        </div>
                                    ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(ReorderBufferComponent);
