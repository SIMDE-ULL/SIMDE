import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { toggleSuperConfigModal } from '../../../actions/modals';
import { bindActionCreators } from 'redux';

import SuperescalarIntegration from '../../../../integration/superescalar-integration';
import { SUPERESCALAR_CONFIG } from '../../../../core/Constants';

import { connect } from 'react-redux';

class SuperescalarConfigModalComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props);

        this.cancel = this.cancel.bind(this);
        this.close = this.close.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.setDefault = this.setDefault.bind(this);
        this.saveSuperConfig = this.saveSuperConfig.bind(this);

        this.state = {
            superConfig: {
                integerSumQuantity: 2,
                integerSumLatency: 1,
                integerMultQuantity: 2,
                integerMultLatency: 2,
                floatingSumQuantity: 2,
                floatingSumLatency: 4,
                floatingMultQuantity: 2,
                floatingMultLatency: 6,
                memoryQuantity: 2,
                memoryLatency: 4,
                jumpQuantity: 1,
                jumpLatency: 2,
                issueGrade: 4
            }
        };
    }

    saveSuperConfig() {
        SuperescalarIntegration.saveSuperConfig(this.state.superConfig);
        this.close();
    }

    handleChange(event) {
        let newState = Object.assign({}, this.state);
        newState.superConfig[event.target.name] = event.target.value;
        this.setState(newState);
    }

    cancel() {
        this.setDefault();
        this.close();
    }

    setDefault() {
        this.setState({
            superConfig: {
                integerSumQuantity: 2,
                integerSumLatency: 1,
                integerMultQuantity: 2,
                integerMultLatency: 2,
                floatingSumQuantity: 2,
                floatingSumLatency: 4,
                floatingMultQuantity: 2,
                floatingMultLatency: 6,
                memoryQuantity: 2,
                memoryLatency: 4,
                jumpQuantity: 1,
                jumpLatency: 2,
                issueGrade: 4
            }
        });
    }

    close() {
        this.props.actions.toggleSuperConfigModal(false);
    };

    render() {
        return (<Modal show={this.props.isSuperConfigModalOpen} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>{this.props.t('superescalarModal.name')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{this.props.t('superescalarModal.warning')}</p>
                <form className='form form-horizontal'>
                    <div className='form-group'>
                        <div className='col-sm-4 col-sm-offset-4'>
                            <label>{this.props.t('superescalarModal.quantity')}</label>
                        </div>
                        <div className='col-sm-4'>
                            <label>{this.props.t('superescalarModal.latency')}</label>
                        </div>
                    </div>
                    <div className='form-group'>
                        <fieldset>
                            <div className='col-sm-4'>
                                <legend className='control-label'>{this.props.t('superescalarModal.Integer+')}</legend>
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='integerSumQuantity'
                                    type='number'
                                    min={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MIN}
                                    max={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MAX}
                                    value={this.state.superConfig.integerSumQuantity}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='integerSumLatency'
                                    type='number'
                                    min={SUPERESCALAR_CONFIG.LATENCY_MIN}
                                    max={SUPERESCALAR_CONFIG.LATENCY_MAX}
                                    value={this.state.superConfig.integerSumLatency}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </fieldset>
                    </div>
                    <div className='form-group'>
                        <fieldset>
                            <div className='col-sm-4'>
                                <legend className='control-label'>{this.props.t('superescalarModal.Integerx')}</legend>
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='integerMultQuantity'
                                    type='number'
                                    min={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MIN}
                                    max={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MAX}
                                    value={this.state.superConfig.integerMultQuantity}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='integerMultLatency'
                                    type='number'
                                    min={SUPERESCALAR_CONFIG.LATENCY_MIN}
                                    max={SUPERESCALAR_CONFIG.LATENCY_MAX}
                                    value={this.state.superConfig.integerMultLatency}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </fieldset>
                    </div>
                    <div className='form-group'>
                        <fieldset>
                            <div className='col-sm-4'>
                                <legend className='control-label'>{this.props.t('superescalarModal.Floating+')}</legend>
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='floatingSumQuantity'
                                    type='number'
                                    min={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MIN}
                                    max={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MAX}
                                    value={this.state.superConfig.floatingSumQuantity}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='floatingSumLatency'
                                    type='number'
                                    min={SUPERESCALAR_CONFIG.LATENCY_MIN}
                                    max={SUPERESCALAR_CONFIG.LATENCY_MAX}
                                    value={this.state.superConfig.floatingSumLatency}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </fieldset>
                    </div>
                    <div className='form-group'>
                        <fieldset>
                            <div className='col-sm-4'>
                                <legend className='control-label'>{this.props.t('superescalarModal.Floatingx')}</legend>
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='floatingMultQuantity'
                                    type='number'
                                    min={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MIN}
                                    max={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MAX}
                                    value={this.state.superConfig.floatingMultQuantity}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='floatingMultLatency'
                                    type='number'
                                    min={SUPERESCALAR_CONFIG.LATENCY_MIN}
                                    max={SUPERESCALAR_CONFIG.LATENCY_MAX}
                                    value={this.state.superConfig.floatingMultLatency}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </fieldset>
                    </div>
                    <div className='form-group'>
                        <fieldset>
                            <div className='col-sm-4'>
                                <legend className='control-label'>{this.props.t('superescalarModal.Memory')}</legend>
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='memoryQuantity'
                                    type='number'
                                    min={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MIN}
                                    max={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MAX}
                                    value={this.state.superConfig.memoryQuantity}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='memoryLatency'
                                    type='number'
                                    min={SUPERESCALAR_CONFIG.LATENCY_MIN}
                                    max={SUPERESCALAR_CONFIG.LATENCY_MAX}
                                    value={this.state.superConfig.memoryLatency}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </fieldset>
                    </div>
                    <div className='form-group'>
                        <fieldset>
                            <div className='col-sm-4'>
                                <legend className='control-label'>{this.props.t('superescalarModal.Jump')}</legend>
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='jumpQuantity'
                                    type='number'
                                    min={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MIN}
                                    max={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MAX}
                                    value={this.state.superConfig.jumpQuantity}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='jumpLatency'
                                    type='number'
                                    min={SUPERESCALAR_CONFIG.LATENCY_MIN}
                                    max={SUPERESCALAR_CONFIG.LATENCY_MAX}
                                    value={this.state.superConfig.jumpLatency}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </fieldset>
                    </div>

                    <div className='extraParams'>
                        <div className='form-group'>
                            <div className='col-sm-4'>
                                <label htmlFor='issueGrade' className='control-label'>{this.props.t('superescalarModal.issue')}
                                </label>
                            </div>
                            <div className='col-sm-8'>
                                <input
                                    className='form-control'
                                    name='issueGrade'
                                    type='number'
                                    min={SUPERESCALAR_CONFIG.ISSUE_GRADE_MIN}
                                    max={SUPERESCALAR_CONFIG.ISSUE_GRADE_MAX}
                                    value={this.state.superConfig.issueGrade}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-primary' onClick={this.setDefault}>{this.props.t('superescalarModal.default')}</Button>
                <Button onClick={this.cancel}>{this.props.t('commonButtons.close')}</Button>
                <Button className='btn btn-primary' onClick={this.saveSuperConfig}>{this.props.t('commonButtons.save')}</Button>
            </Modal.Footer>
        </Modal>);
    }
}

const mapStateToProps = state => {
    return {
        isSuperConfigModalOpen: state.Ui.isSuperConfigModalOpen,
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({toggleSuperConfigModal}, dispatch)};
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(SuperescalarConfigModalComponent));
