import { useTranslation } from "react-i18next";
import type { ColorState } from "../../reducers/color";

interface PrefetchDecoderEntry {
  id: string;
  value: string;
  uid: number;
}

interface PrefetchDecoderComponentProps {
  title: string;
  data?: PrefetchDecoderEntry[];
  colors: ColorState;
}

export function PrefetchDecoderComponent(props: PrefetchDecoderComponentProps) {
  const { t } = useTranslation();

  return (
    <div className="panel panel-default smd-prefetch_decoder">
      <div className="panel-heading">{t(props.title)}</div>
      <div className="panel-body">
        <div className="smd-table">
          {props.data?.map((element: PrefetchDecoderEntry, i: number) => (
            <div className="smd-table_row" key={`${props.title}row${i}`}>
              <div
                className="smd-table_cell"
                title={element.value}
                key={`${props.title}${i}`}
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
