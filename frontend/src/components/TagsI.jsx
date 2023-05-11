import { useState } from "react";
export default function TagI({ NB, setterNB }) {
  const [tags, setTags] = useState([]);
  function handleKeyDown(e) {
    if (e.keyCode === 8) {
      if (e.target.value.trim()) return;
      setTags(tags.slice(0, -1));
      return;
    }
    if (e.key === " " || e.key === "Enter") {
      if (!e.target.value.trim()) return;
      e.preventDefault();
      const currentTags = [...tags, e.target.value];
      setTags(currentTags);
      setterNB({ ...NB, tags: currentTags });
      e.target.value = "";
    } else return;
  }
  // quando o utilizador carrega em submit sem fazer espaço no último tag isto não o envia
  const remove = (index) => setTags(tags.filter((e, i) => i !== index));

  return (
    <div className="overflow-x-scroll flex flex-wrap h-9 border-green-700 border p-1 rounded-md m-1 w-2/3 items-center gap-1">
      {tags.map((tag, index) => (
        <div
          className="bg-lime-100 inline-block py-0.5 px-1 rounded-md"
          key={tag + index}
        >
          <span className="text-lime-900">{tag}</span>
          <span
            className="bg-lime-900 rounded-full text-white inline-flex justify-center ml-0.5 p-0.5 font-light cursor-pointer"
            onClick={() => remove(index)}
          >
            &times;
          </span>
        </div>
      ))}
      <input
        type="text"
        className="flex-grow p-0.5 outline-0	text-lime-900 w-0 placeholder-lime-700"
        placeholder={!tags.length ? "add a tag" : ""}
        onKeyDown={handleKeyDown}
        name="tags"
      ></input>
    </div>
  );
}
