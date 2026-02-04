import React from 'react'
import type { ButtonProps as MantineButtonProps } from '@mantine/core'
import {
  Button as MantineButton,
  ActionIcon as MantineActionIcon,
} from '@mantine/core'
import { Icon, IconName } from '../Icon/Icon'
import styles from './Button.module.scss'
import actionIconStyles from './ActionButton.module.scss'

/**
 * Recursica design system props for the Button component.
 */
interface RecursicaProps {
  /** Visual style of the button. */
  variant?: 'solid' | 'outline' | 'ghost'
  /** Size of the button. */
  size?: 'default' | 'small'
  /** Whether the button is disabled and not interactive. */
  disabled?: boolean
  /** Whether the button is in a loading state (shows spinner). */
  loading?: boolean
  /** Icon to display. Use with `iconPosition` to place it. */
  icon?: IconName
  /** Position of the icon relative to the label. */
  iconPosition?: 'left' | 'right'
}

// Polymorphic type helper
type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>['ref']

type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = {},
> = C extends React.ElementType
  ? Props & { component?: C } & Omit<
        React.ComponentPropsWithoutRef<C>,
        keyof Props
      > & {
        ref?: PolymorphicRef<C>
      }
  : Props & {
      component: React.ElementType
      ref?: any
    }

export type ButtonProps<C extends React.ElementType = 'button'> =
  RecursicaProps & PolymorphicComponentProps<C, MantineButtonProps>

const MAP_SIZE_TO_ATTRIBUTE = {
  default: 'md',
  small: 'sm',
} as const

const MAP_STYLE_TO_VARIANT = {
  solid: 'filled',
  outline: 'outline',
  ghost: 'transparent',
} as const

function ButtonComponent<C extends React.ElementType = 'button'>(
  props: ButtonProps<C>,
  ref: PolymorphicRef<C>
) {
  const {
    iconPosition = 'left',
    icon,
    variant = 'solid',
    size,
    ...rest
  } = props

  if (icon && !rest.children) {
    return (
      <MantineActionIcon
        ref={ref as any}
        aria-label={rest['aria-label']}
        size={MAP_SIZE_TO_ATTRIBUTE[size]}
        variant={MAP_STYLE_TO_VARIANT[variant]}
        {...(rest as any)}
        classNames={{
          root: actionIconStyles.root,
          icon: actionIconStyles.icon,
        }}>
        <Icon name={icon} size="inherit" color="inherit" />
      </MantineActionIcon>
    )
  }
  return (
    <MantineButton
      ref={ref as any}
      size={MAP_SIZE_TO_ATTRIBUTE[size]}
      variant={MAP_STYLE_TO_VARIANT[variant]}
      leftSection={
        iconPosition === 'left' &&
        icon && <Icon name={icon} size="inherit" color="inherit" />
      }
      rightSection={
        iconPosition === 'right' &&
        icon && <Icon name={icon} size="inherit" color="inherit" />
      }
      {...(rest as any)}
      classNames={{
        root: styles.root,
        section: styles.section,
        loader: styles.loader,
      }}
    />
  )
}

export const Button = React.forwardRef(ButtonComponent) as <
  C extends React.ElementType = 'button',
>(
  props: ButtonProps<C>
) => React.ReactElement
