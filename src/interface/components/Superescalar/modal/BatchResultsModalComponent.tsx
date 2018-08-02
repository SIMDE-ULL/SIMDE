import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { translate } from 'react-i18next';
import { t } from 'i18next';
import { bindActionCreators } from 'redux';
import {
    toggleOptionsModal,
    toggleBatchModal,
    clearBatchResults
} from '../../actions/modals';
import { connect } from 'react-redux';
import SuperescalarIntegration from '../../../integration/superescalar-integration';

class BatchResultsModalComponent extends React.Component<any, any> {
    constructor(props: any, state: any) {
        super(props);

        this.close = this.close.bind(this);
    }

    close() {
        this.props.actions.clearBatchResults(false);
    }

    render() {
        return (
            <Modal
                show={this.props.isBatchResultsModalOpen}
                onHide={this.close}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t('batchResults.title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="smd-batch_results">
                        <div className="smd-batch_results-entry">
                            <div className="smd-batch_results-entry_label">
                                {t('batchResults.replications')}:
                            </div>
                            <div className="smd-batch_results-entry_value">
                                {this.props.results.replications}
                            </div>
                        </div>
                        <div className="smd-batch_results-entry">
                            <div className="smd-batch_results-entry_label">
                            {t('batchResults.average')}
                            </div>
                            <div className="smd-batch_results-entry_value">
                                {this.props.results.average}
                            </div>
                        </div>
                        <div className="smd-batch_results-entry">
                            <div className="smd-batch_results-entry_label">
                            {t('batchResults.standardDeviation')}
                            </div>
                            <div className="smd-batch_results-entry_value">
                                {this.props.results.standardDeviation}
                        
                            </div>
                        </div>
                        <div className="smd-batch_results-entry">
                            <div className="smd-batch_results-entry_label">
                            {t('batchResults.worst')}:
                            </div>
                            <div className="smd-batch_results-entry_value">
                                {this.props.results.worst}
                            </div>
                        </div>
                        <div className="smd-batch_results-entry">
                            <div className="smd-batch_results-entry_label">
                            {t('batchResults.best')}:
                            </div>
                            <div className="smd-batch_results-entry_value">
                                {this.props.results.best}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>
                        {t('commonButtons.close')}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        isBatchResultsModalOpen: state.isBatchResultsModalOpen,
        results: state.batchResults
    };
};

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({ clearBatchResults }, dispatch) };
}

export default translate('common', { wait: true })(
    connect(mapStateToProps, mapDispatchToProps)(BatchResultsModalComponent)
);
