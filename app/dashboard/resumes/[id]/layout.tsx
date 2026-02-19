export default function ResumeEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout removes the default dashboard padding for the resume editor
  return <div className="-m-4 print:m-0">{children}</div>;
}
