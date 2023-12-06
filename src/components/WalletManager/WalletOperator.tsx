"use client";

import { WalletCore } from "@/types/wallet";
import { FC, useState, useEffect, useCallback, use } from "react";
import { generateAddressFromPubKey } from "@/utils/address";
import { abbreviateText } from "@/utils/formater";
import Button from "@/ui/Button";
import copy from "copy-text-to-clipboard";
import { useTranslation } from "react-i18next";
import { Toaster } from "react-hot-toast";
import useToast from "@/hooks/useToast";
import ReceiveModal from "./ReceiveModal";
import SendModal from "./SendModal";
import { fetchChainBalance, fetchAddressUtxo } from "@/api/chain";

interface Props {
  wallet: WalletCore;
}

const WalletOperator: FC<Props> = ({ wallet }) => {
  const { t } = useTranslation();

  const [address, setAddress] = useState<string>("");
  const [network, setNetwork] = useState<"main" | "testnet">("testnet");

  const [balance, setBalance] = useState<number>(0);
  const [utxos, setUtxos] = useState<any[]>([]);

  useEffect(() => {
    if (wallet?.publicKey) {
      const _addr = generateAddressFromPubKey(wallet.publicKey, network);
      setAddress(_addr);
    }
  }, [network, wallet.publicKey]);

  const updateBalance = useCallback(async () => {
    const balanceInfo = await fetchChainBalance(address, network);
    const b =
      balanceInfo.chain_stats.funded_txo_sum -
      balanceInfo.chain_stats.spent_txo_sum;
    setBalance(b);
  }, [address, network]);

  useEffect(() => {
    if (address) {
      updateBalance();
    }
  }, [address, updateBalance]);

  const updateUtxos = useCallback(async () => {
    const utxos = await fetchAddressUtxo(address, network);
    console.log(utxos);
    setUtxos(utxos);
  }, [address, network])

  useEffect(() => {
    if (address) {
      updateUtxos();
    }
  }, [address, updateUtxos]);

  useEffect(() => {
    if (address) {
      updateUtxos();
    }
  }, [address, updateUtxos]);


  const toast = useToast();

  const [isOpenReceiveModal, setIsOpenReceiveModal] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setIsOpenReceiveModal(false);
  }, []);

  const [isOpenSendModal, setIsOpenSendModal] = useState<boolean>(false);
  const handleCloseSendModal = useCallback(() => {
    setIsOpenSendModal(false);
  }, []);

  return (
    <div className="flex flex-col w-full max-w-[calc(100vw - 32px)] bg-white rounded-xl border border-black">
      <div className="border-b border-black w-full flex justify-center items-center h-16 relative">
        <span
          className="py-1 px-2 rounded-md cursor-pointer active:bg-gray-100"
          onClick={() => {
            copy(address);
            toast(t("wallet.copiedToClipboard"));
          }}
        >
          {abbreviateText(address, 4)}
        </span>
      </div>
      <div className="flex flex-col items-center p-4 pt-6 pb-8">
        <span className="text-sm">{t("wallet.homeTitle")}</span>
        <span className="mt-8 text-2xl font-bold">{`${balance / 100000000} ${
          network === "main" ? "BTC" : "tBTC"
        }`}</span>
        <div className="grid grid-cols-2 gap-4 mt-10 w-full">
          <Button
            theme="outline"
            text={t("wallet.send")}
            className=""
            onClick={() => {
              setIsOpenSendModal(true);
            }}
          />
          <Button
            theme="outline"
            text={t("wallet.receive")}
            className=""
            onClick={() => {
              setIsOpenReceiveModal(true);
            }}
          />
        </div>
      </div>
      <ReceiveModal
        address={address}
        visible={isOpenReceiveModal}
        onClose={handleClose}
      />
      <SendModal
        network={network}
        balance={balance}
        utxos={utxos}
        visible={isOpenSendModal}
        onClose={handleCloseSendModal}
        wallet={wallet}
      />
      <Toaster />
    </div>
  );
};

export default WalletOperator;
