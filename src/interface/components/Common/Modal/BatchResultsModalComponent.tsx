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
import SuperscalarIntegration from '../../../../integration/superscalar-integration';
import { downloadJsonFile } from '../../../utils/Downloader';

class BatchResultsModalComponent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.close = this.close.bind(this);
        this.download = this.download.bind(this);
    }

    close() {
        this.props.actions.closeBatchResults();
    }

    download() {
        downloadJsonFile('batch_stats.json', this.props.batchStatsResults);
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
                        <Button onClick={this.download}>
                                {this.props.t('batchResults.download')}
                        </Button>
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
        isBatchResultsModalOpen: state.Ui.isBatchResultsModalOpen,
        batchStatsResults: state.Ui.batchStatsResults
    };
};

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({ closeBatchResults }, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(BatchResultsModalComponent));
