import PropTypes from 'prop-types'
import {useTranslation, Trans} from 'react-i18next'
import {Modal, Loading, Button, Link} from '../../../components'
import {
  SupportedChains,
  ChainConfig,
  WalletConfig,
  KeyOfMetaMask,
} from '../../../constants/chainConfig'
import {ErrorOutlined, SuccessOutlined, MetamaskLogo} from '../../../assets/svg'
import useAddTokenToMetamask from '../../../hooks/useAddTokenToMetamask'
import {useIsNativeToken} from '../../../hooks/useWallet'
import {TxReceiptModalType} from '../../../constants'

function TransactionReceiptionModal({
  open,
  type,
  toChain,
  fromChain,
  value,
  fromToken,
  toToken,
  txHash,
  onClose,
}) {
  const {t} = useTranslation()
  const {addToken, success} = useAddTokenToMetamask(toToken)
  const isNativeToken = useIsNativeToken(toChain, toToken?.address)
  let content
  const onAddToken = () => {
    if (success) return
    addToken()
  }
  if (type === 'ongoing') {
    const tokenSymbol = fromToken && fromToken.display_symbol
    const chain = ChainConfig[toChain].fullName
    content = (
      <div className="flex flex-col items-center">
        <span>
          <Trans i18nKey="shuttleInfo" values={{value, tokenSymbol, chain}} />
        </span>
        <div className="bg-warning-10 text-warning-dark w-full px-6 pt-3 pb-6 mt-4 text-center">
          {t('confirm', {
            wallet: WalletConfig[ChainConfig[fromChain].wallet].name,
          })}
        </div>
      </div>
    )
    return (
      <Modal
        open={open}
        icon={<Loading />}
        title={t('waiting')}
        content={content}
        className="!pb-0 !px-0"
        onClose={onClose}
      />
    )
  } else if (type === 'success') {
    content = (
      <div className="flex flex-1 flex-col items-center">
        <Link href={ChainConfig[fromChain].scanTxUrl + txHash} target="_blank">
          {t('viewOnScan')}
        </Link>
        {ChainConfig[toChain].wallet === KeyOfMetaMask && !isNativeToken && (
          <Button
            variant="outlined"
            fullWidth
            className="mt-4"
            endIcon={!success ? <MetamaskLogo alt="metamaskLogo" /> : null}
            disabled={success}
            // TODO: deal with metamask is not installed
            onClick={onAddToken}
          >
            {success
              ? t('addedTokenToMetaMask', {
                  tokenSymbol: toToken && toToken.display_symbol,
                })
              : t('addTokenToMetaMask', {
                  tokenSymbol: toToken && toToken.display_symbol,
                })}
          </Button>
        )}
      </div>
    )
    return (
      <Modal
        open={open}
        title={t('submitted')}
        icon={<SuccessOutlined />}
        content={content}
        onClose={onClose}
      />
    )
  } else if (type === 'error') {
    content = (
      <div className="text-base font-medium text-error flex justify-center">
        {t('rejected')}
      </div>
    )
    return (
      <Modal
        open={open}
        icon={<ErrorOutlined />}
        content={content}
        onClose={onClose}
      />
    )
  }
}

TransactionReceiptionModal.propTypes = {
  open: PropTypes.bool,
  type: PropTypes.oneOf(Object.values(TxReceiptModalType)).isRequired,
  toChain: PropTypes.oneOf(SupportedChains),
  fromChain: PropTypes.oneOf(SupportedChains),
  value: PropTypes.string,
  fromToken: PropTypes.object,
  toToken: PropTypes.object,
  txHash: PropTypes.string,
}

export default TransactionReceiptionModal
