
function UserName({ userName, setUserName }) {
  // Optionally provide a default no-op function to avoid errors
  const handleSetUserName = typeof setUserName === "function" ? setUserName : () => {};
  return (
    <div>
      <label className="block text-lg font-semibold">Enter your name: </label>
      <input
        type="text"
        value={userName}
        onChange={(e) => handleSetUserName(e.target.value)}
        className="border rounded p-2 mt-2"
      />
    </div>
  );
}
export default UserName;