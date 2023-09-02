import type { Story } from "@ladle/react";
import Layout from "./Layout";

export const LayoutStory: Story = () => (
  <div className="relative h-[720px] w-full max-w-sm origin-top-left scale-75 overflow-clip rounded-3xl border-[8px] border-gray-700">
    <Layout></Layout>
  </div>
);
