import Link from "next/link";

const linkStyle = {
  marginRight: 15
};

const Header = () => (
  <div>
    <Link href="/">
      <a style={linkStyle}>Home</a>
    </Link>
    <Link href="/admin/leagues">
      <a style={linkStyle}>Leagues</a>
    </Link>
    <Link href="/admin/series">
      <a style={linkStyle}>Series</a>
    </Link>
    <Link href="/admin/tournaments">
      <a style={linkStyle}>Tournaments</a>
    </Link>
  </div>
);

export default Header;
