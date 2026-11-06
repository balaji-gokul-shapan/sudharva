import https from "node:https";
import tls from "node:tls";

import { LETS_ENCRYPT_GEN_Y_CHAIN } from "./certs/letsEncryptGenYChain.js";

const INSECURE_DEV_SSL_ENABLED =
  process.env.NODE_ENV !== "production" &&
  process.env.ALLOW_INSECURE_DEV_SSL === "true";

const extraCas = [
  LETS_ENCRYPT_GEN_Y_CHAIN,
  process.env.API_TLS_CA?.replace(/\\n/g, "\n").trim(),
].filter(Boolean);

const INSECURE_HTTPS_AGENT = INSECURE_DEV_SSL_ENABLED
  ? new https.Agent({ rejectUnauthorized: false })
  : null;

const TRUST_STORE_AGENT = new https.Agent({
  ca: [...tls.rootCertificates, ...extraCas],
});

export const isTlsCertificateError = (error) => {
  const code = error?.cause?.code || error?.code;
  return [
    "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
    "UNABLE_TO_GET_ISSUER_CERT",
    "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
    "SELF_SIGNED_CERT_IN_CHAIN",
    "DEPTH_ZERO_SELF_SIGNED_CERT",
  ].includes(code);
};

export function getUpstreamHttpsAgent(url) {
  if (!String(url).startsWith("https:")) return undefined;
  if (INSECURE_DEV_SSL_ENABLED) return INSECURE_HTTPS_AGENT;
  return TRUST_STORE_AGENT;
}
