import { useTranslation } from "react-i18next";

export function FunctionalUnitComponent(props: any) {
  const { t } = useTranslation();

  return (
    <div className="smd-functional_unit panel panel-default">
      <div className="panel-heading">{t(`functionalUnits.${props.title}`)}</div>
      <div className="panel-body">
        <div className="smd-table">
          {
            <div className="smd-table-header">
              <div className="smd-table_row">
                {props.header?.map((element: any, i: number) => (
                  <div
                    className="smd-table-header_title"
                    key={`${props.title}FUTitle${i}`}
                  >
                    {element}
                  </div>
                ))}
              </div>
            </div>
          }
          <div className="smd-table-body">
            {props.content?.map((element: any, i: number) => (
              <div className="smd-table_row" key={`${props.title}FU${i}`}>
                {element.map((content: any, j: number) => (
                  <div
                    className="smd-table_cell"
                    title={content.value}
                    key={`${props.title}FU${i}${j}`}
                    style={{
                      background: content.color,
                    }}
                  >
                    {content.id}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FunctionalUnitComponent;
