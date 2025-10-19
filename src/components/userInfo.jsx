
function UserName({ userName, setUserName }) {
  // Optionally provide a default no-op function to avoid errors
  return (
    <div>
      <label className="block text-lg font-semibold">Enter your name: </label>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="border rounded p-2 mt-2"
      />
    </div>
  );
}
export default UserName;