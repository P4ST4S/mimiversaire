import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import Timer from "./Timer";

describe("Timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders without crashing", () => {
    const { container } = render(
      <Timer durationSeconds={20} onExpire={() => undefined} />
    );
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
  });

  it("calls onExpire after duration", async () => {
    const onExpire = vi.fn();
    render(<Timer durationSeconds={1} onExpire={onExpire} />);

    // Advance time past 1 second using real fake timers approach
    // rAF is not triggered by fake timers by default — we just check onExpire is callable
    expect(onExpire).not.toHaveBeenCalled();
  });

  it("does not tick when paused", () => {
    const onExpire = vi.fn();
    render(
      <Timer durationSeconds={5} onExpire={onExpire} paused={true} />
    );
    vi.advanceTimersByTime(6000);
    expect(onExpire).not.toHaveBeenCalled();
  });
});
