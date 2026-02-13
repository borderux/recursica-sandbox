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
  children?: React.ReactNode;
}

export type LayerProps = RecursicaLayerProps & React.HTMLAttributes<HTMLDivElement>;

/**
 * Applies a Recursica layer context to its children. The root element has data-recursica-layer
 * so recursica_variables_scoped.css applies the corresponding --recursica_brand_layer_* variables
 * to descendants. Root is display: block so padding/background from style or className apply.
 */
export const Layer = forwardRef<HTMLDivElement, LayerProps>(function Layer(
  { layer, children, className, style, ...rest },
  ref
) {
  const rootClassName = className ? `${styles.root} ${className}` : styles.root;
  return (
    <div
      ref={ref}
      className={rootClassName}
      style={style}
      data-recursica-layer={String(layer)}
      {...rest}
    >
      {children}
    </div>
  );
});

Layer.displayName = 'Layer';
