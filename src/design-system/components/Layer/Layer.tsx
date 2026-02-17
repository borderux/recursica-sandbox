import { forwardRef } from 'react';
import styles from './Layer.module.css';

/**
 * Recursica design-system props for Layer.
 * Wraps children and sets data-recursica-layer so Recursica scoped CSS
 * (recursica_variables_scoped.css) applies that layer's brand variables to descendants.
 */
export interface RecursicaLayerProps {
  /** Layer (0–3). Sets data-recursica-layer on the root so descendants use this layer's styles. */
  layer: 0 | 1 | 2 | 3;
  /**
   * When true, the root uses display: contents (no box, not styled) and data-recursica-layer
   * is omitted so Recursica layer styling is not applied. Children still participate in the cascade.
   */
  contentsOnly?: boolean;
  children?: React.ReactNode;
}

export type LayerProps = RecursicaLayerProps & React.HTMLAttributes<HTMLDivElement>;

/**
 * Applies a Recursica layer context to its children. The root element has data-recursica-layer
 * so recursica_variables_scoped.css applies the corresponding --recursica_brand_layer_* variables
 * to descendants. Root is display: block so padding/background from style or className apply.
 */
export const Layer = forwardRef<HTMLDivElement, LayerProps>(function Layer(
  { layer, contentsOnly, children, className, style, ...rest },
  ref
) {
  const rootClassName = contentsOnly
    ? className
      ? `${styles.root} ${styles.contents} ${className}`
      : `${styles.root} ${styles.contents}`
    : className
      ? `${styles.root} ${className}`
      : styles.root;
  return (
    <div
      ref={ref}
      className={rootClassName}
      style={style}
      {...(contentsOnly ? {} : { 'data-recursica-layer': String(layer) })}
      {...rest}
    >
      {children}
    </div>
  );
});

Layer.displayName = 'Layer';
