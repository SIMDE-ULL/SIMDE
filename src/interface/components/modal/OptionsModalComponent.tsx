import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { translate } from 'react-i18next';
import { t } from 'i18next';

declare var window: any;

class OptionsModalComponent extends React.Component<any, any> {

    constructor(public props: any, public state: any) {
        super(props);
        window['options'] = (showModal) => {
            this.setState({ showModal: showModal });
        };

        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.setOptions = this.setOptions.bind(this);
    }

    componentWillMount() {
        this.setState({ cacheFailPercentage: 0, showModal: false });
    }

    close() {
        this.setState({ showModal: false });
    };

    open() {
        this.setState({ showModal: true });
    };

    handleChange(event) {
        let newState = Object.assign({}, this.state);
        newState.superConfig[event.target.name] = event.target.value;
        this.setState(newState);
    }

    setOptions() {
        window.setOptions(this.state.cacheFailPercentage);
        this.close();
    }

    render() {
        return (<Modal show={this.state.showModal} onHide={this.close}>
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

export default translate('common', { wait: true })(OptionsModalComponent);