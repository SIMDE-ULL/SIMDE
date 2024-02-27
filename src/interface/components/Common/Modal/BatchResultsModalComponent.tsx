import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { bindActionCreators } from 'redux';
import {
    toggleOptionsModal,
    toggleBatchModal,
    closeBatchResults
} from '../../../actions/modals';
import { connect } from 'react-redux';
import SuperescalarIntegration from '../../../../integration/superescalar-integration';

class BatchResultsModalComponent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.close = this.close.bind(this);
    }

    close() {
        this.props.actions.closeBatchResults();
    }

    render() {
        return (
            <Modal
                show={this.props.isBatchResultsModalOpen}
                onHide={this.close}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.t('batchResults.title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="smd-batch_results">
                        <div className="smd-batch_results-entry">
                            <div className="smd-batch_results-entry_label">
                                {this.props.t('batchResults.subtext')}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>
                        {this.props.t('commonButtons.close')}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        isBatchResultsModalOpen: state.Ui.isBatchResultsModalOpen
    };
};

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({ closeBatchResults }, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(BatchResultsModalComponent));
