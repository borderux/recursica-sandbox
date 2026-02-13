import { forwardRef, type ReactNode } from 'react';
import { Button as MantineButton, type ButtonProps as MantineButtonProps } from '@mantine/core';
import styles from './Button.module.css';

const MAP_VARIANT: Record<string, 'filled' | 'outline' | 'subtle'> = {
  solid: 'filled',
  outline: 'outline',
  text: 'subtle',
};

const MAP_SIZE: Record<string, 'md' | 'sm'> = {
  default: 'md',
  small: 'sm',
};

function hasVisibleChildren(children: ReactNode): boolean {
  if (children == null || children === '') return false;
  if (typeof children === 'string') return children.trim() !== '';
  return true;
}

/**
 * Recursica design-system props for Button.
 * icon = leading (left) icon; use rightSection via rest for trailing icon.
 * Layer is not a prop; wrap in <Layer layer={0|1|2|3}> to set layer context.
 */
export interface RecursicaButtonProps {
  /** Visual style. */
  variant?: 'solid' | 'outline' | 'text';
  /** Size. */
  size?: 'default' | 'small';
  /** Leading (left) icon. Size is enforced by the button (Recursica token per size). For icon-only buttons, provide aria-label for accessibility. */
  icon?: React.ReactNode;
}

export type ButtonProps = RecursicaButtonProps & MantineButtonProps;

/**
 * Design-system Button wrapping Mantine, styled via Recursica ui-kit variables in Button.module.css.
 * Theme: set data-recursica-theme="light"|"dark" on an ancestor (e.g. html).
 * Layer: wrap in <Layer layer={0|1|2|3}>; do not pass layer as a prop.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'solid',
    size = 'default',
    icon,
    className,
    style,
    classNames,
    children,
    ...rest
  },
  ref
) {
  const mantineVariant = MAP_VARIANT[variant] ?? 'filled';
  const mantineSize = MAP_SIZE[size] ?? 'md';
  const restRecord = rest as Record<string, unknown>;
  const hasLeftSection = !!icon || !!restRecord['leftSection'];
  const hasRightSection = !!restRecord['rightSection'];
  const isIconOnly = (hasLeftSection || hasRightSection) && !hasVisibleChildren(children);

  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production' && isIconOnly && !restRecord['aria-label']) {
    console.warn(
      '[Recursica Button] Icon-only buttons must provide an accessible name. Pass aria-label (e.g. aria-label="Submit").'
    );
  }

  const mergedClassNames: Partial<Record<string, string>> = {
    root: styles.root,
    section: styles.section,
    label: styles.label,
  };
  if (classNames && typeof classNames === 'object' && !Array.isArray(classNames)) {
    const o = classNames as Partial<Record<string, string>>;
    mergedClassNames.root = o.root ? `${styles.root} ${o.root}` : styles.root;
    mergedClassNames.section = o.section ?? styles.section;
    mergedClassNames.label = o.label ?? styles.label;
  }

  return (
    <MantineButton
      ref={ref}
      variant={mantineVariant}
      size={mantineSize}
      leftSection={
        icon != null ? (
          <span className={styles.iconWrapper} aria-hidden>
            {icon}
          </span>
        ) : undefined
      }
      classNames={mergedClassNames}
      className={className}
      style={style}
      {...rest}
      {...(isIconOnly ? { 'data-icon-only': '' } : {})}
    >
      <span className={styles.labelText}>{children}</span>
    </MantineButton>
  );
});

Button.displayName = 'Button';
