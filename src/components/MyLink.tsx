import Link from 'next/link';

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
}

function MyLink({ href, children, ...rest }: Props) {
  return (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
  );
}

export default MyLink;
