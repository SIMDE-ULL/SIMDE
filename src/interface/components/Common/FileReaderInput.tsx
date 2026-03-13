import * as React from "react";
import { useRef } from "react";

/** Props for the file reader input wrapper component. */
interface FileReaderInputProps {
  /** Format to read the file as. Defaults to 'url'. */
  as?: "binary" | "buffer" | "text" | "url";
  children?: React.ReactNode;
  /** Callback receiving the original event and an array of [FileReader result, File] tuples. */
  onChange: (event: React.ChangeEvent<HTMLInputElement>, results: [ProgressEvent<FileReader>, File][]) => void;
  /** File input accept attribute (e.g. ".pla", ".vliw"). */
  accept: string;
  style?: React.CSSProperties;
}

/** Wraps a hidden file input so any child element can trigger file selection and reading. */
export const FileReaderInput: React.FC<FileReaderInputProps> = ({
  as: readFormat,
  children,
  onChange,
  accept,
  style,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const readAs = (readFormat || "url").toLowerCase();

    Promise.all(
      files.map(
        (file) =>
          new Promise<[ProgressEvent<FileReader>, File]>((resolve) => {
            const reader = new FileReader();

            reader.onload = (result) => {
              resolve([result, file]);
            };

            switch (readAs) {
              case "binary":
                reader.readAsBinaryString(file);
                break;
              case "buffer":
                reader.readAsArrayBuffer(file);
                break;
              case "text":
                reader.readAsText(file);
                break;
              case "url":
                reader.readAsDataURL(file);
                break;
            }
          })
      )
    ).then((zippedResults) => {
      onChange(e, zippedResults);
    });
  };

  const triggerInput = () => {
    inputRef.current?.click();
  };

  const hiddenInputStyle: React.CSSProperties = children
    ? { position: "absolute", top: "-9999px" }
    : {};

  return (
    <div
      className="_react-file-reader-input"
      onClick={triggerInput}
      style={style}
    >
      <input
        type="file"
        accept={accept}
        ref={inputRef}
        onChange={handleChange}
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.value = "";
          }
        }}
        style={hiddenInputStyle}
      />
      {children}
    </div>
  );
};

export default FileReaderInput;
