const getStatus = (link) => {
  if (link.isPaused) {
    return { text: "Paused", color: "bg-orange-100 text-orange-700" };
  }
  const now = new Date();
  const from = link.activeFrom ? new Date(link.activeFrom) : null;
  const until = link.activeUntil ? new Date(link.activeUntil) : null;

  if (from && from > now) {
    return { text: "Scheduled", color: "bg-cyan-100 text-cyan-700" };
  }
  if (until && until < now) {
    return { text: "Expired", color: "bg-slate-100 text-slate-600" };
  }
  return { text: "Active", color: "bg-green-100 text-green-700" };
};

const LinkStatus = ({ link }) => {
  const status = getStatus(link);
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
      {status.text}
    </span>
  );
};

export default LinkStatus;