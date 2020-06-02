// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from "react";
import MobileRegistry from "@walletconnect/mobile-registry";
import { IMobileRegistryEntry } from "@walletconnect/types";
import { getLocation, appendToQueryString, deeplinkChoiceKey, setLocal } from "@walletconnect/utils";

import { WALLETCONNECT_CTA_TEXT_ID } from "../constants";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ConnectButton from "./ConnectButton";
import WalletButton from './WalletButton';

function formatIOSDeepLink(uri: string, entry: IMobileRegistryEntry) {
  const loc = getLocation();
  const encodedUri: string = encodeURIComponent(uri);
  const redirectUrlQueryString = appendToQueryString(loc.search, {
    walletconnect: true,
  });
  const redirectUrl: string = encodeURIComponent(
    `${loc.origin}${loc.pathname}${redirectUrlQueryString}`,
  );

  return entry.universalLink
    ? `${entry.universalLink}/wc?uri=${encodedUri}&redirectUrl=${redirectUrl}`
    : entry.deepLink
    ? `{wallet.deepLink}${uri}`
    : "";
}

function saveDeeplinkInfo(data: IDeeplinkInfo) {
  const focusUri = data.href.split('?')[0];

  setLocal(deeplinkChoiceKey, {
    ...data,
    href: focusUri
  });
}

interface IDeeplinkInfo {
  name: string;
  href: string;
}
interface DeepLinkDisplayProps {
  uri: string;
}

function DeepLinkDisplay(props: DeepLinkDisplayProps) {

  const handleClickAndroid = React.useCallback((e) => {
    saveDeeplinkInfo({
      name: 'Unknown',
      href: props.uri
    });
  }, []);

  return (
    <div>
      <p id={WALLETCONNECT_CTA_TEXT_ID} className="walletconnect-qrcode__text">
        {"Choose your preferred wallet"}
      </p>
      <div className="walletconnect-connect__buttons__wrapper">
        {(
          MobileRegistry.map((entry: IMobileRegistryEntry) => {
            const { color, name, logo } = entry;
            const href = formatIOSDeepLink(props.uri, entry);
            const handleClickIOS = React.useCallback((e) => {
              saveDeeplinkInfo({
                name,
                href
              });
            }, []);
            return (
              <WalletButton
                color={color}
                href={href}
                name={name}
                logo={logo}
                onClick={handleClickIOS}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default DeepLinkDisplay;
