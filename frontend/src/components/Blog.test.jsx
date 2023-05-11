// import React from 'react'
// import '@testing-library/jest-dom/extend-expect'
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("Blog is", () => {
  let container;

  beforeEach(() => {
    const user = {
      userToken: "test",
    };
    const blog = {
      title: "um link",
      author: "meu",
      url: "meumm",
      user: {
        username: "lkol",
        name: "lourenco a",
        id: "641dcdf932cb94135a2f0e9e",
      },
      createdAt: "2023-04-08T13:37:47.287Z",
      updatedAt: "2023-04-08T13:37:47.287Z",
      likes: 0,
      dislikes: 0,
      tags: [
        {
          tag: "a-tag",
        },
        {
          tag: "ts",
        },
      ],
      id: "64316e2b69a05da6f341bd08",
    };
    container = render(<Blog blog={blog} user={user} />).container;
  });
  test("rendered with title, author and likes but not link", () => {
    const div = container.querySelector(".font-light");
    expect(div).toHaveTextContent("um link meu");
    const div2 = screen.getByText("open link");
    expect(div2).not.toBeVisible();
    const div3 = container.querySelector("#likes");
    expect(div3).toBeVisible();
  }),
    test("rendered with link and tags when expanded", async () => {
      const user = userEvent.setup();
      const button = screen.getByText("expand");
      await user.click(button);

      const div = screen.getByText("a-tag");
      expect(div).toBeVisible();

      const div2 = screen.getByText("open link");
      expect(div2).toBeVisible();
    });
});
