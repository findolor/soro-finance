import clsx from "clsx"
import React, { ButtonHTMLAttributes } from "react"
import Text from "@/components/ui/text"
import { formatAddress } from "@/lib/utils/formatAddress"

export type ButtonVariant = 'connect' | 'address' | 'disconnect' | 'custom'

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  text: string
  onClick?: () => void
  variant?: ButtonVariant
  bgColor?: string
  size?: ButtonSize
  disabled?: boolean
}

const variantToColor: Record<Exclude<ButtonVariant, 'custom'>, string> = {
  connect: '#FFDC93',
  address: '#93B8FF',
  disconnect: '#FF9E9E',
}

const sizeToClass: Record<ButtonSize, string> = {
  sm: 'py-1 px-2 text-xs',
  md: 'py-2 px-4 text-sm',
  lg: 'py-3 px-6 text-base',
}

export const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant = 'custom',
  bgColor,
  size = 'md',
  disabled = false,
  className,
  ...rest
}) => {
  const bgColorClass = variant === 'custom' 
    ? '' 
    : variantToColor[variant]
  
  const sizeClass = sizeToClass[size]
  
  return (
    <button
      className={clsx(
        "flex justify-center items-center rounded-lg transition-colors",
        sizeClass,
        bgColorClass,
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={variant === 'custom' ? { backgroundColor: bgColor } : {}}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...rest}
    >
      <Text 
        text={text} 
        size="12" 
        lineHeight="16" 
        letterSpacing="0.2" 
        bold 
      />
    </button>
  )
}

export const ConnectWalletButton: React.FC<Omit<ButtonProps, 'text' | 'variant'>> = ({ 
  onClick, 
  ...rest 
}) => {
  return (
    <Button 
      text="Connect wallet" 
      onClick={onClick} 
      // variant="connect"
      bgColor="#FFDC93"
      {...rest}
    />
  )
}

export const AddressButton: React.FC<Omit<ButtonProps, 'text' | 'variant' | 'onClick'> & { 
  address: string 
}> = ({ 
  address, 
  ...rest 
}) => {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address)
      .catch(err => console.error('Failed to copy address:', err))
  }

  return (
    <Button
      text={formatAddress(address)}
      onClick={handleCopyAddress}
      // variant="address"
      bgColor="#93B8FF"
      title="Click to copy full address"
      {...rest}
    />
  )
}

export const DisconnectWalletButton: React.FC<Omit<ButtonProps, 'text' | 'variant'>> = ({ 
  onClick, 
  ...rest 
}) => (
  <Button 
    text="Disconnect" 
    onClick={onClick} 
    // variant="disconnect"
    bgColor="#FF9E9E"
    {...rest}
  />
)
