import * as React from "react";
import { Modal, Button } from "react-bootstrap";
import { type WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";

import { bindActionCreators } from "redux";
import { toggleAuthorModal } from "../../../actions/modals";

const mapStateToProps = (state) => {
  return {
    isAuthorModalOpen: state.Ui.isAuthorModalOpen,
  };
};

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ toggleAuthorModal }, dispatch) };
}

class AutorModalComponent extends React.Component<
  WithTranslation &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>,
  object
> {
  constructor(public props) {
    super(props);

    this.close = this.close.bind(this);
  }

  close() {
    this.props.actions.toggleAuthorModal(false);
  }

  render() {
    return (
      <Modal show={this.props.isAuthorModalOpen} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.t("authorModal.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="row">
              <div className="col-sm-12">
                <label>{this.props.t("authorModal.originalAuthor")}</label>:
                Iván Castilla Rodríguez
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <label>{this.props.t("authorModal.newAuthor")}</label>: Melissa
                Díaz Arteaga
              </div>
              <div className="col-sm-12">
                <label>{this.props.t("authorModal.coAuthor")}</label> Adrian
                Abreu González
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close}>
            {this.props.t("commonButtons.close")}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(AutorModalComponent));
