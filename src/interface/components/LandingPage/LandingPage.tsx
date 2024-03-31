import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import LandingPageCard from "./LandingPageCard";

const LandingPageComponent = () => {
	const [t, _] = useTranslation();

	return (
		<Container fluid className="vh-100 d-flex">
			<Row xs={6} className="align-items-center justify-content-center">
				<Col>
					<LandingPageCard main title={t("landingPage.pagetitle")}>
						{t("landingPage.description")}
					</LandingPageCard>
				</Col>
				<Col>
					<LandingPageCard title={t("landingPage.superescalar")}>
						{t("landingPage.superescalar_description")}
					</LandingPageCard>
				</Col>
				<Col>
					<LandingPageCard title={t("landingPage.vliw")}>
						{t("landingPage.vliw_description")}
					</LandingPageCard>
				</Col>
			</Row>
		</Container>
	);
};

export default LandingPageComponent;
