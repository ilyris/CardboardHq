import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import Page from "../app/page";
import fabSetData from "@/app/jsonData/FaBSet.json";

test("Sets Page", () => {
  render(<Page />);
  let setIds = fabSetData.map((set) => set.id);

  for (let i = 0; i < setIds.length; i++) {
    let setCard = document.getElementById(`set-card-${i}`);

    expect(setCard).toHaveLength(20);
  }
});
