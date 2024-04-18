import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { bindActionCreators } from 'redux';
import { toggleOptionsModal, toggleBatchModal } from '../../../actions/modals';
import { connect } from 'react-redux';
import SuperescalarIntegration from '../../../../integration/superescalar-integration';
import { SUPERESCALAR_CONFIG, BATCH_CONFIG } from '../../../utils/constants';

class BatchModalComponent extends React.Component<any, any> {
    constructor(public props: any) {
        super(props);
        this.state = {
            replications: 10,
        };
        this.close = this.close.bind(this);
        this.setOptions = this.setOptions.bind(this);
        this.handleChange = this.handleChange.bind(this);


    }

    close() {
        this.props.actions.toggleBatchModal(false);
    }

    handleChange(event) {
        let newState = { ...this.state };
        newState.replications = event.target.value;
        this.setState(newState);
    }

    setOptions() {
        SuperescalarIntegration.setBatchMode(this.state.replications);
        this.close();
        SuperescalarIntegration.makeBatchExecution();
    }

    render() {
        return (
            <Modal show={this.props.isBatchModalOpen} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.t('batchModal.title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="form form-horizontal">
                        <div className="form-group">
                            <label
                                htmlFor="replications"
                                className="control-label col-sm-4"
                            >
                                {this.props.t('batchModal.replications')}
                            </label>
                            <div className="col-sm-8">
                                <input
                                    className="form-control"
                                    name="replications"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={this.state.replications}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>
                        {this.props.t('commonButtons.close')}
                    </Button>
                    <Button
                        className="btn btn-primary"
                        onClick={this.setOptions}
                    >
                        {this.props.t('commonButtons.launch')}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        isBatchModalOpen: state.Ui.isBatchModalOpen
    };
};

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({ toggleBatchModal }, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(BatchModalComponent));
