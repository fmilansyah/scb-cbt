import { CSSProperties, ReactNode } from "react"

interface Props {
  children?: ReactNode
  htmlType?: 'button' | 'submit'
  type?: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'secondary' | 'dark'
  rounded?: boolean
  outline?: boolean
  size?: 'lg' | 'md' | 'sm'
  block?: boolean
  style?: CSSProperties
  className?: string
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
}

const Button = ({
  children,
  htmlType,
  type,
  rounded,
  outline,
  size,
  block,
  style,
  className,
  loading,
  onClick,
  disabled,
}: Props) => {
  return (
    <button
      type={htmlType}
      className={`btn ${outline ? 'btn-outline' : 'btn'}-${type} ${rounded ? 'rounded-full' : ''} ${size !== 'md' ? 'btn-'+size : ''} ${block ? 'w-full' : ''} ${className}`}
      style={style}
      disabled={loading || disabled}
      onClick={onClick}
    >
      {loading && (
        <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
      )}
      {children}
    </button>
  )
}

Button.defaultProps = {
  children: '',
  htmlType: 'button',
  type: 'primary',
  rounded: false,
  outline: false,
  size: 'md',
  block: false,
  style: {},
  className: '',
  loading: false,
  disabled: false,
}

export default Button
