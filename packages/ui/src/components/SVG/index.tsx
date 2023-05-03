import { Carat } from './Carat';
import { Pencil } from './Pencil';
import { createElement } from 'react';

export type SVGType = keyof typeof SVG;

export const SVG = {
  Carat,
  Pencil,
};

export default SVG;

interface SVGByTypeProps {
  type: SVGType;
  colorHover?: string;
}

/** Use an SVG by specifying which one you want. You must pass a "type" prop! */
export const SvgByType = ({
  type,
  ...props
}: SVGByTypeProps & React.AllHTMLAttributes<any>) => {
  return createElement(SVG[type], props);
};
