import * as React from "react";
import IntervalModalComponent from "./modal/IntervalModalComponent";

export class ROBMapperComponent extends React.Component<
	{ title: string; data: string[] },
	object
> {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return (
			<div className="smd-rob_mapper panel panel-default">
				<div className="panel-heading">{this.props.title}</div>
				<div className="smd-rob_mapper-body panel-body">
					<div className="smd-table">
						{Object.keys(this.props.data).map((index) => (
							<div
								className="smd-table_row"
								key={`${this.props.title + index}`}
							>
								<div
									className="smd-table_cell"
									key={`${this.props.title + index + 65}`}
								>
									{index}
								</div>
								<div
									className="smd-table_cell"
									key={`${this.props.title + index + 131}`}
								>
									{this.props.data[index]}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}
}
