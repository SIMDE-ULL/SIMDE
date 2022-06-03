import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { generateIntervalFromImput } from '../../../utils/interval';

class IntervalModalComponent extends React.Component<any, any> {

    constructor(public props: any) {
        super(props);
        this.close = this.close.bind(this);
        this.accept = this.accept.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = { showModal: false };
    }

    handleChange(event) {
        this.setState({ value: event.target.value, error: '' });
    }

    close() {
        this.props.close();
    }

    accept() {
        try {
            const value = generateIntervalFromImput(this.state.value, this.props.max);
            this.props.onAccept(value);
            this.setState({ value: '' });
            this.props.close();
        } catch (err) {
            this.setState({...this.state, error: err })
        }
    }

    render() {
        return (
            <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>{this.props.t(this.props.title)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className='form intervalForm'>
                    <div className='form-group'>
                        <div className='col-sm-12 text-center'>
                            <label className='control-label'>{this.props.t('intervalModal.intervalMessage')}
                            </label>
                        </div>
                        <div className='col-sm-12'>
                            <input type='text' className='form-control' value={this.state.value} onChange={this.handleChange} />
                        </div>
                    </div>
                </form>
                {   
                    this.state.error ? <div className="smd-forms_error">
                    {this.props.t(`intervalModal.errors.${this.state.error}`)}
                    </div> : <div></div>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.close}>{this.props.t('commonButtons.close')}</Button>
                <Button className='btn btn-primary' onClick={this.accept}>{this.props.t('commonButtons.accept')}</Button>
            </Modal.Footer>
        </Modal>);
    }
}

export default withTranslation()(IntervalModalComponent);
