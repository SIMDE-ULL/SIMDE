import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { translate } from 'react-i18next';
import { t } from 'i18next';

declare var window: any;

class IntervalModalComponent extends React.Component<any, any> {

    constructor(public props: any, public state: any) {
        super(props);
        this.close = this.close.bind(this);
        this.accept = this.accept.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = { value: '' };
    }

    componentWillMount() {
        this.setState({ showModal: false });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ showModal: nextProps.open });
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    // Parent component has to decide where the modal appears or not,
    // so we don't close the modal here.
    close() {
        this.props.close();
    }

    accept() {
        let value = this.state.value;
        this.setState({ value: '' });
        this.props.onAccept(value);
    }

    render() {
        return (<Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>{t(this.props.title)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className='form intervalForm'>
                    <div className='form-group'>
                        <div className='col-sm-12 text-center'>
                            <label className='control-label'>{t('intervalModal.intervalMessage')}
                            </label>
                        </div>
                        <div className='col-sm-12'>
                            <input type='text' className='form-control' value={this.state.value} onChange={this.handleChange} />
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.close}>{t('commonButtons.close')}</Button>
                <Button className='btn btn-primary' onClick={this.accept}>{t('commonButtons.accept')}</Button>
            </Modal.Footer>
        </Modal>);
    }
}

export default translate('common', { wait: true })(IntervalModalComponent);
