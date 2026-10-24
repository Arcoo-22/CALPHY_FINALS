export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
  delay: _delay = 0,
}) {
  return <Tag className={className}>{children}</Tag>;
}
