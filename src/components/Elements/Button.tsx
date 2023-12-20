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
}: Props) => {
  return (
    <button
      type={htmlType}
      className={`btn ${outline ? 'btn-outline' : 'btn'}-${type} ${rounded ? 'rounded-full' : ''} ${size !== 'md' ? 'btn-'+size : ''} ${block ? 'w-full' : ''} ${className}`}
      style={style}
    >
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
}

export default Button
