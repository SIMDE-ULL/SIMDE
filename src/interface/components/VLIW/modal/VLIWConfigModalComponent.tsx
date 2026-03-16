import { CacheType } from "@/core/Common/Cache";
import { type ChangeEvent, type FC, useState } from "react";
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
import { useTranslation } from "react-i18next";
import VLIWIntegration from "../../../../integration/vliw-integration.client";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { toggleVliwConfigModal } from "../../../actions/modals";
import { BATCH_CONFIG, VLIW_CONFIG } from "../../../utils/constants";

interface VliwConfig {
  integerSumQuantity: number;
  integerSumLatency: number;
  integerMultQuantity: number;
  integerMultLatency: number;
  floatingSumQuantity: number;
  floatingSumLatency: number;
  floatingMultQuantity: number;
  floatingMultLatency: number;
  memoryQuantity: number;
  memoryLatency: number;
  jumpQuantity: number;
  jumpLatency: number;
  issueGrade: number;
  cacheType: CacheType;
  cacheFailPercentage: number;
  cacheFailLatency: number;
  cacheBlocks: number;
  cacheLines: number;
}

const DEFAULT_CONFIG: VliwConfig = {
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
  cacheType: CacheType.NO_CACHE,
  cacheFailPercentage: 30,
  cacheFailLatency: 9,
  cacheBlocks: 4,
  cacheLines: 16,
};

