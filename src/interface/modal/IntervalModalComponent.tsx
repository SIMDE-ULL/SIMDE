import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './IntervalModalComponent.scss';

declare var window: any;

export class IntervalModalComponent extends React.Component<any, any> {

    constructor() {
        super();
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
        this.props.onAccept('');
    }

    accept() {
        let value = this.state.value;
        this.setState({ value: '' });
        this.props.onAccept(value);
    }

    render() {
        return (<Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className='form intervalForm'>
                    <div className='form-group'>
                        <div className='col-sm-12 text-center'>
                            <label className='control-label'>
                                Seleccione los elementos que desee mostrar. Puede usar números e intervalos:
               (1,4,5-7,...)
               </label>
                        </div>
                        <div className='col-sm-12'>
                            <input type='text' className='form-control' value={this.state.value} onChange={this.handleChange} />
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.close}>Cancelar</Button>
                <Button className='btn btn-primary' onClick={this.accept}>Aceptar</Button>
            </Modal.Footer>
        </Modal>);
    }
}
