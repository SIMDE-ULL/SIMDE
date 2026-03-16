import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { type EntryContext, ServerRouter } from "react-router";
import { I18nextProvider } from "react-i18next";
import { createI18nInstance } from "./i18n";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  entryContext: EntryContext,
) {
  const acceptLang = request.headers.get("Accept-Language") ?? "";
  const lng = acceptLang.startsWith("es") ? "es" : "en";
  const i18nInstance = createI18nInstance(lng);

  const callbackName = isbot(request.headers.get("User-Agent"))
    ? "onAllReady"
    : "onShellReady";

  return new Promise<Response>((resolve, reject) => {
    let shellRendered = false;

    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={i18nInstance}>
        <ServerRouter context={entryContext} url={request.url} />
      </I18nextProvider>,
      {
        [callbackName]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
