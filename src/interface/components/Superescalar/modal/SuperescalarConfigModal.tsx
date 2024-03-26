import * as React from "react";
import {
	Alert,
	Button,
	Col,
	Container,
	Form,
	Modal,
	Row,
	Stack,
} from "react-bootstrap";
import { type WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators, type Dispatch, type UnknownAction } from "redux";

import { toggleSuperConfigModal } from "../../../actions/modals";
import SuperescalarIntegration from "../../../../integration/superescalar-integration";
import { SUPERESCALAR_CONFIG } from "../../../utils/constants";
import type { GlobalState } from "../../../reducers";

const mapStateToProps = (state: GlobalState) => {
	return {
		isSuperscalarConfigModalShown: state.Ui.isSuperConfigModalOpen,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<UnknownAction>) => {
	return { actions: bindActionCreators({ toggleSuperConfigModal }, dispatch) };
};

export type SuperscalarConfigModalProps = WithTranslation &
	ReturnType<typeof mapStateToProps> &
	ReturnType<typeof mapDispatchToProps>;

export const SuperscalarConfigModal: React.FC = ({
	isSuperscalarConfigModalShown,
	actions,
	t,
}: SuperscalarConfigModalProps) => {
	const defaultConfig = {
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
		issueGrade: 4,
	};

	const [config, setConfig] = React.useState(defaultConfig);

	const saveConfig = () => {
		SuperescalarIntegration.saveSuperConfig(config);
		closeModal();
	};

	const updateConfig = (event) => {
		setConfig({ ...config, [event.target.name]: Number(event.target.value) });
	};

	const setDefaultConfig = () => {
		setConfig(defaultConfig);
	};

	const closeModal = () => {
		actions.toggleSuperConfigModal(false);
	};

	return (
		<Modal show={isSuperscalarConfigModalShown} onHide={closeModal}>
			<Modal.Header closeButton>
				<Modal.Title>{t("superescalarModal.name")}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Stack gap={1}>
					<Alert variant="warning">{t("superescalarModal.warning")}</Alert>
					<Container>
						<h5>{t("superescalarModal.functionalUnits")}</h5>
						<Row>
							<Col>
								<Form>
									<Stack gap={1}>
										<Row>
											<Form.Label column xs={{ offset: 4 }}>
												{t("superescalarModal.quantity")}
											</Form.Label>
											<Form.Label column>
												{t("superescalarModal.latency")}
											</Form.Label>
										</Row>
										<Row>
											<Form.Label column>
												{t("functionalUnits.intAdd")}
											</Form.Label>
											<Col>
												<Form.Group>
													<Form.Control
														name="integerSumQuantity"
														type="number"
														min={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MIN}
														max={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MAX}
														value={config.integerSumQuantity}
														onChange={updateConfig}
													/>
												</Form.Group>
											</Col>
											<Col>
												<Form.Group>
													<Form.Control
														name="integerSumLatency"
														type="number"
														min={SUPERESCALAR_CONFIG.LATENCY_MIN}
														max={SUPERESCALAR_CONFIG.LATENCY_MAX}
														value={config.integerSumLatency}
														onChange={updateConfig}
													/>
												</Form.Group>
											</Col>
										</Row>
										<Row>
											<Form.Label column>
												{t("functionalUnits.intMult")}
											</Form.Label>
											<Col>
												<Form.Group>
													<Form.Control
														name="integerMultQuantity"
														type="number"
														min={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MIN}
														max={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MAX}
														value={config.integerMultQuantity}
														onChange={updateConfig}
													/>
												</Form.Group>
											</Col>
											<Col>
												<Form.Group>
													<Form.Control
														name="integerMultLatency"
														type="number"
														min={SUPERESCALAR_CONFIG.LATENCY_MIN}
														max={SUPERESCALAR_CONFIG.LATENCY_MAX}
														value={config.integerMultLatency}
														onChange={updateConfig}
													/>
												</Form.Group>
											</Col>
										</Row>
										<Row>
											<Form.Label column>
												{t("functionalUnits.floatAdd")}
											</Form.Label>
											<Col>
												<Form.Group>
													<Form.Control
														name="floatingSumQuantity"
														type="number"
														min={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MIN}
														max={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MAX}
														value={config.floatingSumQuantity}
														onChange={updateConfig}
													/>
												</Form.Group>
											</Col>
											<Col>
												<Form.Group>
													<Form.Control
														name="floatingSumLatency"
														type="number"
														min={SUPERESCALAR_CONFIG.LATENCY_MIN}
														max={SUPERESCALAR_CONFIG.LATENCY_MAX}
														value={config.floatingSumLatency}
														onChange={updateConfig}
													/>
												</Form.Group>
											</Col>
										</Row>
										<Row>
											<Form.Label column>
												{t("functionalUnits.floatMult")}
											</Form.Label>
											<Col>
												<Form.Group>
													<Form.Control
														name="floatingMultQuantity"
														type="number"
														min={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MIN}
														max={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MAX}
														value={config.floatingMultQuantity}
														onChange={updateConfig}
													/>
												</Form.Group>
											</Col>
											<Col>
												<Form.Group>
													<Form.Control
														name="floatingMultLatency"
														type="number"
														min={SUPERESCALAR_CONFIG.LATENCY_MIN}
														max={SUPERESCALAR_CONFIG.LATENCY_MAX}
														value={config.floatingMultLatency}
														onChange={updateConfig}
													/>
												</Form.Group>
											</Col>
										</Row>
										<Row>
											<Form.Label column>
												{t("functionalUnits.memory")}
											</Form.Label>
											<Col>
												<Form.Group>
													<Form.Control
														name="memoryQuantity"
														type="number"
														min={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MIN}
														max={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MAX}
														value={config.memoryQuantity}
														onChange={updateConfig}
													/>
												</Form.Group>
											</Col>
											<Col>
												<Form.Group>
													<Form.Control
														name="memoryLatency"
														type="number"
														min={SUPERESCALAR_CONFIG.LATENCY_MIN}
														max={SUPERESCALAR_CONFIG.LATENCY_MAX}
														value={config.memoryLatency}
														onChange={updateConfig}
													/>
												</Form.Group>
											</Col>
										</Row>
										<Row>
											<Form.Label column>
												{t("functionalUnits.jump")}
											</Form.Label>
											<Col>
												<Form.Group>
													<Form.Control
														name="jumpQuantity"
														type="number"
														min={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MIN}
														max={SUPERESCALAR_CONFIG.FUNCTIONAL_UNIT_MAX}
														value={config.jumpQuantity}
														onChange={updateConfig}
													/>
												</Form.Group>
											</Col>
											<Col>
												<Form.Group>
													<Form.Control
														name="jumpLatency"
														type="number"
														min={SUPERESCALAR_CONFIG.LATENCY_MIN}
														max={SUPERESCALAR_CONFIG.LATENCY_MAX}
														value={config.jumpLatency}
														onChange={updateConfig}
													/>
												</Form.Group>
											</Col>
										</Row>
									</Stack>
								</Form>
							</Col>
						</Row>
					</Container>
					<hr />
					<Container>
						<h5>{t("superescalarModal.parameters")}</h5>
						<Row>
							<Col>
								<Form>
									<Form.Group>
										<Row>
											<Col>
												<Form.Label column>
													{t("superescalarModal.issue")}
												</Form.Label>
											</Col>
											<Col>
												<Form.Control
													name="issueGrade"
													type="number"
													min={SUPERESCALAR_CONFIG.ISSUE_GRADE_MIN}
													max={SUPERESCALAR_CONFIG.ISSUE_GRADE_MAX}
													value={config.issueGrade}
													onChange={updateConfig}
												/>
											</Col>
										</Row>
									</Form.Group>
								</Form>
							</Col>
						</Row>
					</Container>
				</Stack>
			</Modal.Body>
			<Modal.Footer>
				<Button className="me-auto" onClick={setDefaultConfig}>
					{t("superescalarModal.default")}
				</Button>
				<Button onClick={closeModal}>{t("commonButtons.close")}</Button>
				<Button onClick={saveConfig}>{t("commonButtons.save")}</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withTranslation()(SuperscalarConfigModal));
