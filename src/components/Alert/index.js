import React, {useMemo} from 'react'
import PropTypes from 'prop-types'
import {
  ErrorFilled,
  SuccessFilled,
  WarningFilled,
  InfoFilled,
} from '../../assets/svg'
import {Close} from '../../assets/svg'

function Alert({
  type = 'success',
  icon,
  className = '',
  width = 'w-100',
  open = false,
  closable = true,
  closeIcon,
  onClose,
  content,
  bordered = false,
}) {
  const typeToIcon = {
    success: <SuccessFilled className="w-4 h-4 mr-2" />,
    info: <InfoFilled className="w-4 h-4 mr-2" />,
    error: <ErrorFilled className="w-4 h-4 mr-2" />,
    warning: <WarningFilled className="w-4 h-4 mr-2" />,
  }
  const IconComponent = typeToIcon[type]

  const style = useMemo(() => {
    if (type === 'info')
      return `bg-info-10 border ${bordered ? 'border-info' : 'border-info-10'}`
    if (type === 'warning')
      return `bg-warning-10 border ${
        bordered ? 'border-warning' : 'border-warning-10'
      }`
    if (type === 'error')
      return `bg-error-10 border ${
        bordered ? 'border-error' : 'border-error-10'
      }`
    if (type === 'success')
      return `bg-success-10 border ${
        bordered ? 'border-success' : 'border-success-10'
      }`
  }, [bordered, type])

  const onCloseClick = e => {
    e.stopPropagation()
    if (closable) {
      onClose && onClose(e)
    }
  }

  const closeIconComp = closeIcon
    ? React.cloneElement(closeIcon, {
        className: `w-4 h-4 text-gray-40 ${closeIcon.props.className || ''}`,
      })
    : null

  if (!open) return null

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 ${style} ${width} ${className}`}
    >
      <div className="flex items-center">
        {icon || IconComponent || null}
        <span className="text-gray-80">{content}</span>
      </div>
      {closable && (
        <span aria-hidden="true" onClick={e => onCloseClick(e)}>
          {closeIcon ? (
            closeIconComp
          ) : (
            <Close
              className="w-4 h-4 text-gray-40"
              onClick={e => onCloseClick(e)}
            />
          )}
        </span>
      )}
    </div>
  )
}

export default Alert

Alert.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'error', 'warning']),
  className: PropTypes.string,
  width: PropTypes.string,
  open: PropTypes.bool,
  closable: PropTypes.bool,
  bordered: PropTypes.bool,
  onClose: PropTypes.func,
  closeIcon: PropTypes.node,
  icon: PropTypes.node,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}
