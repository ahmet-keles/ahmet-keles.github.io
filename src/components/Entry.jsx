/** Date-column row shared by experience, education, and certifications. */
export default function Entry({ when, title, children }) {
  return (
    <div className="entry">
      <div className="entry-meta">{when}</div>
      <div className="entry-body">
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}
