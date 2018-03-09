import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { translate } from 'react-i18next';
import { t } from 'i18next';
import { bindActionCreators } from 'redux';
import { toggleOptionsModal, toggleBatchModal } from '../../actions/modals';
import { connect } from 'react-redux';
import SuperescalarIntegration from '../../../integration/superescalar-integration';
import { SUPERESCALAR_CONFIG, BATCH_CONFIG } from '../../../core/Constants';

class BatchModalComponent extends React.Component<any, any> {
    constructor(public props: any, public state: any) {
        super(props);
        this.state = {
            replications: 0,
            cacheFailPercentage: 0,
            cacheFailLatency: 9
        };
        this.close = this.close.bind(this);
        this.setOptions = this.setOptions.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCachePercentageChange = this.handleCachePercentageChange.bind(
            this
        );
        this.handleCacheFailLatencyChange = this.handleCacheFailLatencyChange.bind(
            this
        );


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
        SuperescalarIntegration.setBatchMode(
            this.state.replications,
            this.state.cacheFailPercentage,
            this.state.cacheFailLatency
        );
        this.close();
        SuperescalarIntegration.makeBatchExecution();
    }

    handleCachePercentageChange(event) {
        let newState = { ...this.state };
        newState.cacheFailPercentage = event.target.value;
        this.setState(newState);
    }

    handleCacheFailLatencyChange(event) {
        let newState = { ...this.state };
        newState.cacheFailLatency = event.target.value;
        this.setState(newState);
    }

    render() {
        return (
            <Modal show={this.props.isBatchModalOpen} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('batchModal.title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="form form-horizontal">
                        <div className="form-group">
                            <label
                                htmlFor="replications"
                                className="control-label col-sm-4"
                            >
                                {t('batchModal.replications')}
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
                        <div className="form-group">
                            <label
                                htmlFor="cacheFailPercentage"
                                className="control-label col-sm-4"
                            >
                                {t('batchModal.cacheFailPercentage')}
                            </label>
                            <div className="col-sm-8">
                                <input
                                    className="form-control"
                                    name="cacheFailPercentage"
                                    type="number"
                                    min={BATCH_CONFIG.CACHE_FAIL_PERCENTAGE_MIN}
                                    max={BATCH_CONFIG.CACHE_FAIL_PERCENTAGE_MAX}
                                    value={this.state.cacheFailPercentage}
                                    onChange={this.handleCachePercentageChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label
                                htmlFor="cacheFailLatency"
                                className="control-label col-sm-4"
                            >
                                {t('batchModal.cacheFailLatency')}
                            </label>
                            <div className="col-sm-8">
                                <input
                                    className="form-control"
                                    name="cacheFailLatency"
                                    type="number"
                                    min={BATCH_CONFIG.LATENCY_MIN}
                                    max={BATCH_CONFIG.LATENCY_MAX}
                                    value={this.state.cacheFailLatency}
                                    onChange={this.handleCacheFailLatencyChange}
                                />
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>
                        {t('commonButtons.close')}
                    </Button>
                    <Button
                        className="btn btn-primary"
                        onClick={this.setOptions}
                    >
                        {t('commonButtons.launch')}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        isBatchModalOpen: state.isBatchModalOpen
    };
};

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({ toggleBatchModal }, dispatch) };
}

export default translate('common', { wait: true })(
    connect(mapStateToProps, mapDispatchToProps)(BatchModalComponent)
);
