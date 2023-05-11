import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Compose from "./Compose";
vi.mock("../services/blogs");

test("create new blog is called with the right parameters", async () => {
  const setterB = vi.fn();
  const user = userEvent.setup();
  const blogService = await import("../services/blogs");
  blogService.createNew = vi.fn().mockReturnValue({ data: {} });

  render(
    <Compose
      token="token"
      blogs={[]}
      setterB={setterB}
      setterN={() => 0}
      setterU={() => 0}
      setVisible={() => 0}
    />
  ).container;
  const name = screen.getByPlaceholderText("title");
  const author = screen.getByPlaceholderText("author");
  const url = screen.getByPlaceholderText("url");
  const submit = screen.getByRole("button");

  await user.type(name, "A blog's name");
  await user.type(author, "The blog's author");
  await user.type(url, "The url");
  await user.click(submit);

  expect(blogService.createNew.mock.calls[0]).toEqual([
    {
      title: "A blog's name",
      author: "The blog's author",
      url: "The url",
      tags: "",
    },
    "token",
  ]);
});
