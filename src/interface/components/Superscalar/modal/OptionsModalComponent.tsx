import type * as React from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { type WithTranslation, withTranslation } from "react-i18next";
import { type Dispatch, type UnknownAction, bindActionCreators } from "redux";
import { toggleOptionsModal } from "../../../actions/modals";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
	return {
		isOptionsModalOpen: state.Ui.isOptionsModalOpen,
	};
};

function mapDispatchToProps(dispatch: Dispatch<UnknownAction>) {
	return { actions: bindActionCreators({ toggleOptionsModal }, dispatch) };
}

export type OptionsModalProps = WithTranslation &
	ReturnType<typeof mapStateToProps> &
	ReturnType<typeof mapDispatchToProps>;

export const OptionsModalComponent: React.FC = ({
	actions,
	isOptionsModalOpen,
	t,
}: OptionsModalProps) => {
	const cacheFailPercentage = 0;

	const close = () => {
		actions.toggleOptionsModal(false);
	};

	const handleChange = (event) => {
		// setState({ ...state, cacheFailPercentage: event.target.value });
	};

	const setOptions = () => {
		close();
	};

	return (
		<Modal show={isOptionsModalOpen} onHide={close}>
			<Modal.Header closeButton>
				<Modal.Title>{t("optionsModal.title")}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form className="form form-horizontal">
					<div className="form-group">
						<div className="col-sm-4">
							<label htmlFor="cacheFailPercentage" className="control-label">
								{t("optionsModal.cacheFault")}
							</label>
						</div>
						<div className="col-sm-8">
							<input
								className="form-control"
								name="cacheFailPercentage"
								type="number"
								min="0"
								max="100"
								value={cacheFailPercentage}
								onChange={handleChange}
							/>
						</div>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={close}>{t("commonButtons.close")}</Button>
				<Button className="btn btn-primary" onClick={setOptions}>
					{t("commonButtons.save")}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withTranslation()(OptionsModalComponent));
