import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { translate } from 'react-i18next';
import { t } from 'i18next';
import { toggleVliwConfigModal } from '../../../actions/modals';
import { bindActionCreators } from 'redux';

import VLIWIntegration from '../../../../integration/vliw-integration';
import { VLIW_CONFIG } from '../../../../core/Constants';

import { connect } from 'react-redux';


class VliwConfigModalComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props);

        this.cancel = this.cancel.bind(this);
        this.close = this.close.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.setDefault = this.setDefault.bind(this);
        this.saveVliwConfig = this.saveVliwConfig.bind(this);
    }

    componentWillMount() {
        this.setState({
            vliwConfig: {
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
            }
        });
    }

    saveVliwConfig() {
        console.log(this.state.vliwConfig);
        VLIWIntegration.saveVliwConfig(this.state.vliwConfig); 
        this.close();
    }

    handleChange(event) {
        let newState = Object.assign({}, this.state);
        newState.vliwConfig[event.target.name] = event.target.value;
        this.setState(newState);
    }

    cancel() {
        this.setDefault();
        this.close();
    }

    setDefault() {
        this.setState({
            vliwConfig: {
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
            }
        });
    }

    close() {
        this.props.actions.toggleVliwConfigModal(false);
    };

    render() {
        return (<Modal show={this.props.isVliwConfigModalOpen} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>{t('vliwModal.name')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className='form form-horizontal'>
                    <div className='form-group'>
                        <div className='col-sm-4 col-sm-offset-4'>
                            <label>{t('vliwModal.quantity')}</label>
                        </div>
                        <div className='col-sm-4'>
                            <label>{t('vliwModal.latency')}</label>
                        </div>
                    </div>
                    <div className='form-group'>
                        <fieldset>
                            <div className='col-sm-4'>
                                <legend className='control-label'>{t('vliwModal.Integer+')}</legend>
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='integerSumQuantity'
                                    type='number'
                                    min={VLIW_CONFIG.FUNCTIONAL_UNIT_MIN}
                                    max={VLIW_CONFIG.FUNCTIONAL_UNIT_MAX}
                                    value={this.state.vliwConfig.integerSumQuantity}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='integerSumLatency'
                                    type='number'
                                    min={VLIW_CONFIG.LATENCY_MIN}
                                    max={VLIW_CONFIG.LATENCY_MAX}
                                    value={this.state.vliwConfig.integerSumLatency}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </fieldset>
                    </div>
                    <div className='form-group'>
                        <fieldset>
                            <div className='col-sm-4'>
                                <legend className='control-label'>{t('vliwModal.Integerx')}</legend>
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='integerMultQuantity'
                                    type='number'
                                    min={VLIW_CONFIG.FUNCTIONAL_UNIT_MIN}
                                    max={VLIW_CONFIG.FUNCTIONAL_UNIT_MAX}
                                    value={this.state.vliwConfig.integerMultQuantity}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='integerMultLatency'
                                    type='number'
                                    min={VLIW_CONFIG.LATENCY_MIN}
                                    max={VLIW_CONFIG.LATENCY_MAX}
                                    value={this.state.vliwConfig.integerMultLatency}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </fieldset>
                    </div>
                    <div className='form-group'>
                        <fieldset>
                            <div className='col-sm-4'>
                                <legend className='control-label'>{t('vliwModal.Floating+')}</legend>
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='floatingSumQuantity'
                                    type='number'
                                    min={VLIW_CONFIG.FUNCTIONAL_UNIT_MIN}
                                    max={VLIW_CONFIG.FUNCTIONAL_UNIT_MAX}
                                    value={this.state.vliwConfig.floatingSumQuantity}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='floatingSumLatency'
                                    type='number'
                                    min={VLIW_CONFIG.LATENCY_MIN}
                                    max={VLIW_CONFIG.LATENCY_MAX}
                                    value={this.state.vliwConfig.floatingSumLatency}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </fieldset>
                    </div>
                    <div className='form-group'>
                        <fieldset>
                            <div className='col-sm-4'>
                                <legend className='control-label'>{t('vliwModal.Floatingx')}</legend>
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='floatingMultQuantity'
                                    type='number'
                                    min={VLIW_CONFIG.FUNCTIONAL_UNIT_MIN}
                                    max={VLIW_CONFIG.FUNCTIONAL_UNIT_MAX}
                                    value={this.state.vliwConfig.floatingMultQuantity}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='floatingMultLatency'
                                    type='number'
                                    min={VLIW_CONFIG.LATENCY_MIN}
                                    max={VLIW_CONFIG.LATENCY_MAX}
                                    value={this.state.vliwConfig.floatingMultLatency}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </fieldset>
                    </div>
                    <div className='form-group'>
                        <fieldset>
                            <div className='col-sm-4'>
                                <legend className='control-label'>{t('vliwModal.Memory')}</legend>
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='memoryQuantity'
                                    type='number'
                                    min={VLIW_CONFIG.FUNCTIONAL_UNIT_MIN}
                                    max={VLIW_CONFIG.FUNCTIONAL_UNIT_MAX}
                                    value={this.state.vliwConfig.memoryQuantity}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className='col-sm-4'>
                                <input
                                    className='form-control'
                                    name='memoryLatency'
                                    type='number'
                                    min={VLIW_CONFIG.LATENCY_MIN}
                                    max={VLIW_CONFIG.LATENCY_MAX}
                                    value={this.state.vliwConfig.memoryLatency}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </fieldset>
                    </div>
                    <div className='form-group'>
                        <fieldset>
                            <div className='col-sm-4'>
                                <legend className='control-label'>{t('vliwModal.Jump')}</legend>
                            </div>
                            <div className='col-sm-4 col-sm-offset-4'>
                                <input
                                    className='form-control'
                                    name='jumpLatency'
                                    type='number'
                                    min={VLIW_CONFIG.LATENCY_MIN}
                                    max={VLIW_CONFIG.LATENCY_MAX}
                                    value={this.state.vliwConfig.jumpLatency}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </fieldset>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-primary' onClick={this.setDefault}>{t('vliwModal.default')}</Button>
                <Button onClick={this.cancel}>{t('commonButtons.close')}</Button>
                <Button className='btn btn-primary' onClick={this.saveVliwConfig}>{t('commonButtons.save')}</Button>
            </Modal.Footer>
        </Modal>);
    }
}

const mapStateToProps = state => {
    return {
        isVliwConfigModalOpen: state.Ui.isVliwConfigModalOpen,
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({toggleVliwConfigModal}, dispatch)};
}
export default translate('common', { wait: true })(connect(mapStateToProps, mapDispatchToProps)(VliwConfigModalComponent));
