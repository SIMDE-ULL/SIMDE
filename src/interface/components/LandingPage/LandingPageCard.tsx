import { Button, Card, Image } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import robot from "/assets/robot.svg";

export interface LandingPageCardProps {
	title: string;
	children: React.ReactNode;
	main?: boolean;
}

export const LandingPageCard = ({
	title,
	children,
	main,
}: LandingPageCardProps) => {
	const [t] = useTranslation();

	return (
		<>
			{main && <Image id="simde-robot" src={robot} />}
			<Card>
				<Card.Body className="logo-text">
					<h1 className={main ? "logo-text-bold" : "logo-text"}>{title}</h1>
					{children}
				</Card.Body>
				<Card.Footer>
					<Button
						as={Link as typeof Link & keyof JSX.IntrinsicElements}
						to="/project"
					>
						{t("landingPage.read")}
					</Button>

					<Button
						className="logo-text color-light"
						as={Link as typeof Link & keyof JSX.IntrinsicElements}
						to="/superescalar"
					>
						{t("landingPage.go")}
					</Button>
				</Card.Footer>
			</Card>
		</>
	);
};
export default LandingPageCard;
