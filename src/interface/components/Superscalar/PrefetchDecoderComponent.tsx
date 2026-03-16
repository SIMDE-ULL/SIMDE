import { useTranslation } from "react-i18next";

export function PrefetchDecoderComponent(props: any) {
  const { t } = useTranslation();

  return (
    <div className="panel panel-default smd-prefetch_decoder">
      <div className="panel-heading">{t(props.title)}</div>
      <div className="panel-body">
        <div className="smd-table">
          {props.data?.map((element: any, i: number) => (
            <div className="smd-table_row" key={`${props.title}row${i}`}>
              <div
                className="smd-table_cell"
                title={element.value}
                key={props.title + i}
                style={{ background: props.colors.uidColors[element.uid] }}
              >
                {element != null ? element.id : "&nbsp;"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PrefetchDecoderComponent;
