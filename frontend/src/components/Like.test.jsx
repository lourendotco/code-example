import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Like from "./Like";

test("user cannot upvote twice", async () => {
  const likeBlog = vi.fn();
  const { rerender } = render(
    <Like blog_id="323" bloglikes={5} isLiked={0} likeBlog={likeBlog} />
  );
  const user = userEvent.setup();
  const button = screen.getAllByRole("button")[1];
  await user.click(button);
  expect(likeBlog.mock.calls).toHaveLength(1);
  rerender(
    <Like blog_id="323" bloglikes={5} isLiked={1} likeBlog={likeBlog} />
  );
  await user.click(button);
  expect(likeBlog.mock.calls).toHaveLength(1);
});
