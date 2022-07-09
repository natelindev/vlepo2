import Link from 'next/link';
import { useRouter } from 'next/router';

import { BaseNavLink } from './style';

type NavLinkProps = {
  href?: string;
  children: React.ReactNode;
  active?: boolean;
} & React.ComponentProps<typeof BaseNavLink>;

export default function NavLink(props: NavLinkProps): React.ReactElement {
  const router = useRouter();
  const { href, children, active = router.pathname === href, ...rest } = props;
  return href ? (
    <Link href={href} passHref>
      <BaseNavLink active={active} {...rest}>
        {children}
      </BaseNavLink>
    </Link>
  ) : (
    <BaseNavLink active={active} {...rest}>
      {children}
    </BaseNavLink>
  );
}