/** VLIW machine configuration modal for functional units, cache, and parameters. */
export const VLIWConfigModalComponent: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isVliwConfigModalOpen = useAppSelector(
    (state) => state.Ui.isVliwConfigModalOpen,
  );
  const [config, setConfig] = useState<VliwConfig>(DEFAULT_CONFIG);

  const saveConfig = () => {
    VLIWIntegration.saveVliwConfig(config);
    closeModal();
  };

  const updateNumConfig = (event: ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [event.target.name]: Number(event.target.value) });
  };

  const updateStrConfig = (event: ChangeEvent<HTMLSelectElement>) => {
    setConfig({
      ...config,
      [event.target.name]: event.target.value as CacheType,
    });
  };

  const setDefaultConfig = () => {
    setConfig(DEFAULT_CONFIG);
  };

  const closeModal = () => {
    dispatch(toggleVliwConfigModal(false));
  };

  return (
    <Modal show={isVliwConfigModalOpen} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t("vliwModal.name")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack gap={1}>
          <Alert variant="warning">{t("vliwModal.warning")}</Alert>
          <Container>
            <h5>{t("superscalarModal.functionalUnits")}</h5>
            <Row>
              <Col>
                <Form>
                  <Stack gap={1}>
                    <Row>
                      <Form.Label column xs={{ offset: 4 }}>
                        {t("superscalarModal.quantity")}
                      </Form.Label>
                      <Form.Label column>
                        {t("superscalarModal.latency")}
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
                            min={VLIW_CONFIG.FUNCTIONAL_UNIT_MIN}
                            max={VLIW_CONFIG.FUNCTIONAL_UNIT_MAX}
                            value={config.integerSumQuantity}
                            onChange={updateNumConfig}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Control
                            name="integerSumLatency"
                            type="number"
                            min={VLIW_CONFIG.LATENCY_MIN}
                            max={VLIW_CONFIG.LATENCY_MAX}
                            value={config.integerSumLatency}
                            onChange={updateNumConfig}
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
                            min={VLIW_CONFIG.FUNCTIONAL_UNIT_MIN}
                            max={VLIW_CONFIG.FUNCTIONAL_UNIT_MAX}
                            value={config.integerMultQuantity}
                            onChange={updateNumConfig}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Control
                            name="integerMultLatency"
                            type="number"
                            min={VLIW_CONFIG.LATENCY_MIN}
                            max={VLIW_CONFIG.LATENCY_MAX}
                            value={config.integerMultLatency}
                            onChange={updateNumConfig}
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
                            min={VLIW_CONFIG.FUNCTIONAL_UNIT_MIN}
                            max={VLIW_CONFIG.FUNCTIONAL_UNIT_MAX}
                            value={config.floatingSumQuantity}
                            onChange={updateNumConfig}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Control
                            name="floatingSumLatency"
                            type="number"
                            min={VLIW_CONFIG.LATENCY_MIN}
                            max={VLIW_CONFIG.LATENCY_MAX}
                            value={config.floatingSumLatency}
                            onChange={updateNumConfig}
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
                            min={VLIW_CONFIG.FUNCTIONAL_UNIT_MIN}
                            max={VLIW_CONFIG.FUNCTIONAL_UNIT_MAX}
                            value={config.floatingMultQuantity}
                            onChange={updateNumConfig}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Control
                            name="floatingMultLatency"
                            type="number"
                            min={VLIW_CONFIG.LATENCY_MIN}
                            max={VLIW_CONFIG.LATENCY_MAX}
                            value={config.floatingMultLatency}
                            onChange={updateNumConfig}
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
                            min={VLIW_CONFIG.FUNCTIONAL_UNIT_MIN}
                            max={VLIW_CONFIG.FUNCTIONAL_UNIT_MAX}
                            value={config.memoryQuantity}
                            onChange={updateNumConfig}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Control
                            name="memoryLatency"
                            type="number"
                            min={VLIW_CONFIG.LATENCY_MIN}
                            max={VLIW_CONFIG.LATENCY_MAX}
                            value={config.memoryLatency}
                            onChange={updateNumConfig}
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
                            min={VLIW_CONFIG.FUNCTIONAL_UNIT_MIN}
                            max={VLIW_CONFIG.FUNCTIONAL_UNIT_MAX}
                            value={config.jumpQuantity}
                            onChange={updateNumConfig}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Control
                            name="jumpLatency"
                            type="number"
                            min={VLIW_CONFIG.LATENCY_MIN}
                            max={VLIW_CONFIG.LATENCY_MAX}
                            value={config.jumpLatency}
                            onChange={updateNumConfig}
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
            <h5>{t("superscalarModal.parameters")}</h5>
            <Row>
              <Col>
                <Form>
                  <Stack gap={1}>
                    <Form.Group>
                      <Row>
                        <Col>
                          <Form.Label column>
                            {t("superscalarModal.cacheType")}
                          </Form.Label>
                        </Col>
                        <Col>
                          <Form.Select
                            name="cacheType"
                            value={config.cacheType}
                            onChange={updateStrConfig}
                          >
                            <option value={CacheType.NO_CACHE}>
                              {t("superscalarModal.noCache")}
                            </option>
                            <option value={CacheType.RANDOM_CACHE}>
                              {t("superscalarModal.randomCache")}
                            </option>
                            <option value={CacheType.DIRECT_CACHE}>
                              {t("superscalarModal.directCache")}
                            </option>
                          </Form.Select>
                        </Col>
                      </Row>
                    </Form.Group>
                    {config.cacheType !== CacheType.NO_CACHE && (
                      <Form.Group>
                        <Row>
                          <Col>
                            <Form.Label column>
                              {t("batchModal.cacheFaultLatency")}
                            </Form.Label>
                          </Col>
                          <Col>
                            <Form.Control
                              name="cacheFailLatency"
                              type="number"
                              min={VLIW_CONFIG.LATENCY_MIN}
                              max={VLIW_CONFIG.LATENCY_MAX}
                              value={config.cacheFailLatency}
                              onChange={updateNumConfig}
                            />
                          </Col>
                        </Row>
                      </Form.Group>
                    )}
                    {config.cacheType === CacheType.RANDOM_CACHE && (
                      <Form.Group>
                        <Row>
                          <Col>
                            <Form.Label column>
                              {t("batchModal.cacheFaultPercentage")}
                            </Form.Label>
                          </Col>
                          <Col>
                            <Form.Control
                              name="cacheFailPercentage"
                              type="number"
                              min={BATCH_CONFIG.CACHE_FAIL_PERCENTAGE_MIN}
                              max={BATCH_CONFIG.CACHE_FAIL_PERCENTAGE_MAX}
                              value={config.cacheFailPercentage}
                              onChange={updateNumConfig}
                            />
                          </Col>
                        </Row>
                      </Form.Group>
                    )}
                    {config.cacheType === CacheType.DIRECT_CACHE && (
                      <>
                        <Form.Group>
                          <Row>
                            <Col>
                              <Form.Label column>
                                {t("superscalarModal.cacheBlocks")}
                              </Form.Label>
                            </Col>
                            <Col>
                              <Form.Control
                                name="cacheBlocks"
                                type="number"
                                min={VLIW_CONFIG.CACHE_BLOCKS_MIN}
                                max={VLIW_CONFIG.CACHE_BLOCKS_MAX}
                                value={config.cacheBlocks}
                                onChange={updateNumConfig}
                              />
                            </Col>
                          </Row>
                        </Form.Group>
                        <Form.Group>
                          <Row>
                            <Col>
                              <Form.Label column>
                                {t("superscalarModal.cacheLines")}
                              </Form.Label>
                            </Col>
                            <Col>
                              <Form.Control
                                name="cacheLines"
                                type="number"
                                min={VLIW_CONFIG.CACHE_LINES_MIN}
                                max={VLIW_CONFIG.CACHE_LINES_MAX}
                                value={config.cacheLines}
                                onChange={updateNumConfig}
                              />
                            </Col>
                          </Row>
                        </Form.Group>
                      </>
                    )}
                  </Stack>
                </Form>
              </Col>
            </Row>
          </Container>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button className="me-auto" onClick={setDefaultConfig}>
          {t("superscalarModal.default")}
        </Button>
        <Button onClick={closeModal}>{t("commonButtons.close")}</Button>
        <Button onClick={saveConfig}>{t("commonButtons.save")}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VLIWConfigModalComponent;
