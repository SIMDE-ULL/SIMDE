import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { translate } from 'react-i18next';
import { t } from 'i18next';
import { bindActionCreators } from 'redux';
import { toggleOptionsModal } from '../../../actions/modals';
import { connect } from 'react-redux';

class OptionsModalComponent extends React.Component<any, any> {

    constructor(public props: any, public state: any) {
        super(props);

        this.close = this.close.bind(this);
        this.setOptions = this.setOptions.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            cacheFailPercentage: 0
        }
    }

    close() {
        this.props.actions.toggleOptionsModal(false);
    };

    handleChange(event) {
        let newState = {...this.state};
        newState.cacheFailPercentage = event.target.value;
        this.setState(newState);
    }

    setOptions() {
        this.close();
    }

    render() {
        return (<Modal show={this.props.isOptionsModalOpen} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>{t('optionsModal.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className='form form-horizontal'>
                    <div className='form-group'>
                        <div className='col-sm-4'>
                            <label htmlFor='cacheFailPercentage' className='control-label'>{t('optionsModal.cacheFail')}
                            </label>
                        </div>
                        <div className='col-sm-8'>
                            <input
                                className='form-control'
                                name='cacheFailPercentage'
                                type='number'
                                min='0'
                                max='100'
                                value={this.state.cacheFailPercentage}
                                onChange={this.handleChange}
                            />
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.close}>{t('commonButtons.close')}</Button>
                <Button className='btn btn-primary' onClick={this.setOptions}>{t('commonButtons.save')}</Button>
            </Modal.Footer>
        </Modal>);
    }
}

const mapStateToProps = state => {
    return {
        isOptionsModalOpen: state.isOptionsModalOpen,
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({toggleOptionsModal}, dispatch)};
} 

export default translate('common', { wait: true })(connect(mapStateToProps, mapDispatchToProps)(OptionsModalComponent));