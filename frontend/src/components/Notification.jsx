import { useSelector } from "react-redux";

export default function Notification({ setter }) {
  const notif = useSelector((state) => state.notifications);

  if (notif) {
    return (
      <div>
        {notif.map((n) => (
          <div
            key={n.id}
            className={
              n.success
                ? "float bg-lime-300 text-lime-900 rounded-full"
                : "flex mx-auto bg-rose-500 text-white rounded-full"
            }
          >
            {n.message}
          </div>
        ))}
      </div>
    );
  }
}
