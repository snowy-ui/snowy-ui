interface Path {
  pathname: string;
  search: string;
  hash: string;
}
type To = string | Partial<Path>;
type RelativeRoutingType = "route" | "path";
interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  reloadDocument?: boolean;
  replace?: boolean;
  state?: any;
  preventScrollReset?: boolean;
  relative?: RelativeRoutingType;
  to: To;
  unstable_viewTransition?: boolean;
}

export type ReactLinkProps = React.ForwardRefExoticComponent<
  LinkProps & React.RefAttributes<HTMLAnchorElement>
>;
