import { AppProps } from "drip/server.ts";
import { asset, Head } from "drip/runtime.ts";

export default function ({ Component }: AppProps) {
  return (
    <>
      <Head>
        <title>LNK by Drip</title>
        <link rel="stylesheet" href={asset("/styles/main.css")} />
      </Head>

      <Component />
    </>
  );
}
